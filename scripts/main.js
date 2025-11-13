// Om.AI Landing Page - Modern JavaScript Functionality

// Continuous Solar System Animation Tracker
class SolarSystemTracker {
    constructor() {
        this.startTime = Date.now();
        this.animationDurations = {
            mercury: 8000,   // 8s
            venus: 12000,    // 12s
            moon: 16000,     // 16s
            mars: 20000,     // 20s
            jupiter: 28000,  // 28s
            saturn: 36000,   // 36s
            rahu: 44000,     // 44s
            ketu: 48000      // 48s
        };
        
        this.initializeContinuousAnimation();
    }
    
    initializeContinuousAnimation() {
        // Get the session start time, or set it if this is the first page
        let sessionStartTime = sessionStorage.getItem('solarSystemStartTime');
        if (!sessionStartTime) {
            sessionStartTime = Date.now();
            sessionStorage.setItem('solarSystemStartTime', sessionStartTime.toString());
        } else {
            sessionStartTime = parseInt(sessionStartTime);
        }
        
        // Calculate how much time has elapsed since the session started
        const elapsedTime = Date.now() - sessionStartTime;
        
        // Apply dynamic animation delays based on elapsed time
        this.applyContinuousDelays(elapsedTime);
    }
    
    applyContinuousDelays(elapsedTime) {
        Object.keys(this.animationDurations).forEach(planet => {
            const container = document.querySelector(`.${planet}-container`);
            if (container) {
                const duration = this.animationDurations[planet];
                // Calculate how far through the current cycle we are
                const cycleProgress = elapsedTime % duration;
                // Convert to negative delay (how far back to start)
                const delay = -(cycleProgress / 1000);
                
                // Apply the calculated delay
                container.style.animationDelay = `${delay}s`;
            }
        });
    }
}

// Minimalist Elegant Section Animation System
function initializeSectionAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Simple fade-in for accessibility
        const simpleObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('fade-in');
            simpleObserver.observe(section);
        });
        return;
    }
    
    // Clean animation configurations - consistent slide-in animations
    const sectionAnimations = [
        { 
            selector: '#hero .hero-content', 
            animation: 'hero-animate', 
            delay: 0.1
        },
        { 
            selector: '#hero .hero-media', 
            animation: 'slide-in-right', 
            delay: 0.3
        },
        { 
            selector: '#features', 
            animation: 'slide-in-up', 
            stagger: '.feature-card',
            staggerType: 'sequential',
            delay: 0.2
        },
        { 
            selector: '#how-it-works', 
            animation: 'slide-in-left', 
            stagger: '.step-card',
            staggerType: 'sequential',
            delay: 0.3
        },
        { 
            selector: '#screenshots', 
            animation: 'slide-in-right', 
            stagger: '.screenshot-card',
            staggerType: 'sequential',
            delay: 0.2
        },
        { 
            selector: '#testimonials', 
            animation: 'slide-in-left', 
            stagger: '.testimonial-card',
            staggerType: 'sequential'
        },
        { 
            selector: '#download', 
            animation: 'slide-in-up', 
            delay: 0.1
        }
    ];
    
    // Precise intersection observer
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                
                // Trigger elegant entrance
                triggerElegantEntrance(section);
                
                // Unobserve after animation to improve performance
                sectionObserver.unobserve(section);
            }
        });
    }, observerOptions);
    
    // Apply clean animations to sections
    sectionAnimations.forEach(config => {
        const element = document.querySelector(config.selector);
        if (element) {
            element.classList.add(config.animation);
            element.dataset.animation = config.animation;
            element.dataset.delay = config.delay || 0;
            element.dataset.staggerType = config.staggerType || 'sequential';
            
            if (config.stagger) {
                element.dataset.stagger = config.stagger;
            }
            
            sectionObserver.observe(element);
        }
    });
    
    // Initialize minimal features
    initializeTitleAnimations();
    initializeFeatureHighlights();
}

// Trigger elegant entrance with refined timing
function triggerElegantEntrance(section) {
    const delay = parseFloat(section.dataset.delay) || 0;
    
    // Main animation trigger with precise timing
    setTimeout(() => {
        section.classList.add('visible');
        
        // Handle staggered animations
        if (section.dataset.stagger) {
            handleElegantStaggeredAnimation(section, section.dataset.stagger);
        }
        
    }, delay * 1000);
}

