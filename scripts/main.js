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
                // Add touch event listeners for better mobile interaction
                let startX = 0;
                let startY = 0;
                let scrollLeft = 0;
                let isHorizontalSwipe = false;
                
                row.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].pageX - row.offsetLeft;
                    startY = e.touches[0].pageY;
                    scrollLeft = row.scrollLeft;
                    isHorizontalSwipe = false;
                });
                
                row.addEventListener('touchmove', (e) => {
                    if (!startX) return;
                    
                    const x = e.touches[0].pageX - row.offsetLeft;
                    const y = e.touches[0].pageY;
                    const deltaX = Math.abs(x - startX);
                    const deltaY = Math.abs(y - startY);
                    
                    // Only handle horizontal swipes, allow vertical scrolling
                    if (deltaX > deltaY && deltaX > 10) {
                        isHorizontalSwipe = true;
                        e.preventDefault();
                        const walk = (x - startX) * 2;
                        row.scrollLeft = scrollLeft - walk;
                    } else if (!isHorizontalSwipe && deltaY > 10) {
                        // Allow vertical scrolling by not preventing default
                        return;
                    }
                });
                
                row.addEventListener('touchend', () => {
                    startX = 0;
                    startY = 0;
                    isHorizontalSwipe = false;
                });
                
                // Auto-snap to nearest card
                row.addEventListener('scrollend', () => {
                    const cardWidth = row.children[0]?.offsetWidth || 0;
                    const scrollPosition = row.scrollLeft;
                    const cardIndex = Math.round(scrollPosition / (cardWidth + 20));
                    const targetScroll = cardIndex * (cardWidth + 20);
                    
                    row.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                });
                
                // Update dots indicator (if we add interactive dots later)
                updateCarouselDots(sectionId, row);
            }
        });
    }
}

// Update carousel dots based on current position
function updateCarouselDots(sectionId, row) {
    // This function can be enhanced later to show active dot
    row.addEventListener('scroll', throttle(() => {
        const cardWidth = row.children[0]?.offsetWidth || 0;
        const scrollPosition = row.scrollLeft;
        const activeIndex = Math.round(scrollPosition / (cardWidth + 20));
        
        // Could update active dot styling here
        // For now, just log for debugging
        // console.log(`${sectionId} active card: ${activeIndex}`);
    }, 100));
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

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(element => {
        observer.observe(element);
    });

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
    // Multiple animation observers for different effects
    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    const slideInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    const scaleInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    
    // Apply different animations to different sections
    const fadeElements = document.querySelectorAll('.feature-card, .testimonial-card');
    const slideLeftElements = document.querySelectorAll('.step-card:nth-child(odd)');
    const slideRightElements = document.querySelectorAll('.step-card:nth-child(even)');
    const scaleElements = document.querySelectorAll('.screenshot-card');
    
    fadeElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
        fadeInObserver.observe(el);
    });
    
    slideLeftElements.forEach((el, index) => {
        el.classList.add('slide-in-left');
        el.style.animationDelay = `${index * 0.2}s`;
        slideInObserver.observe(el);
    });
    
    slideRightElements.forEach((el, index) => {
        el.classList.add('slide-in-right');
        el.style.animationDelay = `${index * 0.2}s`;
        slideInObserver.observe(el);
    });
    
    scaleElements.forEach((el, index) => {
        el.classList.add('scale-in');
        el.style.animationDelay = `${index * 0.15}s`;
        scaleInObserver.observe(el);
    });
    
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

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                // ServiceWorker registration successful
            })
            .catch(function(err) {
                // ServiceWorker registration failed
            });
    });
}

// Export functions for testing or external use
window.OmAI = {
    initializeNavigation,
    initializeScrollEffects,
    initializeAnimations,
    animateCounter,
    debounce,
    throttle
};
