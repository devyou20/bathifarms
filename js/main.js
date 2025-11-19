// Main JavaScript for Bathi Farms Website

// Performance optimization - Cache DOM selectors
const DOM = {
  header: document.querySelector('.header'),
  heroMedia: document.querySelector('.hero-media'),
  themeToggle: document.querySelector('.theme-toggle'),
  navToggle: document.querySelector('.nav-toggle'),
  navLinks: document.querySelector('.nav-links'),
  lightbox: document.querySelector('.lightbox'),
  lightboxImg: document.querySelector('.lightbox-img'),
  lightboxClose: document.querySelector('.lightbox-close'),
  galleryItems: document.querySelectorAll('.g-item'),
  testimonialScroller: document.querySelector('.t-scroller'),
  testimonialDots: document.querySelectorAll('.testimonial-dot'),
  animatedElements: document.querySelectorAll('[data-animate]'),
  productCarousel: document.querySelector('.product-carousel'),
  productCarouselWrapper: document.querySelector('.carousel-wrapper'),
  productItems: document.querySelectorAll('.product'),
  prevButton: document.querySelector('.carousel-prev'),
  nextButton: document.querySelector('.carousel-next'),
  productDots: document.querySelector('.product-dots')
};

// Update year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Sticky Header with optimized scroll handling
let lastScrollY = 0;
let ticking = false;

const onScroll = () => {
  lastScrollY = window.scrollY;
  
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Toggle header compact class
      if (lastScrollY > 10) DOM.header.classList.add('compact');
      else DOM.header.classList.remove('compact');
      
      // Simple parallax effect on hero image with performance check
      if (DOM.heroMedia && lastScrollY < 1000) { // Only apply parallax within viewport
        const yPos = lastScrollY * 0.25;
        DOM.heroMedia.style.transform = `translateY(${yPos}px)`;
      }
      
      ticking = false;
    });
    
    ticking = true;
  }
};

