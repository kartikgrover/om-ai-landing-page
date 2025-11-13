# Om.AI Analytics Tracking - Quick Reference Guide

## Quick Overview

**Current Setup:**
- Google Analytics 4 (GA4)
- Meta Pixel
- Hotjar

**Current Tracking (Limited):**
- Download clicks
- Feature card clicks
- Scroll depth (25%, 50%, 75%, 90%)
- Time on page

---

## Critical Events to Add (Priority 1)

### 1. App Download Tracking
**Events to implement:**
- `app_download_initiated` - When user clicks download
- `download_button_view` - When download button visible
- `download_store_page_visited` - When user redirects to app store

**Key Parameters:**
- `platform` (ios/android)
- `button_location` (hero/navbar/footer)
- `device_type`

---

### 2. Feature Card Tracking (Enhanced)
**Events to implement:**
- `feature_card_view` - Card visible on page
- `feature_card_hover` - Mouse enters card
- `feature_card_click` - User clicks card
- `feature_highlight_view` - Feature details/highlights visible

**Features to track:**
1. AI Astrology Chat
2. Marriage Compatibility
3. Kundli/Birth Chart
4. Bhagavad Gita Wisdom
5. Sacred Mantras
6. Planetary Positions

---

### 3. Video Engagement
**Events to implement:**
- `video_view` - Video in viewport
- `video_play` - User plays video
- `video_progress` - Milestones (25%, 50%, 75%, 100%)
- `video_complete` - Video finished or 100% watched

---

## High-Value Events (Priority 2)

### 1. Navigation Clicks
- `nav_click` - Any navigation link clicked
- `nav_menu_toggle` - Mobile menu open/close
- `section_view_time` - Time spent in each section

### 2. Form Interactions (Feedback Form)
- `form_view` - Form visible
- `form_start` - First field focused
- `form_field_focus` - Field focused
- `form_field_fill` - Field filled
- `form_submit` - Form submitted
- `form_abandon` - User leaves form incomplete
- `rating_star_click` - Star rating selection

### 3. Testimonials/Social Proof
- `testimonial_section_view` - Reviews section visible
- `testimonial_card_view` - Individual review visible
- `testimonial_card_hover` - Review card hovered
- `testimonial_scroll_action` - Carousel scrolled

---

## User Behavior Events (Priority 3)

### 1. Screenshots/App Preview
- `screenshot_section_view` - Section visible
- `screenshot_view` - Individual screenshot loads
- `screenshot_hover` - Screenshot hovered
- `screenshot_click` - Screenshot clicked

### 2. How It Works Section
- `how_it_works_view` - Section visible
- `step_card_view` - Individual step visible
- `step_card_hover` - Step hovered

### 3. External Links
- `external_link_click` - Click external link
- `social_media_click` - Click social link
- `support_page_click` - Click support link
- `policy_page_click` - Click policy link

---

## Technical Tracking (Priority 4)

### Performance Metrics
- `page_load_time` - Total page load time
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### Device Tracking
- Device type (iOS/Android/Desktop)
- OS
- Browser
- Network type
- Viewport size

---

## Key Conversion Metrics to Monitor

### Download Funnel
```
100% - Page view
85%  - Feature visible
45%  - Feature interaction
60%  - Download button visible
15%  - Download click (TARGET: 2-5%)
```

### Expected Performance
- **Feature engagement rate:** 40-60% of visitors
- **Download CTR:** 15-25% of page viewers
- **Download conversion:** 2-5% of page viewers
- **Scroll depth:** 50%+ reach features section

---

## Event Naming Convention

**Pattern:** `{action}_{subject}` or `{object}_{action}`

**Examples:**
- `feature_card_view` (object_action)
- `form_field_focus` (object_property_action)
- `video_complete` (object_action)

**Categories to use:**
- Download Funnel
- Feature Engagement
- Video Engagement
- Navigation
- Form Engagement
- Social Proof
- Content Engagement
- Outbound Links
- Performance
- Device Info

---

## Custom Dimensions (Recommended)

Add to GA4 for better segmentation:

1. **Traffic Source Quality**
   - `traffic_intent_level` (high/medium/low)

2. **User Segment**
   - `user_segment` (high_intent/medium_intent/low_intent)