// Elegant sequential staggered animations
function handleElegantStaggeredAnimation(container, childSelector) {
    const children = container.querySelectorAll(childSelector);
    
    container.classList.add('stagger-children');
    
    children.forEach((child, index) => {
        child.classList.add('animate-item');
        
        // Simple sequential delay calculation - let CSS override where needed
        const delay = index * 0.08; // 80ms between each item
        child.style.animationDelay = `${delay}s`;
        
        // Add subtle hover enhancement
        addSubtleHoverEffect(child);
    });
    
    // Trigger staggered animation with precise timing
    setTimeout(() => {
        container.classList.add('visible');
    }, 150);
}

// Add subtle hover effect for refined interaction
function addSubtleHoverEffect(element) {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-2px)';
        element.style.transition = 'all 0.3s cubic-bezier(0.2, 0, 0.13, 1)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
        element.style.transition = 'all 0.3s cubic-bezier(0.2, 0, 0.13, 1)';
    });
}



// Animate section titles and subtitles
function initializeTitleAnimations() {
    const titleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
    
    // Animate section titles
    document.querySelectorAll('.section-title').forEach((title, index) => {
        title.classList.add('slide-in-down');
        title.style.transitionDelay = '0.1s';
        titleObserver.observe(title);
    });
    
    // Animate section subtitles
    document.querySelectorAll('.section-subtitle').forEach((subtitle, index) => {
        subtitle.classList.add('fade-in');
        subtitle.style.transitionDelay = '0.3s';
        titleObserver.observe(subtitle);
    });
}

// Enhanced feature highlights with individual animations
function initializeFeatureHighlights() {
    const highlightObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const highlights = entry.target.querySelectorAll('.highlight');
                highlights.forEach((highlight, index) => {
                    highlight.classList.add('fade-in');
                    highlight.style.transitionDelay = `${(index * 0.1) + 0.5}s`;
                    setTimeout(() => {
                        highlight.classList.add('visible');
                    }, (index * 100) + 500);
                });
                highlightObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('.feature-highlights').forEach(container => {
        highlightObserver.observe(container);
    });
}

// Initialize continuous solar system on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we have the solar system elements
    if (document.querySelector('.global-solar-system')) {
        new SolarSystemTracker();
    }
    
    // Rest of the existing main.js functionality
    initializeExistingFeatures();
    
    // Initialize mobile carousel
    initializeMobileCarousel();
    

});

// Mobile Carousel functionality
function initializeMobileCarousel() {
    // Only initialize on mobile devices
    if (window.innerWidth <= 768) {
        const carouselSections = ['#features', '#how-it-works', '#screenshots'];

        carouselSections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            const row = section?.querySelector('.row');

            if (row) {
                // Store original card count (no cloning for simplicity)
                const originalCards = Array.from(row.children);
                const cardCount = originalCards.length;

                // Ensure scroll starts at the beginning (first card)
                row.scrollLeft = 0;

                // Calculate card dimensions
                const cardWidth = originalCards[0].offsetWidth;
                const cardSpacing = 20; // margin-right between cards
                const cardWithSpacing = cardWidth + cardSpacing;
                
                // Create and initialize dynamic dots
                createCarouselDots(sectionId, row, cardCount);
                updateCarouselDots(sectionId, row, cardCount);
            }
        });
    }
}

// Create dynamic carousel dots
function createCarouselDots(sectionId, row, originalCardCount) {
    const section = document.querySelector(sectionId);
    
    // Create dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    dotsContainer.setAttribute('data-section', sectionId);
    
    // Create individual dots (only for original cards, not clones)
    for (let i = 0; i < originalCardCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        dot.setAttribute('data-index', i);
        
        // Add click handler to jump to card
        dot.addEventListener('click', () => {
            const cardWidth = row.children[0]?.offsetWidth || 0;
            const cardSpacing = 20;
            const cardWithSpacing = cardWidth + cardSpacing;
            // No clones, so just use the index directly
            const targetScroll = i * cardWithSpacing;
            row.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        });
        
        dotsContainer.appendChild(dot);
    }
    
    // Set first dot as active initially
    dotsContainer.children[0]?.classList.add('active');
    
    // Insert dots after the section
    section.appendChild(dotsContainer);
}