// Use passive event listener for better scroll performance
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile Nav Toggle with accessibility improvements
DOM.navToggle?.addEventListener('click', () => {
  const isOpen = DOM.navLinks?.classList.toggle('open');
  DOM.navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close on link click (mobile)
DOM.navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (DOM.navLinks.classList.contains('open')) {
      DOM.navLinks.classList.remove('open');
      DOM.navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// GSAP Animations with ScrollTrigger
const initGSAPAnimations = () => {
  // Use vibrant animations on all devices
  const isMobile = window.innerWidth < 768;
  
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger is not loaded.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  // Group elements by their parent sections for staggered animations
  const sections = {};
  
  // First, group elements by their closest section
  animatedElements.forEach((el) => {
    // Find the closest parent section or container
    const closestSection = el.closest('section, .products, .process-steps, .gallery-grid, .testimonials') || 'global';
    const sectionId = closestSection.id || closestSection.className || 'global';
    
    if (!sections[sectionId]) {
      sections[sectionId] = [];
    }
    sections[sectionId].push(el);
  });
  
  // Now animate elements with proper staggering within each section but with faster animations
  Object.entries(sections).forEach(([sectionId, elements]) => {
    elements.forEach((el, index) => {
      const animationType = el.dataset.animate || 'fade';
      const customStagger = parseFloat(el.dataset.stagger || 0);
      const trigger = el.dataset.trigger ? document.querySelector(el.dataset.trigger) : el;
      
      // Dramatic delays between cards for visible impact
      const delay = (index * 0.3) + (customStagger * 0.2);
      
      const isProcessItem = el.classList.contains('process-item');

      let config = {
        scrollTrigger: {
          trigger: trigger,
          start: 'top 95%',  // Increased threshold to start animations sooner
          toggleActions: 'play none none none',
          once: true,  // Ensure animation only plays once
          markers: false
        },
        opacity: 0,
        // Longer duration for dramatic effect
        duration: 1.5,
        delay: delay,
        ease: 'back.out(2.2)'
      };

    // Special, dramatic animation for the "Ethically Raised" section items
    if (isProcessItem) {
        config.y = 100; 
        config.scale = 0.8;
        config.rotation = -12;
        config.duration = 1.0; // Faster animation
        config.ease = 'elastic.out(1, 0.6)';
    // Enhanced card animations for all card-like elements - mimicking the Quality assurance badges
    } else if (el.classList.contains('product') || el.classList.contains('card') || el.classList.contains('kpi') || el.classList.contains('badge') || el.classList.contains('price') || el.classList.contains('step')) {
        // Subtle, non-offset animations for cards
        config.y = 0;
        config.x = 0;
        config.scale = el.classList.contains('badge') ? 0.9 : 0.96;
        config.rotation = 0;
        config.duration = 0.9;
        config.ease = 'power2.out';
        config.transformOrigin = 'center';
        // Add slight opacity pulse at the end
        gsap.to(el, {
            delay: delay + 0.8,
            opacity: 0.85,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
    } else {
        // Enhanced animation configurations for all elements with dramatic impact
        if (animationType.includes('fade')) {
          config.duration = 1.2; // Faster animation
          config.ease = 'power3.out';
        }
        if (animationType.includes('up')) {
          config.y = 80; // Less distance for faster appearance
          config.rotationX = 25; // Less extreme rotation
          config.duration = 1.2; // Faster animation
        }
        if (animationType.includes('down')) {
          config.y = -80; // Less distance for faster appearance
          config.rotationX = -25; // Less extreme rotation
          config.duration = 1.2; // Faster animation
        }
        if (animationType.includes('left')) {
          config.x = -80; // Less distance for faster appearance
          config.rotationY = 25; // Less extreme rotation
          config.duration = 1.2; // Faster animation
        }
        if (animationType.includes('right')) {
          config.x = 80; // Less distance for faster appearance
          config.rotationY = -25; // Less extreme rotation
          config.duration = 1.2; // Faster animation
        }
        if (animationType.includes('zoom')) {
          config.scale = 0.7; // Less extreme scale for faster appearance
          config.duration = 1.2; // Faster animation
        }
        if (animationType.includes('flip')) {
          config.rotationY = 90; // Less extreme rotation
          config.duration = 1.0; // Faster animation
        }
        if (animationType.includes('spin')) {
          config.rotation = 360; // Less extreme rotation
          config.duration = 1.0; // Faster animation
        }
    }

        
    // CRITICAL FIX: Use gsap.fromTo() instead of gsap.from() to ensure elements end up visible
    gsap.fromTo(el, 
      // FROM state (initial)
      {
        opacity: 0,
        y: config.y || 0,
        x: config.x || 0,
        scale: config.scale || 1,
        rotationX: config.rotationX || 0,
        rotationY: config.rotationY || 0,
        rotation: config.rotation || 0
      },
      // TO state (final) - this ensures elements become visible
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        rotation: 0,
        duration: config.duration,
        delay: config.delay,
        ease: config.ease,
        // Add subtle hover-like effects during animation
        transformOrigin: 'center center',
        force3D: true, // Enable hardware acceleration
        scrollTrigger: config.scrollTrigger,
              }
    );
    });
  });
};

// Theme Toggle with localStorage persistence and prefers-color-scheme detection
const initTheme = () => {
  // Check for user preference in localStorage first
  let theme = localStorage.getItem('theme');
  
  // If no stored preference, check system preference
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update button accessibility
  if (DOM.themeToggle) {
    DOM.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
};

// Initialize theme on page load
initTheme();

// Theme toggle click handler
DOM.themeToggle?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update button accessibility
  DOM.themeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  // Only apply if user hasn't manually set a preference
  if (!localStorage.getItem('theme')) {
    const newTheme = event.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  }
});

// Enhanced Lightbox for Gallery with better accessibility and performance
const openLightbox = (src, alt='Preview') => {
  if (!DOM.lightbox || !DOM.lightboxImg) return;
  
  // Preload the image to prevent layout shift
  const preloadImg = new Image();
  preloadImg.onload = () => {
    DOM.lightboxImg.src = src;
    DOM.lightboxImg.alt = alt;
    
    // Open the lightbox after image is loaded
    DOM.lightbox.classList.add('open');
    DOM.lightbox.setAttribute('aria-hidden', 'false');
    
    // Focus the close button for keyboard accessibility
    if (DOM.lightboxClose) DOM.lightboxClose.focus();
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };
  
  preloadImg.src = src;
  
  // Show loading state while image loads
  DOM.lightbox.classList.add('loading');
};

const closeLightbox = () => {
  if (!DOM.lightbox) return;
  
  DOM.lightbox.classList.remove('open');
  DOM.lightbox.classList.remove('loading');
  DOM.lightbox.setAttribute('aria-hidden', 'true');
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Clean up the src after transition completes to free memory
  setTimeout(() => {
    if (DOM.lightboxImg) DOM.lightboxImg.src = '';
  }, 300);
};

// Set up gallery click handlers
DOM.galleryItems?.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const img = item.querySelector('img');
    if (img) openLightbox(img.src, img.alt);
  });
  
  // Add keyboard accessibility
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', 'Open gallery image');
  
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    }
  });
});

// Close button event
DOM.lightboxClose?.addEventListener('click', closeLightbox);

// Click outside to close
DOM.lightbox?.addEventListener('click', (e) => {
  if (e.target === DOM.lightbox) closeLightbox();
});

// Escape key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Enhanced Testimonials auto-scroll with performance optimizations
let scrollInterval;
let currentIndex = 0;
let isScrolling = false;

