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

// Hover effect handled entirely via CSS :hover rules (no JS needed)
// Removed JS mouseenter/mouseleave to avoid inline style writes that force style recalc
function addSubtleHoverEffect(element) {
    // no-op: CSS handles .feature-card:hover, .step-card:hover, etc.
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
                    hasPlayed = true;
                    hideLoadingState();
                    clearTimeout(loadTimeout);
                })
                .catch(error => {
                    // Autoplay was prevented - this is normal on some browsers
                    // Add a one-time click/touch listener to start video on first interaction
                    const startVideoOnInteraction = () => {
                        // Yield to browser so the user's click paints first
                        setTimeout(() => {
                            heroVideo.play()
                                .then(() => {
                                    hasPlayed = true;
                                    hideLoadingState();
                                })
                                .catch(() => {});
                        }, 0);
                        document.removeEventListener('click', startVideoOnInteraction);
                        document.removeEventListener('touchstart', startVideoOnInteraction);
                    };

                    document.addEventListener('click', startVideoOnInteraction, { once: true });
                    document.addEventListener('touchstart', startVideoOnInteraction, { once: true, passive: true });
                });
        }
    };

    // Show initial loading state
    showLoadingState();

    // Set a timeout to force load attempt after 3 seconds if nothing has happened
    loadTimeout = setTimeout(() => {
        if (!hasPlayed && heroVideo.readyState < 3) {
            heroVideo.load();
        }
    }, 3000);

    // Handle when video has loaded enough data to play
    heroVideo.addEventListener('loadeddata', () => {
        playVideo();
    }, { once: true });

    // Handle when video can play through without buffering
    heroVideo.addEventListener('canplaythrough', () => {
        if (!hasPlayed) {
            playVideo();
        }
    }, { once: true });

    // Handle when video starts playing
    heroVideo.addEventListener('playing', () => {
        hasPlayed = true;
        hideLoadingState();
        clearTimeout(loadTimeout);
    }, { once: true });

    // Ensure video is ready before attempting to play
    if (heroVideo.readyState >= 3) {
        playVideo();
    } else if (heroVideo.readyState >= 2) {
        playVideo();
    } else {
        // Wait for video to be ready and also start loading
        heroVideo.addEventListener('canplay', playVideo, { once: true });

        // Force load immediately
        heroVideo.load();
    }

    // Handle video stalling or errors
    heroVideo.addEventListener('stalled', () => {
        if (!hasPlayed) {
            heroVideo.load();
        }
    });

    heroVideo.addEventListener('suspend', () => {
        // Browser has intentionally stopped loading - try to resume
        if (!hasPlayed && heroVideo.readyState < 3) {
            setTimeout(() => heroVideo.load(), 100);
        }
    });

    heroVideo.addEventListener('error', () => {
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
        // Cache dots NodeList at init time to avoid querySelectorAll in scroll handler
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        let lastActiveIndex = 0;
        row.addEventListener('scroll', throttle(() => {
            const cardWidth = row.children[0]?.offsetWidth || 0;
            const cardWithSpacing = cardWidth + 20;
            const scrollPosition = row.scrollLeft;

            // Calculate active index based on scroll position (no clones)
            let activeIndex = Math.round(scrollPosition / cardWithSpacing);

            // Ensure activeIndex is within bounds
            activeIndex = Math.max(0, Math.min(activeIndex, originalCardCount - 1));

            // Only update DOM if active dot changed
            if (activeIndex !== lastActiveIndex) {
                dots[lastActiveIndex]?.classList.remove('active');
                dots[activeIndex]?.classList.add('active');
                lastActiveIndex = activeIndex;
            }
        }, 50), { passive: true });
    }
}

function initializeExistingFeatures() {
    // Back to Top Button + Navbar scroll effect (combined into single passive listener)
    const backToTopButton = document.getElementById('backToTop');
    const navbar = document.querySelector('.navbar');
    if (backToTopButton || navbar) {
        let scrollTicking = false;
        window.addEventListener('scroll', function() {
            if (!scrollTicking) {
                requestAnimationFrame(function() {
                    const scrollY = window.pageYOffset;
                    if (backToTopButton) {
                        if (scrollY > 300) {
                            backToTopButton.classList.add('show');
                        } else {
                            backToTopButton.classList.remove('show');
                        }
                    }
                    if (navbar) {
                        if (scrollY > 50) {
                            navbar.classList.add('scrolled');
                        } else {
                            navbar.classList.remove('scrolled');
                        }
                    }
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        if (backToTopButton) {
            backToTopButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Smooth scrolling for navigation links (exclude smart-download)
    // Cache targets at init time to avoid querySelector in click handler
    document.querySelectorAll('a[href^="#"]:not([href="#smart-download"]):not([href="#"])').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });

    // Modern Section Animation System
    initializeSectionAnimations();

    // Feature card hover effects — handled via CSS transitions to avoid JS style recalc


}






// Utility functions
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


// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    // Handle keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    // Only remove if present, to avoid unnecessary style invalidation on every tap
    if (document.body.classList.contains('keyboard-navigation')) {
        document.body.classList.remove('keyboard-navigation');
    }
});

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
    throttle,
    initializeScrollAnimations,
    initializeSmartDownloadLinks,
    initializeHeroVideo
};