// Update carousel dots based on current position
function updateCarouselDots(sectionId, row, originalCardCount) {
    const dotsContainer = document.querySelector(`.carousel-dots[data-section="${sectionId}"]`);
    
    if (dotsContainer) {
        row.addEventListener('scroll', throttle(() => {
            const cardWidth = row.children[0]?.offsetWidth || 0;
            const cardSpacing = 20;
            const cardWithSpacing = cardWidth + cardSpacing;
            const scrollPosition = row.scrollLeft;

            // Calculate active index based on scroll position (no clones)
            let activeIndex = Math.round(scrollPosition / cardWithSpacing);

            // Ensure activeIndex is within bounds
            activeIndex = Math.max(0, Math.min(activeIndex, originalCardCount - 1));
            
            // Update active dot
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, 50));
    }
}

function initializeExistingFeatures() {
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for navigation links (exclude smart-download)
    document.querySelectorAll('a[href^="#"]:not([href="#smart-download"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Modern Section Animation System
    initializeSectionAnimations();

    // Feature card hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });


}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const navbarToggler = document.querySelector('.navbar-toggler');
                        navbarToggler.click();
                    }
                }
            }
        });
    });
}

// Advanced scroll effects and animations
function initializeScrollEffects() {
    // Enhanced animations are now handled by initializeSectionAnimations()
    // This provides more comprehensive and performant section-by-section animations
    
    // Enhanced parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    const heroMedia = document.querySelector('.hero-media');
    
    if (heroSection) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            const contentRate = scrolled * -0.1;
            const mediaRate = scrolled * 0.1;
            
            if (scrolled < heroSection.offsetHeight) {
                heroSection.style.transform = `translateY(${rate}px)`;
                if (heroContent) heroContent.style.transform = `translateY(${contentRate}px)`;
                if (heroMedia) heroMedia.style.transform = `translateY(${mediaRate}px)`;
            }
        }, 16));
    }
    
    // Magical scroll progress indicator
    createScrollProgress();
    
    // Section highlighting effect
    highlightCurrentSection();
}

// Create animated scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: #924622;
        z-index: 9999;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(146, 70, 34, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, 16));
}

// Highlight current section in navigation
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize animations
function initializeAnimations() {
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-item strong');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Stagger animation for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Hover effects for interactive elements (excluding feature cards which have CSS hover effects)
    const interactiveCards = document.querySelectorAll('.step-card, .testimonial-card, .screenshot-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Counter animation function
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^\d]/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayNumber = Math.floor(current);
        if (displayNumber >= 1000) {
            displayNumber = (displayNumber / 1000).toFixed(0) + 'K';
        }
        
        element.textContent = displayNumber + suffix;
    }, duration / steps);
}

