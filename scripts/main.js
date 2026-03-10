// Om.AI Landing Page - Modern JavaScript Functionality

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

// Initialize hero video to ensure it loads and plays properly
function initializeHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;

    const videoOverlay = document.querySelector('.video-overlay');
    let hasPlayed = false;
    let loadTimeout;

    // Show loading state
    const showLoadingState = () => {
        if (videoOverlay) {
            videoOverlay.style.opacity = '1';
            videoOverlay.style.pointerEvents = 'auto';
        }
    };

    // Hide loading state
    const hideLoadingState = () => {
        if (videoOverlay) {
            videoOverlay.style.opacity = '0';
            videoOverlay.style.pointerEvents = 'none';
        }
    };

    // Function to attempt playing the video
    const playVideo = () => {
        if (hasPlayed) return; // Prevent multiple play attempts

        const playPromise = heroVideo.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Video started playing successfully
                    console.log('Hero video playing');
                    hasPlayed = true;
                    hideLoadingState();
                    clearTimeout(loadTimeout);
                })
                .catch(error => {
                    // Autoplay was prevented - this is normal on some browsers
                    console.log('Autoplay prevented, will play on user interaction:', error);

                    // Add a one-time click/touch listener to start video on first interaction
                    const startVideoOnInteraction = () => {
                        heroVideo.play()
                            .then(() => {
                                hasPlayed = true;
                                hideLoadingState();
                            })
                            .catch(e => console.log('Play on interaction failed:', e));
                        document.removeEventListener('click', startVideoOnInteraction);
                        document.removeEventListener('touchstart', startVideoOnInteraction);
                    };

                    document.addEventListener('click', startVideoOnInteraction, { once: true });
                    document.addEventListener('touchstart', startVideoOnInteraction, { once: true });
                });
        }
    };

    // Show initial loading state
    showLoadingState();

    // Set a timeout to force load attempt after 3 seconds if nothing has happened
    loadTimeout = setTimeout(() => {
        console.log('Video load timeout - forcing load attempt');
        if (!hasPlayed && heroVideo.readyState < 3) {
            heroVideo.load();
        }
    }, 3000);

    // Handle when video has loaded enough data to play
    heroVideo.addEventListener('loadeddata', () => {
        console.log('Video data loaded');
        playVideo();
    }, { once: true });

    // Handle when video can play through without buffering
    heroVideo.addEventListener('canplaythrough', () => {
        console.log('Video can play through');
        if (!hasPlayed) {
            playVideo();
        }
    }, { once: true });

    // Handle when video starts playing
    heroVideo.addEventListener('playing', () => {
        console.log('Video playing event fired');
        hasPlayed = true;
        hideLoadingState();
        clearTimeout(loadTimeout);
    }, { once: true });

    // Ensure video is ready before attempting to play
    if (heroVideo.readyState >= 3) {
        // Video is already loaded enough to play
        console.log('Video already ready, playing immediately');
        playVideo();
    } else if (heroVideo.readyState >= 2) {
        // Video metadata loaded, try to play
        console.log('Video metadata loaded, attempting play');
        playVideo();
    } else {
        // Wait for video to be ready and also start loading
        heroVideo.addEventListener('canplay', playVideo, { once: true });

        // Force load immediately
        heroVideo.load();
    }

    // Handle video stalling or errors
    heroVideo.addEventListener('stalled', () => {
        console.log('Video stalled, attempting to reload');
        if (!hasPlayed) {
            heroVideo.load();
        }
    });

    heroVideo.addEventListener('suspend', () => {
        console.log('Video loading suspended');
        // Browser has intentionally stopped loading - try to resume
        if (!hasPlayed && heroVideo.readyState < 3) {
            setTimeout(() => heroVideo.load(), 100);
        }
    });

    heroVideo.addEventListener('error', (e) => {
        console.error('Video error:', e);
        clearTimeout(loadTimeout);
        if (videoOverlay) {
            const playButton = videoOverlay.querySelector('.play-button');
            if (playButton) {
                playButton.style.display = 'block';
            }
        }
    });

    // Add click handler to overlay for manual play
    if (videoOverlay) {
        videoOverlay.addEventListener('click', () => {
            playVideo();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero video
    initializeHeroVideo();

    // Rest of the existing main.js functionality
    initializeExistingFeatures();

    // Initialize mobile carousel
    initializeMobileCarousel();


});

// Mobile Carousel functionality
function initializeMobileCarousel() {
    // Only initialize on mobile devices
    if (window.innerWidth <= 768) {
        const carouselSections = ['#features', '#how-it-works'];

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

    // Threshold: trigger when 15% visible
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px' // Percentage-based margin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with slight delay for smoother sequencing
                requestAnimationFrame(() => {
                    entry.target.classList.add('fade-in-visible');
                });
                // Stop observing after animation (one-time reveal)
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

// Word-by-word fade-in animation
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
    debounce,
    throttle,
    initializeTestimonialScroll,
    initializeScrollAnimations,
    initializeSmartDownloadLinks,
    initializeHeroVideo
};
