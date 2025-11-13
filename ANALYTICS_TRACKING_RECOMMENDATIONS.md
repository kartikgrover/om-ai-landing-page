# Om.AI Landing Page - Analytics Tracking Recommendations

**Date:** November 13, 2025
**Project:** Om.AI Landing Page (https://omai.app)
**Current Analytics Setup:** Google Analytics (GA4), Meta Pixel, Hotjar

---

## Executive Summary

This document provides a comprehensive analysis of all user interactions and engagement points across the Om.AI landing page that should be tracked with analytics. The recommendations are organized by priority level and include specific event names, parameters, and implementation guidance.

**Current Tracking Status:** Limited tracking identified
- Download button clicks (basic implementation exists)
- Feature card interactions (basic implementation exists)
- Scroll depth (milestone tracking at 25%, 50%, 75%, 90%)
- Time on page

**Gaps Identified:** Significant tracking opportunities missing for conversion-critical interactions

---

## PRIORITY 1: CRITICAL CONVERSION FUNNEL TRACKING

These are the most important interactions that directly indicate conversion intent and should be tracked immediately.

### 1.1 App Download Interactions

**Location:** Hero section, Navbar, Footer, Call-to-action buttons throughout

**Current Implementation:**
```javascript
function trackDownload(platform) {
    gtag('event', 'download_click', {
        'event_category': 'App Downloads',
        'event_label': platform,
        'value': 1
    });
}
```

**Issues with Current Implementation:**
- Only tracks basic click
- No distinction between Click-through vs. Store Page Visit
- Missing platform-specific intent metrics

**Enhanced Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `app_download_initiated` | Click on any download button | `platform` (android/ios), `button_location` (hero/navbar/footer/etc), `device_type` | Track download intent across all CTAs |
| `download_button_view` | Button enters viewport | `platform`, `button_location`, `button_text` | Measure CTA visibility |
| `download_store_page_visited` | User leaves site to app store | `platform`, `referrer_location`, `time_to_click` | Track successful redirect |
| `platform_conversion_flow` | Sequential tracking | `platform`, `funnel_step` (viewed > clicked > store_opened) | Map conversion funnel |

**Implementation Code:**
```javascript
// Enhanced download tracking
document.querySelectorAll('a[href*="play.google.com"], a[href*="apps.apple.com"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const platform = this.href.includes('google') ? 'android' : 'ios';
        const location = this.closest('.hero-cta') ? 'hero' :
                        this.closest('.navbar') ? 'navbar' :
                        this.closest('footer') ? 'footer' : 'other';
        
        gtag('event', 'app_download_initiated', {
            'event_category': 'Download Funnel',
            'event_label': `${platform}_${location}`,
            'platform': platform,
            'button_location': location,
            'device_type': getDeviceType()
        });
    });
});
```

---

### 1.2 Feature Card Interactions

**Location:** Features Section (6 feature cards)

**Current Implementation:**
```javascript
// Very basic, click-only tracking
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
        const featureName = this.querySelector('h4').textContent;
        trackFeature(featureName);
    });
});
```

**Enhanced Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `feature_card_view` | Card enters viewport | `feature_name`, `card_position` | Measure feature awareness |
| `feature_card_hover` | Mouse enter on card | `feature_name`, `hover_duration` | Measure feature interest |
| `feature_card_click` | Click on card | `feature_name`, `card_position`, `time_to_click` | Track active engagement |
| `feature_highlight_view` | Feature highlight (3 per card) enters viewport | `feature_name`, `highlight_text`, `highlight_index` | Track specific feature interest |
| `feature_interest_score` | Aggregate event | `feature_name`, `interest_level` (view/hover/click) | Identify most interesting features |

**Critical Features to Track:**
1. **AI Astrology Chat** - Primary engagement driver
2. **Marriage Compatibility** - High-intent feature
3. **Kundli/Birth Chart** - Primary feature
4. **Bhagavad Gita Wisdom** - Spiritual angle
5. **Sacred Mantras** - Engagement multiplier
6. **Planetary Positions** - Advanced feature

**Implementation Code:**
```javascript
// Feature card interaction tracking
document.querySelectorAll('.feature-card').forEach((card, index) => {
    const featureName = card.querySelector('h4').textContent.trim();
    
    // View tracking
    const viewObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'feature_card_view', {
                    'event_category': 'Feature Engagement',
                    'feature_name': featureName,
                    'card_position': index + 1,
                    'total_cards': 6
                });
                viewObserver.unobserve(entry.target);
            }
        });
    });
    viewObserver.observe(card);
    
    // Hover tracking
    let hoverStart = 0;
    card.addEventListener('mouseenter', () => {
        hoverStart = Date.now();
    });
    
    card.addEventListener('mouseleave', () => {
        const duration = Date.now() - hoverStart;
        gtag('event', 'feature_card_hover', {
            'event_category': 'Feature Engagement',
            'feature_name': featureName,
            'hover_duration_ms': duration
        });
    });
    
    // Click tracking
    card.addEventListener('click', () => {
        gtag('event', 'feature_card_click', {
            'event_category': 'Feature Engagement',
            'feature_name': featureName,
            'card_position': index + 1
        });
    });
    
    // Highlight tracking
    const highlights = card.querySelectorAll('.highlight');
    highlights.forEach((highlight, hIndex) => {
        const hlObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gtag('event', 'feature_highlight_view', {
                        'event_category': 'Feature Details',
                        'feature_name': featureName,
                        'highlight_text': highlight.textContent.trim(),
                        'highlight_index': hIndex + 1
                    });
                }
            });
        });
        hlObserver.observe(highlight);
    });
});
```

---

### 1.3 Video Engagement

**Location:** Hero Section (demo video - om-ai-demo.mp4)

**Current Implementation:** None

**Key Metrics:**
| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `video_view` | Video enters viewport | `video_title`, `video_duration` | Track video visibility |
| `video_play` | User presses play | `video_title`, `position` | Track intent to consume content |
| `video_progress` | Video milestones (25%, 50%, 75%, 100%) | `video_title`, `progress_percent`, `duration_watched` | Measure engagement depth |
| `video_complete` | Video ends or reaches 100% | `video_title`, `watch_time`, `completion_rate` | Track full consumption |
| `video_interaction` | Click play button overlay | `interaction_type` (play/pause/fullscreen) | Track engagement method |

**Implementation Code:**
```javascript
// Video engagement tracking
const videoElement = document.querySelector('.hero-video');
if (videoElement) {
    let isPlaying = false;
    let viewTracked = false;
    let progressTracked = { 25: false, 50: false, 75: false, 100: false };
    
    // View tracking
    const videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !viewTracked) {
                gtag('event', 'video_view', {
                    'event_category': 'Video Engagement',
                    'video_title': 'Om.AI App Demo',
                    'video_duration': Math.round(videoElement.duration)
                });
                viewTracked = true;
            }
        });
    });
    videoObserver.observe(videoElement);
    
    // Play tracking
    videoElement.addEventListener('play', () => {
        isPlaying = true;
        gtag('event', 'video_play', {
            'event_category': 'Video Engagement',
            'video_title': 'Om.AI App Demo',
            'current_time': Math.round(videoElement.currentTime)
        });
    });
    
    // Progress tracking
    videoElement.addEventListener('timeupdate', () => {
        const progress = Math.round((videoElement.currentTime / videoElement.duration) * 100);
        [25, 50, 75, 100].forEach(milestone => {
            if (progress >= milestone && !progressTracked[milestone]) {
                gtag('event', 'video_progress', {
                    'event_category': 'Video Engagement',
                    'video_title': 'Om.AI App Demo',
                    'progress_percent': milestone,
                    'watch_time': Math.round(videoElement.currentTime)
                });
                progressTracked[milestone] = true;
            }
        });
    });
    
    // Complete tracking
    videoElement.addEventListener('ended', () => {
        gtag('event', 'video_complete', {
            'event_category': 'Video Engagement',
            'video_title': 'Om.AI App Demo',
            'total_watch_time': Math.round(videoElement.currentTime),
            'completion_rate': 100
        });
    });
}
```

---

## PRIORITY 2: HIGH-VALUE ENGAGEMENT TRACKING

These interactions show strong engagement signals and conversion intent.

### 2.1 Navigation Interactions

**Location:** Navbar, internal anchor links throughout page

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `nav_click` | Click on navigation link | `nav_item` (Features/Support/Download), `nav_location` (navbar/inline) | Track navigation patterns |
| `section_scroll_to` | User scrolls to section via nav | `target_section` (hero/features/how-it-works/etc) | Measure section interest |
| `nav_menu_toggle` | Mobile menu open/close | `menu_state` (open/closed), `device_type` | Track mobile nav usage |
| `section_view_time` | Time spent in each section | `section_name`, `duration_seconds` | Identify engaging sections |

**Implementation Code:**
```javascript
// Navigation tracking
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const navItem = this.textContent.trim();
        
        gtag('event', 'nav_click', {
            'event_category': 'Navigation',
            'nav_item': navItem,
            'nav_location': this.closest('.navbar') ? 'navbar' : 'inline',
            'target_section': href.substring(1)
        });
    });
});

// Mobile menu tracking
document.querySelector('.navbar-toggler')?.addEventListener('click', function() {
    const isOpen = document.querySelector('.navbar-collapse').classList.contains('show');
    gtag('event', 'nav_menu_toggle', {
        'event_category': 'Navigation',
        'menu_state': isOpen ? 'open' : 'closed',
        'device_type': window.innerWidth <= 768 ? 'mobile' : 'tablet'
    });
});

// Section view time tracking
const sections = document.querySelectorAll('section[id]');
let sectionStartTime = {};

sections.forEach(section => {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            if (entry.isIntersecting) {
                sectionStartTime[sectionId] = Date.now();
            } else {
                if (sectionStartTime[sectionId]) {
                    const duration = Math.round((Date.now() - sectionStartTime[sectionId]) / 1000);
                    if (duration > 2) { // Only track if spent > 2 seconds
                        gtag('event', 'section_view_time', {
                            'event_category': 'Section Engagement',
                            'section_name': sectionId,
                            'duration_seconds': duration
                        });
                    }
                    delete sectionStartTime[sectionId];
                }
            }
        });
    }, { threshold: 0.5 });
    sectionObserver.observe(section);
});
```

---

### 2.2 Form Interactions

**Location:** Feedback page form

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `form_view` | Form enters viewport | `form_name`, `form_type` | Track form visibility |
| `form_start` | User clicks first form field | `form_name`, `first_field` | Track form engagement start |
| `form_field_focus` | Field receives focus | `form_name`, `field_name`, `field_type` | Track field progression |
| `form_field_fill` | Field is filled/changed | `form_name`, `field_name`, `field_type` | Measure form completion |
| `rating_star_hover` | Star rating hover | `current_rating`, `form_name` | Track rating hesitation |
| `rating_star_click` | Star rating selection | `final_rating`, `form_name` | Track rating submission |
| `form_submit` | Form submission | `form_name`, `completion_rate`, `fields_filled` | Track form completion |
| `form_error` | Form validation error | `form_name`, `field_name`, `error_type` | Track form issues |
| `form_abandon` | User leaves form incomplete | `form_name`, `progress_percent`, `last_field` | Track abandonment patterns |

**Implementation Code:**
```javascript
// Form tracking
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    let formStarted = false;
    let formFields = {};
    
    // Form view tracking
    const formObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'form_view', {
                    'event_category': 'Form Engagement',
                    'form_name': 'feedback_form',
                    'form_type': 'feedback'
                });
            }
        });
    });
    formObserver.observe(feedbackForm);
    
    // Track form interactions
    feedbackForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', () => {
            if (!formStarted) {
                formStarted = true;
                gtag('event', 'form_start', {
                    'event_category': 'Form Engagement',
                    'form_name': 'feedback_form',
                    'first_field': field.name
                });
            }
            
            gtag('event', 'form_field_focus', {
                'event_category': 'Form Engagement',
                'form_name': 'feedback_form',
                'field_name': field.name,
                'field_type': field.type
            });
        });
        
        field.addEventListener('change', () => {
            formFields[field.name] = true;
            gtag('event', 'form_field_fill', {
                'event_category': 'Form Engagement',
                'form_name': 'feedback_form',
                'field_name': field.name,
                'field_type': field.type,
                'completion_rate': Math.round((Object.keys(formFields).length / feedbackForm.elements.length) * 100)
            });
        });
    });
    
    // Rating star tracking
    document.querySelectorAll('.rating-star').forEach(star => {
        star.addEventListener('mouseenter', () => {
            gtag('event', 'rating_star_hover', {
                'event_category': 'Form Engagement',
                'current_rating': star.dataset.rating,
                'form_name': 'feedback_form'
            });
        });
        
        star.addEventListener('click', () => {
            gtag('event', 'rating_star_click', {
                'event_category': 'Form Engagement',
                'final_rating': star.dataset.rating,
                'form_name': 'feedback_form'
            });
        });
    });
    
    // Form submission
    feedbackForm.addEventListener('submit', (e) => {
        const completedFields = Object.keys(formFields).length;
        const totalFields = feedbackForm.elements.length;
        
        gtag('event', 'form_submit', {
            'event_category': 'Form Engagement',
            'form_name': 'feedback_form',
            'completion_rate': Math.round((completedFields / totalFields) * 100),
            'fields_filled': completedFields
        });
    });
    
    // Form abandon tracking
    window.addEventListener('beforeunload', () => {
        if (formStarted && feedbackForm.dataset.submitted !== 'true') {
            gtag('event', 'form_abandon', {
                'event_category': 'Form Engagement',
                'form_name': 'feedback_form',
                'progress_percent': Math.round((Object.keys(formFields).length / feedbackForm.elements.length) * 100),
                'last_field': Object.keys(formFields)[Object.keys(formFields).length - 1]
            });
        }
    });
}
```

---

### 2.3 Testimonials & Social Proof

**Location:** Testimonials section with 15+ reviews

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `testimonial_section_view` | Section enters viewport | `total_testimonials`, `platform_breakdown` | Track social proof visibility |
| `testimonial_card_view` | Individual testimonial enters viewport | `testimonial_index`, `author_name`, `rating` | Track which testimonials are seen |
| `testimonial_card_hover` | Mouse enter on testimonial | `testimonial_index`, `hover_duration` | Measure engagement |
| `testimonial_rating_view` | Star rating visible | `testimonial_index`, `rating_value` | Track star visibility |
| `testimonial_scroll_action` | User scrolls testimonials carousel | `scroll_direction` (left/right), `destination_index` | Track carousel usage |

**Implementation Code:**
```javascript
// Testimonials tracking
const testimonialSection = document.querySelector('#testimonials');
if (testimonialSection) {
    let sectionViewTracked = false;
    
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !sectionViewTracked) {
                const totalTestimonials = document.querySelectorAll('.testimonial-card').length;
                const platformBreakdown = {
                    'apple': document.querySelectorAll('.fab-apple').length,
                    'google': document.querySelectorAll('.fab-google-play').length
                };
                
                gtag('event', 'testimonial_section_view', {
                    'event_category': 'Social Proof',
                    'total_testimonials': totalTestimonials,
                    'apple_reviews': platformBreakdown.apple,
                    'google_reviews': platformBreakdown.google,
                    'average_rating': 4.8
                });
                sectionViewTracked = true;
            }
        });
    });
    sectionObserver.observe(testimonialSection);
    
    // Individual testimonial tracking
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        const testObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const rating = card.querySelectorAll('.fa-star').length;
                    const author = card.querySelector('.author-info strong')?.textContent || 'Unknown';
                    
                    gtag('event', 'testimonial_card_view', {
                        'event_category': 'Social Proof',
                        'testimonial_index': index + 1,
                        'author_name': author,
                        'rating': rating
                    });
                }
            });
        });
        testObserver.observe(card);
        
        // Hover tracking
        let hoverStart = 0;
        card.addEventListener('mouseenter', () => {
            hoverStart = Date.now();
        });
        card.addEventListener('mouseleave', () => {
            gtag('event', 'testimonial_card_hover', {
                'event_category': 'Social Proof',
                'testimonial_index': index + 1,
                'hover_duration_ms': Date.now() - hoverStart
            });
        });
    });
    
    // Carousel scroll tracking
    const scrollWrapper = document.querySelector('.testimonials-scroll-wrapper');
    if (scrollWrapper) {
        let lastScrollPosition = scrollWrapper.scrollLeft;
        
        scrollWrapper.addEventListener('scroll', throttle(() => {
            const currentPosition = scrollWrapper.scrollLeft;
            const direction = currentPosition > lastScrollPosition ? 'right' : 'left';
            
            gtag('event', 'testimonial_scroll_action', {
                'event_category': 'Social Proof',
                'scroll_direction': direction,
                'scroll_distance': Math.abs(currentPosition - lastScrollPosition)
            });
            
            lastScrollPosition = currentPosition;
        }, 500));
    }
}
```

---

## PRIORITY 3: USER BEHAVIOR & ENGAGEMENT TRACKING

These metrics provide insights into user behavior patterns and content effectiveness.

### 3.1 Screenshot/App Preview Engagement

**Location:** See Om.AI in Action section with 4 screenshots

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `screenshot_section_view` | Section enters viewport | `total_screenshots`, `section_name` | Track section visibility |
| `screenshot_view` | Individual screenshot loads | `screenshot_name` (home/birth-chart/ai-chat/compatibility), `index` | Track image visibility |
| `screenshot_hover` | Mouse enters screenshot | `screenshot_name`, `hover_duration` | Measure engagement |
| `screenshot_click` | Click on screenshot | `screenshot_name`, `index` | Track active interest |
| `mobile_carousel_interaction` | Carousel dot or swipe | `source_screenshot`, `destination_screenshot` | Track navigation |

**Implementation Code:**
```javascript
// Screenshot tracking
const screenshotSection = document.querySelector('#screenshots');
if (screenshotSection) {
    let sectionViewTracked = false;
    
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !sectionViewTracked) {
                gtag('event', 'screenshot_section_view', {
                    'event_category': 'App Preview',
                    'total_screenshots': document.querySelectorAll('.screenshot-card').length,
                    'section_name': 'screenshots'
                });
                sectionViewTracked = true;
            }
        });
    });
    sectionObserver.observe(screenshotSection);
    
    // Individual screenshot tracking
    document.querySelectorAll('.screenshot-card').forEach((card, index) => {
        const screenshotName = card.querySelector('h5')?.textContent || `screenshot_${index}`;
        const image = card.querySelector('.screenshot-image');
        
        // Image load tracking
        if (image) {
            image.addEventListener('load', () => {
                gtag('event', 'screenshot_view', {
                    'event_category': 'App Preview',
                    'screenshot_name': screenshotName,
                    'screenshot_index': index + 1,
                    'load_status': 'success'
                });
            });
        }
        
        // Hover tracking
        let hoverStart = 0;
        card.addEventListener('mouseenter', () => {
            hoverStart = Date.now();
        });
        
        card.addEventListener('mouseleave', () => {
            gtag('event', 'screenshot_hover', {
                'event_category': 'App Preview',
                'screenshot_name': screenshotName,
                'hover_duration_ms': Date.now() - hoverStart
            });
        });
        
        // Click tracking
        card.addEventListener('click', () => {
            gtag('event', 'screenshot_click', {
                'event_category': 'App Preview',
                'screenshot_name': screenshotName,
                'screenshot_index': index + 1
            });
        });
    });
}
```

---

### 3.2 How It Works Section

**Location:** 4-step funnel visualization

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `how_it_works_view` | Section enters viewport | `section_name` | Track section visibility |
| `step_card_view` | Individual step enters viewport | `step_number` (1-4), `step_title` | Track step visibility |
| `step_card_hover` | Mouse enters step | `step_number`, `hover_duration` | Measure engagement with process |

**Implementation Code:**
```javascript
// How It Works tracking
const howItWorksSection = document.querySelector('#how-it-works');
if (howItWorksSection) {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'how_it_works_view', {
                    'event_category': 'Content Engagement',
                    'section_name': 'how_it_works',
                    'total_steps': document.querySelectorAll('.step-card').length
                });
            }
        });
    });
    sectionObserver.observe(howItWorksSection);
    
    // Step card tracking
    document.querySelectorAll('.step-card').forEach((card, index) => {
        const stepNumber = index + 1;
        const stepTitle = card.querySelector('h4')?.textContent || `Step ${stepNumber}`;
        
        const stepObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gtag('event', 'step_card_view', {
                        'event_category': 'Process Flow',
                        'step_number': stepNumber,
                        'step_title': stepTitle
                    });
                }
            });
        });
        stepObserver.observe(card);
        
        // Hover tracking
        let hoverStart = 0;
        card.addEventListener('mouseenter', () => {
            hoverStart = Date.now();
        });
        card.addEventListener('mouseleave', () => {
            gtag('event', 'step_card_hover', {
                'event_category': 'Process Flow',
                'step_number': stepNumber,
                'hover_duration_ms': Date.now() - hoverStart
            });
        });
    });
}
```

---

### 3.3 External Link Tracking

**Location:** Footer, Support pages, Policy pages

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `external_link_click` | Click on external link | `link_url`, `link_text`, `link_category` | Track external traffic |
| `social_media_click` | Click on social media link | `social_platform` (facebook/instagram), `button_location` | Track social engagement |
| `support_page_click` | Click on support/help link | `destination_page`, `source_page` | Track support interest |
| `policy_page_click` | Click on policy links | `policy_type` (privacy/terms/refund), `source_page` | Track legal/policy interest |

**Implementation Code:**
```javascript
// External links tracking
document.querySelectorAll('a[target="_blank"], a[rel*="noopener"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const url = link.href;
        const text = link.textContent.trim();
        let category = 'external_link';
        
        // Categorize link
        if (url.includes('facebook') || url.includes('instagram')) {
            category = 'social_media';
        } else if (url.includes('support') || url.includes('help')) {
            category = 'support';
        } else if (url.includes('privacy') || url.includes('terms') || url.includes('refund')) {
            category = 'policy';
        }
        
        gtag('event', 'external_link_click', {
            'event_category': 'Outbound Links',
            'link_url': url,
            'link_text': text,
            'link_category': category,
            'source_page': document.body.dataset.page || 'unknown'
        });
    });
});

// Specific social media tracking
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', () => {
        const platform = link.href.includes('facebook') ? 'facebook' : 'instagram';
        
        gtag('event', 'social_media_click', {
            'event_category': 'Social Engagement',
            'social_platform': platform,
            'button_location': 'footer',
            'source_page': document.body.dataset.page || 'home'
        });
    });
});
```

---

## PRIORITY 4: TECHNICAL & PERFORMANCE TRACKING

These track user experience quality and technical performance.

### 4.1 Page Performance Metrics

**Tracking Recommendations:**

| Event Name | Trigger | Trigger Condition | Purpose |
|---|---|---|---|
| `page_load_time` | Page fully loaded | Track in analytics | Measure page speed |
| `largest_contentful_paint` | LCP metric | Browser API | Track visual completeness |
| `first_input_delay` | User first interaction | Browser API | Measure responsiveness |
| `cumulative_layout_shift` | Layout stability | Browser API | Track page stability |

**Implementation Code:**
```javascript
// Core Web Vitals tracking
if ('web-vital' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        gtag('event', 'page_view', {
            'event_category': 'Web Vitals',
            'lcp': Math.round(lastEntry.renderTime || lastEntry.loadTime)
        });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            gtag('event', 'page_view', {
                'event_category': 'Web Vitals',
                'fid': Math.round(entry.processingDuration)
            });
        });
    }).observe({ entryTypes: ['first-input'] });
}

// Page load time
window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    gtag('event', 'page_load_time', {
        'event_category': 'Performance',
        'page_load_time': pageLoadTime,
        'navigation_type': performance.navigation.type
    });
});
```

---

### 4.2 Device & Browser Tracking

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `session_device_info` | Page load | `device_type`, `os`, `browser` | Segment by device |
| `viewport_size` | Page load | `viewport_width`, `viewport_height` | Track responsive design usage |
| `network_status` | Page load | `connection_type` (4g/wifi/etc) | Segment by network |

**Implementation Code:**
```javascript
// Device and browser tracking
function trackDeviceInfo() {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const deviceType = isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop';
    
    gtag('set', {
        'user_device_type': deviceType,
        'user_os': getOS(userAgent),
        'user_browser': getBrowser(userAgent),
        'viewport_width': window.innerWidth,
        'viewport_height': window.innerHeight
    });
    
    // Network status
    if ('connection' in navigator) {
        const connection = navigator.connection;
        gtag('set', {
            'network_type': connection.effectiveType,
            'is_slow_connection': connection.effectiveType === '3g' || connection.effectiveType === '4g'
        });
    }
}

function getOS(userAgent) {
    if (userAgent.indexOf('Win') > -1) return 'Windows';
    if (userAgent.indexOf('Mac') > -1) return 'MacOS';
    if (userAgent.indexOf('Linux') > -1) return 'Linux';
    if (userAgent.indexOf('Android') > -1) return 'Android';
    if (userAgent.indexOf('iPhone') > -1) return 'iOS';
    return 'Unknown';
}

function getBrowser(userAgent) {
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    return 'Unknown';
}

// Call on page load
document.addEventListener('DOMContentLoaded', trackDeviceInfo);
```

---

## PRIORITY 5: MICRO-CONVERSIONS & INTENT SIGNALS

These track smaller conversion signals that indicate strong purchase intent.

### 5.1 Back-to-Top Button Usage

**Location:** Floating button (bottom right)

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `back_to_top_view` | Button becomes visible | `scroll_depth_percent` | Track re-engagement opportunity |
| `back_to_top_click` | User clicks button | `scroll_depth_at_click`, `page_section` | Track engagement depth |

---

### 5.2 Content Highlights

**Location:** Feature cards, Step cards

**Tracking Recommendations:**

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `highlight_text_view` | Highlight text visible | `highlight_text`, `feature_name` | Track feature details interest |
| `highlight_icon_view` | Icon visible | `icon_type`, `associated_text` | Track visual element engagement |

---

## PRIORITY 6: ADVANCED ANALYTICS SETUP

### 6.1 Custom Audiences & Segments

Create custom audiences based on user interactions:

```javascript
// Segment: High-Intent Users
// Definition: Viewed 3+ features AND clicked download OR viewed video
gtag('event', 'page_view', {
    'segment': calculateUserSegment()
});

function calculateUserSegment() {
    const featuresViewed = sessionStorage.getItem('featuresViewed') || 0;
    const downloadClicked = sessionStorage.getItem('downloadClicked') === 'true';
    const videoPlayed = sessionStorage.getItem('videoPlayed') === 'true';
    
    if (featuresViewed >= 3 && (downloadClicked || videoPlayed)) {
        return 'high_intent';
    } else if (featuresViewed >= 2) {
        return 'medium_intent';
    } else {
        return 'low_intent';
    }
}
```

**Audience Segments to Create:**

1. **Download Intent** - Clicked download button
2. **Feature Explorers** - Viewed 4+ feature cards
3. **Video Watchers** - Played app demo video
4. **Social Proof Engaged** - Scrolled testimonials or viewed multiple reviews
5. **Deep Engagers** - Spent 3+ minutes on site
6. **Form Starters** - Began filling feedback form
7. **Mobile Users** - Accessing from mobile devices
8. **High Converters** - Multiple conversion signals

---

### 6.2 Event-to-Revenue Mapping

Map events to approximate revenue impact:

| Event | Approximate Revenue Value | Notes |
|---|---|---|
| `app_download_initiated` | $0.50-2.00 | Potential user acquisition cost |
| `feature_card_click` | $0.10-0.50 | Engagement quality signal |
| `video_complete` | $0.25-1.00 | High conversion indicator |
| `form_submit` (feedback) | $0.30-1.00 | Direct engagement |
| `testimonial_section_view` | $0.05-0.20 | Social proof exposure |

---

### 6.3 Attribution Modeling

Set up proper attribution to understand customer journey:

```javascript
// Multi-touch attribution tracking
function trackUserJourney() {
    const journey = sessionStorage.getItem('userJourney') || [];
    
    // Record each interaction
    const events = [
        'feature_view',
        'video_play',
        'download_click',
        'form_submit'
    ];
    
    events.forEach(event => {
        gtag('event', event, {
            'journey_position': calculateJourneyPosition(event),
            'attribution_model': 'data_driven'
        });
    });
}

function calculateJourneyPosition(event) {
    const journey = JSON.parse(sessionStorage.getItem('userJourney') || '[]');
    journey.push(event);
    sessionStorage.setItem('userJourney', JSON.stringify(journey));
    return journey.length;
}
```

---

## IMPLEMENTATION PRIORITY & TIMELINE

### Phase 1 (Week 1-2): Critical Conversions
- [ ] Enhanced app download tracking (Priority 1.1)
- [ ] Feature card interaction tracking (Priority 1.2)
- [ ] Video engagement tracking (Priority 1.3)

### Phase 2 (Week 2-3): High-Value Engagement
- [ ] Navigation tracking (Priority 2.1)
- [ ] Form tracking (Priority 2.2)
- [ ] Testimonials tracking (Priority 2.3)

### Phase 3 (Week 3-4): User Behavior
- [ ] Screenshots tracking (Priority 3.1)
- [ ] Process flow tracking (Priority 3.2)
- [ ] External links tracking (Priority 3.3)

### Phase 4 (Week 4-5): Technical & Advanced
- [ ] Performance metrics (Priority 4)
- [ ] Device tracking (Priority 4.2)
- [ ] Custom audiences (Priority 6.1)

---

## RECOMMENDED TOOLS & INTEGRATIONS

### Current Stack
- **Google Analytics 4** (GA4) - Main analytics platform
- **Meta Pixel** - Conversion tracking & retargeting
- **Hotjar** - User behavior & heatmaps

### Recommended Additions
- **Google Analytics: Enhanced E-commerce** - Track funnel steps
- **Facebook Conversions API** - Better data accuracy
- **Amplitude or Mixpanel** - Event-based analytics
- **Contentsquare** - Session replay complementary to Hotjar
- **DataBox** - Real-time analytics dashboard

---

## MEASUREMENT DASHBOARD SETUP

### Key Metrics to Monitor

**Weekly Dashboard:**
1. Download clicks by platform (iOS vs Android)
2. Feature card click-through rates
3. Video play rate and completion rate
4. Form completion rate
5. Scroll depth distribution
6. Device breakdown

**Monthly Dashboard:**
1. Feature interest scoring (which features get most engagement)
2. Conversion funnel analysis (impression → click → download)
3. User segment performance
4. Traffic source analysis
5. Device type conversion rates

---

## CONVERSION FUNNEL DEFINITION

### Download Conversion Funnel

```
Landing Page View (100%)
    ↓
Feature Card View (85%)
    ↓
Feature Card Interaction (45%)
    ↓
Download Button View (60%)
    ↓
Download Click (15%)
    ↓
App Store Page Opened (100% of clicks)
    ↓
App Install (tracked in-app)
```

### Expected Metrics:
- **Click-through rate (CTR):** 15-25% of page viewers
- **Feature engagement rate:** 40-60% of viewers
- **Download conversion rate:** 2-5% of page viewers

---

## PRIVACY & COMPLIANCE CONSIDERATIONS

- Ensure GDPR compliance for all tracking
- Implement cookie consent before tracking non-essential data
- Use anonymized user IDs where possible
- Document all data collection for privacy policy
- Set appropriate data retention policies (typically 14-26 months)

---

## TESTING & VALIDATION

Before deploying tracking:

1. **Test in Google Analytics debugger**
   - Use `gtag.js` debugging
   - Verify event names and parameters

2. **Test in browser console**
   ```javascript
   // Check if gtag is loaded
   console.log(typeof gtag);
   // Manually trigger test event
   gtag('event', 'test_event');
   ```

3. **Use GA4 DebugView**
   - Enable debug mode during testing
   - Verify events appear in real-time

4. **Create test segments**
   - Set up test audience to validate data flow
   - Verify user journeys in Analytics

---

## MONTHLY REVIEW & OPTIMIZATION

1. **Review download conversion rate**
   - Target: 2-5% of page viewers
   - Action: A/B test button placement/copy if below 2%

2. **Review feature engagement**
   - Identify low-engagement features
   - Optimize feature card copy or positioning

3. **Review device performance**
   - Track iOS vs Android conversion rates
   - Optimize for dominant platform

4. **Review scroll depth**
   - Identify content "fold" for mobile
   - Reposition critical elements if needed

5. **Analyze user journeys**
   - Identify most common paths to download
   - Optimize that critical path

---

## CONCLUSION

This comprehensive analytics framework will provide insights into:
- Which features drive user interest
- Where users drop off in the conversion funnel
- Device and demographic performance
- Content effectiveness
- User engagement patterns

Implementing these recommendations will enable data-driven optimization of the landing page for maximum app downloads and user engagement.

**Next Steps:**
1. Review and approve recommendations
2. Prioritize implementation phases
3. Assign development resources
4. Begin Phase 1 implementation
5. Set up GA4 custom events and audiences
6. Create measurement plan and dashboard

---

**Document Version:** 1.0
**Last Updated:** November 13, 2025
**Recommended By:** Analytics Strategy Team