// Optimize dot updates
const updateActiveDot = (index) => {
  if (!DOM.testimonialDots) return;
  
  // Update only the dots that need to change state
  DOM.testimonialDots.forEach((dot, i) => {
    if ((i === index && !dot.classList.contains('active')) ||
        (i !== index && dot.classList.contains('active'))) {
      dot.classList.toggle('active');
    }
  });
};

// Scroll to testimonial
const scrollToTestimonial = (index) => {
  if (!DOM.testimonialScroller || isScrolling) return;
  
  const targetItem = DOM.testimonialScroller.children[index];
  if (!targetItem) return;
  
  // Flag to prevent multiple scroll operations
  isScrolling = true;
  
  // Update active state for dots
  updateActiveDot(index);
  
  // Perform scroll
  DOM.testimonialScroller.scrollTo({
    left: targetItem.offsetLeft,
    behavior: 'smooth'
  });
  
  // Reset scrolling flag after animation completes
  setTimeout(() => {
    isScrolling = false;
  }, 500);
};

// Auto-scroll function
const startAutoScroll = () => {
  if (!DOM.testimonialScroller?.children.length) return;
  
  scrollInterval = setInterval(() => {
    if (document.visibilityState === 'visible' && !isScrolling) {
      currentIndex = (currentIndex + 1) % DOM.testimonialScroller.children.length;
      scrollToTestimonial(currentIndex);
    }
  }, 5000);
};

// Initialize auto-scroll if element exists
if (DOM.testimonialScroller) {
  // Start after page load to ensure proper positioning
  window.addEventListener('load', () => {
    // Set initial dot state
    updateActiveDot(currentIndex);
    
    // Start auto-scroll with delay
    setTimeout(startAutoScroll, 1000);
  });
  
  // Set up scroll event listeners
  DOM.testimonialScroller.addEventListener('scroll', () => {
    // Determine current testimonial based on scroll position
    if (!isScrolling && DOM.testimonialScroller.children.length) {
      const scrollPos = DOM.testimonialScroller.scrollLeft;
      const itemWidth = DOM.testimonialScroller.children[0].offsetWidth;
      const spacing = parseInt(getComputedStyle(DOM.testimonialScroller).columnGap) || 30;
      
      // Calculate current index from scroll position
      const newIndex = Math.round(scrollPos / (itemWidth + spacing));
      
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateActiveDot(currentIndex);
      }
    }
  }, { passive: true });
  
  // Pause auto-scroll on hover/touch
  DOM.testimonialScroller.addEventListener('mouseenter', () => {
    clearInterval(scrollInterval);
  });
  
  DOM.testimonialScroller.addEventListener('mouseleave', () => {
    clearInterval(scrollInterval);
    startAutoScroll();
  });
  
  // Pause when not visible to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      clearInterval(scrollInterval);
    } else {
      clearInterval(scrollInterval);
      startAutoScroll();
    }
  });
}

// Dot navigation with performance improvements
DOM.testimonialDots?.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    // Update index and scroll
    currentIndex = i;
    scrollToTestimonial(currentIndex);
    
    // Reset auto-scroll timer
    clearInterval(scrollInterval);
    startAutoScroll();
  });
  
  // Keyboard accessibility
  dot.setAttribute('tabindex', '0');
  dot.setAttribute('role', 'button');
  dot.setAttribute('aria-label', `View testimonial ${i+1}`);
  
  dot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dot.click();
    }
  });
});

// Detect swipe for mobile
if (DOM.testimonialScroller) {
  let touchStartX = 0;
  let touchEndX = 0;
  
  DOM.testimonialScroller.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  DOM.testimonialScroller.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) < swipeThreshold) return;
    
    if (diff > 0) {
      // Swiped left, go to next
      currentIndex = Math.min(currentIndex + 1, DOM.testimonialScroller.children.length - 1);
    } else {
      // Swiped right, go to previous
      currentIndex = Math.max(currentIndex - 1, 0);
    }
    
    scrollToTestimonial(currentIndex);
    
    // Reset auto-scroll
    clearInterval(scrollInterval);
    startAutoScroll();
  };
}

