#!/bin/bash
set -e

SCHEDULE_FILE="blog/drafts/schedule.json"
TODAY=$(date -u +%Y-%m-%d)
CHANGED=false

if [ ! -f "$SCHEDULE_FILE" ]; then
  echo "No schedule file found. Nothing to publish."
  echo "changed=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

# Get all posts scheduled for today or earlier
for FILE in $(jq -r "to_entries[] | select(.value.date <= \"$TODAY\") | .key" "$SCHEDULE_FILE"); do
  DRAFT_PATH="blog/drafts/$FILE"
  PUBLISH_PATH="blog/$FILE"

  if [ ! -f "$DRAFT_PATH" ]; then
    echo "Warning: Draft $DRAFT_PATH not found, skipping."
    continue
  fi

  echo "Publishing: $FILE"

  # Move draft to blog/
  mv "$DRAFT_PATH" "$PUBLISH_PATH"

  # Get metadata from schedule.json
  TAG=$(jq -r ".[\"$FILE\"].tag" "$SCHEDULE_FILE")
  TITLE=$(jq -r ".[\"$FILE\"].title" "$SCHEDULE_FILE")
  EXCERPT=$(jq -r ".[\"$FILE\"].excerpt" "$SCHEDULE_FILE")
  DATE_RAW=$(jq -r ".[\"$FILE\"].date" "$SCHEDULE_FILE")

  # Format date for display
  DISPLAY_DATE=$(date -d "$DATE_RAW" +"%B %-d, %Y" 2>/dev/null || echo "$DATE_RAW")

  # Build blog card HTML and insert before end marker using awk (sed-safe)
  CARD_HTML="                    <article class=\"blog-card\"><a href=\"/blog/$FILE\"><div class=\"blog-card-tag\">$TAG</div><h2>$TITLE</h2><p class=\"blog-card-excerpt\">$EXCERPT</p><span class=\"blog-card-date\">$DISPLAY_DATE</span></a></article>"

  awk -v card="$CARD_HTML" '{
    if ($0 ~ /<\/div><!-- end blog-grid -->/) {
      print card
    }
    print
  }' blog/index.html > blog/index.html.tmp && mv blog/index.html.tmp blog/index.html

  # Add to sitemap.xml using awk (safe from special characters)
  awk -v file="$FILE" -v date="$DATE_RAW" '{
    if ($0 ~ /<\/urlset>/) {
      printf "  <url>\n    <loc>https://omai.app/blog/%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n", file, date
    }
    print
  }' sitemap.xml > sitemap.xml.tmp && mv sitemap.xml.tmp sitemap.xml

  # Add to RSS feed if it exists (with proper RFC 822 date format)
  if [ -f "blog/feed.xml" ]; then
    RFC_DATE=$(date -d "$DATE_RAW" -u +"%a, %d %b %Y 00:00:00 +0000" 2>/dev/null || echo "$DATE_RAW")
    awk -v title="$TITLE" -v file="$FILE" -v excerpt="$EXCERPT" -v pubdate="$RFC_DATE" '{
      if ($0 ~ /<\/channel>/) {
        printf "    <item>\n      <title>%s</title>\n      <link>https://omai.app/blog/%s</link>\n      <description>%s</description>\n      <pubDate>%s</pubDate>\n      <guid>https://omai.app/blog/%s</guid>\n    </item>\n", title, file, excerpt, pubdate, file
      }
      print
    }' blog/feed.xml > blog/feed.xml.tmp && mv blog/feed.xml.tmp blog/feed.xml
  fi

  # Add to ItemList schema in blog/index.html
  NEXT_POS=$(grep -c '"@type": "ListItem"' blog/index.html)
  NEXT_POS=$((NEXT_POS + 1))
  JSON_TITLE=$(echo "$TITLE" | sed 's/"/\\"/g')
  NEW_ITEM=$(cat <<ITEMEOF
,
                {
                    "@type": "ListItem",
                    "position": $NEXT_POS,
                    "url": "https://omai.app/blog/$FILE",
                    "name": "$JSON_TITLE"
                }
ITEMEOF
)
  # Use awk to insert new ListItem before the ] that closes itemListElement
  awk -v item="$NEW_ITEM" '
    /itemListElement/ { in_list=1 }
    in_list && /\]/ { printf "%s\n", item; in_list=0 }
    { print }
  ' blog/index.html > blog/index.html.tmp && mv blog/index.html.tmp blog/index.html

  # Remove published entry from schedule.json
  jq "del(.[\"$FILE\"])" "$SCHEDULE_FILE" > tmp_schedule.json && mv tmp_schedule.json "$SCHEDULE_FILE"

  CHANGED=true
done

if [ "$CHANGED" = false ]; then
  echo "No posts due for publishing today ($TODAY)."
fi

echo "changed=$CHANGED" >> "$GITHUB_OUTPUT"