// Back to top button functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Analytics and tracking
function initializeAnalytics() {
    // Track feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const featureName = this.querySelector('h4').textContent;
            if (typeof trackFeature === 'function') {
                trackFeature(featureName);
            }
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestone scroll depths
            if ([25, 50, 75, 90].includes(scrollPercent)) {
                if (typeof gtag === 'function') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'Engagement',
                        'event_label': `${scrollPercent}%`,
                        'value': scrollPercent
                    });
                }
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (typeof gtag === 'function' && timeSpent > 10) {
            gtag('event', 'time_on_page', {
                'event_category': 'Engagement',
                'event_label': 'seconds',
                'value': timeSpent
            });
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const debouncedScroll = debounce(function() {
    // Handle scroll events that don't need to run on every scroll
}, 100);

const throttledScroll = throttle(function() {
    // Handle scroll events that need more frequent updates
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);
window.addEventListener('scroll', throttledScroll);

// Error handling
window.addEventListener('error', function(e) {
            // JavaScript error handled
    // Could send to analytics or error tracking service
});

// Feature detection and progressive enhancement
if ('IntersectionObserver' in window) {
    // Modern browsers - full functionality
            // Full functionality enabled
} else {
    // Fallback for older browsers
            // Fallback mode enabled
    // Add polyfills or simplified functionality
}

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    // Handle keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        '/assets/logo.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();


// Testimonial Scroll Buttons
function initializeTestimonialScroll() {
    const scrollContainer = document.querySelector('.testimonials-scroll-container');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) {
        console.log('Testimonial scroll elements not found:', {
            scrollContainer: !!scrollContainer,
            scrollLeftBtn: !!scrollLeftBtn,
            scrollRightBtn: !!scrollRightBtn
        });
        return;
    }

    console.log('Testimonial scroll initialized');

    const scrollAmount = 400;

    scrollLeftBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Left button clicked, scrolling by', -scrollAmount);
        scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    scrollRightBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Right button clicked, scrolling by', scrollAmount);
        scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

// Initialize testimonial scroll on page load
document.addEventListener('DOMContentLoaded', initializeTestimonialScroll);

// Export functions for testing or external use
// Modern Scroll-Triggered Fade-In Animations (Intersection Observer)
function initializeScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Skip animations for users who prefer reduced motion
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('fade-in-visible');
        });
        return;
    }

    // Claude-style threshold: trigger when 15% visible
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px' // Claude uses percentage-based margin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with slight delay for smoother sequencing
                requestAnimationFrame(() => {
                    entry.target.classList.add('fade-in-visible');
                });
                // Stop observing after animation (one-time reveal like Claude)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards, sections, and text elements
    const elementsToAnimate = document.querySelectorAll(
        '.feature-card, .step-card, .testimonial-card, .content-card, .screenshot-card, .section-title, .section-subtitle'
    );

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScrollAnimations);
} else {
    initializeScrollAnimations();
}

// Smart Download Link - Detects iOS/Android and redirects accordingly
function initializeSmartDownloadLinks() {
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.omai.app';
    const iosUrl = 'https://apps.apple.com/us/app/om-ai/id6630366988';

    // Detect user's device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMac = /Mac/i.test(userAgent) && !isIOS; // Desktop Mac users

    // Get default smart download URL based on device
    // Mac users likely have iPhones, Android users have Android phones, else default to iOS
    const smartDownloadUrl = isAndroid ? androidUrl : iosUrl;

    // Update all smart download links
    document.querySelectorAll('a[href="#smart-download"]').forEach(link => {
        link.href = smartDownloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        // Update button text based on device
        const currentText = link.textContent.trim();
        if (isIOS) {
            link.textContent = 'Download on iOS';
        } else if (isAndroid) {
            link.textContent = 'Download on Android';
        } else if (isMac) {
            link.textContent = 'Download on iOS'; // Mac users likely have iPhones
        } else {
            link.textContent = 'Download App';
        }
    });
}

// Initialize smart download links when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSmartDownloadLinks);
} else {
    initializeSmartDownloadLinks();
}

// Word-by-word fade-in animation (Claude-style)
function initializeWordAnimation() {
    const animatedHeadings = document.querySelectorAll('[data-animate-words]');

    animatedHeadings.forEach(heading => {
        const text = heading.textContent;
        const words = text.trim().split(/\s+/);

        // Clear the heading
        heading.textContent = '';
        heading.setAttribute('aria-label', text);

        // Wrap each word in a span
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.textContent = word;
            wordSpan.style.opacity = '0';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.transform = 'translateY(10px)';
            wordSpan.setAttribute('aria-hidden', 'true');

            heading.appendChild(wordSpan);

            // Add space after word (except last word)
            if (index < words.length - 1) {
                heading.appendChild(document.createTextNode(' '));
            }
        });
    });

    // Animate words on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const words = entry.target.querySelectorAll('.word');
                words.forEach((word, index) => {
                    setTimeout(() => {
                        word.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    }, index * 100); // 100ms delay between each word
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    animatedHeadings.forEach(heading => observer.observe(heading));
}

// Initialize word animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWordAnimation);
} else {
    initializeWordAnimation();
}

window.OmAI = {
    initializeNavigation,
    initializeScrollEffects,
    initializeAnimations,
    animateCounter,
    debounce,
    throttle,
    initializeTestimonialScroll,
    initializeScrollAnimations,
    initializeSmartDownloadLinks
};