// Product Carousel Functionality (center-focused, no autoplay)
const productCarousel = (() => {
  function init() {
    const carousel = document.querySelector('.product-carousel');
    if (!carousel) return;

    const wrapper = carousel.querySelector('.carousel-wrapper');
    const products = Array.from(wrapper?.querySelectorAll('.product') || []);
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.product-dots');
    if (!wrapper || !products.length) return;

    let selected = 0;
    const scaleStep = 0.08; // scale reduction per step away from center

    const getSpacing = () => (window.innerWidth < 768 ? 0.46 : 0.55);

    // Prevent GSAP section animations from overriding our transforms
    products.forEach(p => p.removeAttribute('data-animate'));

    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      products.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'product-dot';
        dot.setAttribute('aria-label', `View product ${i + 1}`);
        dot.addEventListener('click', () => select(i));
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      const dots = dotsContainer?.querySelectorAll('.product-dot');
      dots?.forEach((d, i) => {
        d.classList.toggle('active', i === selected);
        d.setAttribute('aria-current', i === selected ? 'true' : 'false');
      });
    }

    function cardWidthPx() {
      const w = getComputedStyle(products[0]).width;
      return parseFloat(w) || 320;
    }

    function positionCards() {
      const stepX = (cardWidthPx() + 30) * getSpacing();
      const N = products.length;

      // Force a reflow before updating styles to ensure smooth transitions
      void wrapper.offsetHeight;

      // Initialize all cards to be visible immediately on page load
      if (!window.carouselInitialized) {
        products.forEach(card => {
          card.style.visibility = 'visible';
          card.style.opacity = '0.7';
        });
        window.carouselInitialized = true;
      }

      products.forEach((card, idx) => {
        // Circular relative offset in range (-N/2, N/2]
        let rel = (idx - selected + N) % N;
        if (rel > N / 2) rel -= N;

        // Always show three cards (-1, 0, 1)
        const isVisible = rel >= -1 && rel <= 1;
        const abs = Math.abs(rel);
        const x = rel * stepX;
        const scale = rel === 0 ? 1 : 0.85;
        const opacity = rel === 0 ? 1 : 0.7;

        // Consolidate style changes for performance and add robust transitions
        card.style.cssText = `
          position: absolute;
          left: 50%;
          width: ${cardWidthPx()}px;
          transform: translate(-50%, 0) translateX(${x}px) scale(${scale});
          z-index: ${100 - abs};
          opacity: ${isVisible ? opacity : 0};
          visibility: ${isVisible ? 'visible' : 'hidden'};
          pointer-events: ${rel === 0 && isVisible ? 'auto' : 'none'};
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, box-shadow 0.3s ease;
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        `;

        card.classList.toggle('selected', rel === 0);
        card.setAttribute('aria-hidden', isVisible ? (rel === 0 ? 'false' : 'true') : 'true');
      });

      updateDots();
      syncStageHeight();
    }

    function syncStageHeight() {
      // ensure stage is tall enough for current card size
      const heights = products.map(c => c.offsetHeight);
      const maxH = Math.max.apply(null, heights);
      // Apply a safe minimum to avoid early collapse before images load
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const minH = isMobile ? 520 : 480;
      wrapper.style.height = Math.max(maxH, minH) + 'px';
    }

    function select(i) {
      selected = (i + products.length) % products.length;
      positionCards();
    }

    // Controls
    prevButton?.addEventListener('click', () => select(selected - 1));
    nextButton?.addEventListener('click', () => select(selected + 1));

    // Click a side card to focus it
    products.forEach((card, idx) => {
      card.addEventListener('click', () => { if (idx !== selected) select(idx); });
      // Prevent selecting when clicking action buttons inside the card
      card.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => e.stopPropagation());
      });
    });

    // Swipe on the wrapper
    let startX = 0;
    wrapper.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) select(dx < 0 ? selected + 1 : selected - 1);
    }, { passive: true });

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); select(selected - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); select(selected + 1); }
    });

    // Init
    positionCards();
    // Run again on next paint to avoid initial flash/stack
    requestAnimationFrame(positionCards);
    // And once more after images/fonts load
    window.addEventListener('load', positionCards, { once: true });

    // Debounced resize to avoid layout thrashing
    const debounce = (fn, delay = 120) => {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), delay);
      };
    };
    const onResize = debounce(() => positionCards());
    window.addEventListener('resize', onResize);

    // Observe card size changes (e.g., fonts/images) to keep height in sync
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        syncStageHeight();
      });
      products.forEach(p => ro.observe(p));
    }

    // Preload background images used by product-media and reposition after load
    const mediaEls = products.map(p => p.querySelector('.product-media')).filter(Boolean);
    const bgUrls = mediaEls.map(el => {
      const bg = el.style.backgroundImage || getComputedStyle(el).backgroundImage || '';
      const match = bg.match(/url\(["']?(.*?)["']?\)/);
      return match ? match[1] : null;
    }).filter(Boolean);

    if (bgUrls.length) {
      let loaded = 0;
      const total = bgUrls.length;
      bgUrls.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === total) {
            // All media images accounted for
            positionCards();
          }
        };
        img.src = src;
      });
    }
  }
  return { init };
})();

// Initialize scripts on window load to ensure all assets are ready
// Initialize scripts when the DOM is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
        
  // Add a small delay to ensure everything is settled
  setTimeout(() => {
        initGSAPAnimations();
    productCarousel.init();
  }, 50);
});