3. **Device Details**
   - `device_category` (mobile/tablet/desktop)
   - `connection_type` (4g/wifi/3g)

4. **Feature Interest**
   - `primary_feature_interest`
   - `features_viewed_count`

---

## Custom Metrics (Recommended)

1. **feature_engagements** - Count of feature interactions
2. **download_button_views** - Count of download button impressions
3. **time_to_first_interaction** - Time before first click
4. **video_completion_rate** - Percentage of video watched

---

## Implementation Checklist

### Phase 1 (Week 1-2)
- [ ] App download enhanced tracking
- [ ] Feature card tracking (all 6 features)
- [ ] Video engagement tracking
- [ ] Test in GA4 Debug View

### Phase 2 (Week 2-3)
- [ ] Navigation tracking
- [ ] Form tracking
- [ ] Testimonials tracking
- [ ] Create test segments

### Phase 3 (Week 3-4)
- [ ] Screenshots tracking
- [ ] How it works tracking
- [ ] External links tracking
- [ ] Set up dashboards

### Phase 4 (Week 4-5)
- [ ] Performance metrics
- [ ] Device tracking
- [ ] Custom audiences
- [ ] Launch full tracking

---

## Testing Steps

1. **Enable GA4 Debug View**
   - Visit: Google Analytics > Debug View
   - Load your site
   - Events should appear in real-time

2. **Test Event Firing**
   - Open browser console
   - Click elements
   - Check gtag calls in Network tab

3. **Verify Parameters**
   - Ensure all event parameters are correct
   - Check data types (string/number/boolean)

4. **Create Test Segment**
   - In GA4: Admin > Custom definitions
   - Create "test_traffic" segment
   - Verify data collection

---

## Dashboard Essentials

**Weekly Metrics:**
- Download clicks by platform
- Feature card engagement
- Video play rate/completion
- Form completion rate
- Device breakdown

**Monthly Metrics:**
- Feature interest scores
- Conversion funnel analysis
- Traffic source performance
- User segment trends
- Device conversion rates

---

## Revenue Attribution

**Estimated Event Values (optional):**
- `app_download_initiated`: $0.50-2.00
- `feature_card_click`: $0.10-0.50
- `video_complete`: $0.25-1.00
- `form_submit`: $0.30-1.00
- `testimonial_section_view`: $0.05-0.20

---

## Key Files

**Current Analytics Implementation:**
- `/index.html` - Lines 94-119 (GA4, Meta Pixel, Hotjar setup)
- `/scripts/main.js` - Lines 665-711 (Current tracking functions)

**Pages with Forms:**
- `/feedback.html` - Form submission tracking needed

**Key Sections:**
- Hero (lines 311-375) - Video & downloads
- Features (lines 377-482) - 6 feature cards
- How It Works (lines 484-523) - 4-step process
- Screenshots (lines 525-580) - App preview
- Testimonials (lines 582-909) - 15+ reviews
- Footer (lines 914-983) - Links & CTAs

---

## Useful GA4 Resources

- GA4 Event naming best practices
- GA4 Debug View documentation
- GA4 Custom events setup
- GA4 Audiences creation
- GA4 Conversion tracking

---

## Monthly Review Checklist

- [ ] Check download conversion rate (target: 2-5%)
- [ ] Review feature engagement rankings
- [ ] Analyze iOS vs Android performance
- [ ] Check video completion rate
- [ ] Review form abandonment
- [ ] Analyze scroll depth distribution
- [ ] Check device type performance
- [ ] Review traffic source quality

---

## Common Issues & Fixes

**Event not showing in GA4:**
- Check event name (lowercase, underscores)
- Verify gtag is loaded
- Check browser console for errors
- Enable Debug View to see real-time

**Parameters not saving:**
- Ensure parameters are in event config
- Check data types (strings must be quoted)
- Verify parameter names match GA4 settings

**Audience not populating:**
- Give it 24-48 hours for data
- Check audience definition logic
- Verify events are firing with correct parameters

---

## Next Steps

1. **Review this document** with team
2. **Prioritize implementation phases**
3. **Assign developers**
4. **Set up test environment**
5. **Begin Phase 1 implementation**
6. **Create GA4 custom events in Admin**
7. **Test thoroughly before launching**

---

**Document Version:** 1.0
**Updated:** November 13, 2025
**Status:** Ready for Implementation
