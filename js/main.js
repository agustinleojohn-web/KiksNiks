// Main Application Entry Point

// ✅ PRELOAD PRODUCTS IMMEDIATELY - Don't wait for user to visit products page!
console.log('🚀 PRELOADING PRODUCTS IMMEDIATELY...');
fetchProducts().then(products => {
  console.log('✅ Products preloaded:', products.length);
  // Store in window for instant access
  window.preloadedProducts = products;
  // ✅ NEW: Build dynamic mega menu from products data
  buildDynamicMegaMenu(products);
  // ✅ FIX: Update counters immediately after products are loaded
  setTimeout(() => {
    if (typeof updateCountersFromGoogleSheets === 'function') {
      updateCountersFromGoogleSheets();
    }
  }, 100);
}).catch(error => {
  console.error('❌ Error preloading products:', error);
});

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 KiksNiks starting...');
  
  // Initialize Lucide icons
  lucide.createIcons();
  console.log('✅ Icons initialized');
  
  // ✅ FIX: Preserve current page on refresh (check URL parameter)
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.get('page') || 'home';
  console.log('📄 Current page from URL:', currentPage);
  
  // Load the appropriate page
  navigateTo(currentPage);
  console.log('✅ Page loaded:', currentPage);
  
  // Newsletter form handler
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
  
  // Initialize header scroll effect
  initializeHeaderScroll();
  console.log('✅ Header scroll initialized');
  
  // Cart is already initialized when ShoppingCart class is instantiated
  cart.updateCartCount();
  console.log('✅ Cart initialized');
  
  console.log('✅ KiksNiks initialized successfully!');
  console.log('📋 Feature flags:', FEATURES);
  console.log('📋 Google Sheets URL:', CONFIG.GOOGLE_SHEETS.productsUrl);
});

/**
 * Handle newsletter subscription
 */
async function handleNewsletterSubmit(e) {
  e.preventDefault();
  
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput.value.trim();
  
  if (!validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="spinner mx-auto" style="width: 20px; height: 20px; border-width: 2px;"></div>';
  
  try {
    // ✅ FIX: Actually submit to Google Sheets!
    await submitNewsletter(email);
    
    // Show success message
    showToast('Thank you for subscribing!', 'success', 'Check your email for exclusive deals.');
    
    // Reset form
    emailInput.value = '';
  } catch (error) {
    console.error('Newsletter submission error:', error);
    showToast('Subscription failed', 'error', 'Please try again.');
  } finally {
    // Restore button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

/**
 * Initialize header scroll effect - Handle navbar transparency and mega menu
 */
function initializeHeaderScroll() {
  let lastScroll = 0;
  const header = document.getElementById('header');
  const body = document.body;
  
  // Track current page for navbar styling
  window.currentPage = 'home';
  
  // Track mega menu state
  let megaMenuOpen = false;
  
  // Listen for mega menu hover
  const megaMenuWrappers = document.querySelectorAll('.mega-menu-wrapper');
  megaMenuWrappers.forEach(wrapper => {
    wrapper.addEventListener('mouseenter', () => {
      megaMenuOpen = true;
      updateNavbarStyle();
    });
    wrapper.addEventListener('mouseleave', () => {
      megaMenuOpen = false;
      updateNavbarStyle();
    });
  });
  
  function updateNavbarStyle() {
    const currentScroll = window.pageYOffset;
    const isHomePage = window.currentPage === 'home';
    const isAtTop = currentScroll < 20;
    
    // Logic:
    // On homepage at top (no scroll, no mega menu) = transparent navbar
    // On homepage scrolled OR mega menu open = black navbar with white text
    // On other pages = white navbar with black text (default)
    
    if (isHomePage) {
      if (isAtTop && !megaMenuOpen) {
        // Transparent navbar at top of homepage
        header.style.background = 'transparent';
        header.style.borderBottom = 'none';
        header.classList.remove('navbar-black');
        header.classList.remove('shadow-md');
        // Make text white for visibility on dark hero
        header.classList.add('navbar-transparent');
      } else {
        // Black navbar when scrolled or mega menu open
        header.style.background = '#000';
        header.style.borderBottom = '1px solid #000';
        header.classList.add('navbar-black');
        header.classList.remove('navbar-transparent');
        if (currentScroll > 20) {
          header.classList.add('shadow-md');
        }
      }
    } else {
      // White navbar on other pages
      header.style.background = '#fff';
      header.style.borderBottom = '1px solid #e5e5e5';
      header.classList.remove('navbar-black');
      header.classList.remove('navbar-transparent');
      if (currentScroll > 20) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    }
    
    lastScroll = currentScroll;
  }
  
  window.addEventListener('scroll', updateNavbarStyle);
  
  // Initial call to set correct state
  updateNavbarStyle();
  
  // Export function to update when page changes
  window.updateNavbarForPage = function(page) {
    window.currentPage = page;
    updateNavbarStyle();
  };
}

/**
 * Handle window resize
 */
window.addEventListener('resize', debounce(() => {
  // Re-render current page content if needed
  lucide.createIcons();
}, 250));

/**
 * Handle browser back/forward buttons
 */
window.addEventListener('popstate', () => {
  const page = getQueryParam('page') || 'home';
  navigateTo(page);
});

/**
 * Service Worker registration (optional, for PWA)
 */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });
}

/**
 * Performance monitoring (optional)
 */
if ('PerformanceObserver' in window) {
  const perfObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('Performance entry:', entry);
    }
  });
  
  try {
    perfObserver.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
  } catch (e) {
    console.log('Performance monitoring not supported');
  }
}

/**
 * Error handling - COMPREHENSIVE
 */
window.addEventListener('error', (event) => {
  console.error('🚨 Global error:', event.message || event.error);
  console.error('   File:', event.filename);
  console.error('   Line:', event.lineno, 'Column:', event.colno);
  if (event.error?.stack) {
    console.error('   Stack:', event.error.stack);
  }
  
  // Don't show toast for extension errors
  const isExtensionError = event.filename && (
    event.filename.includes('chrome-extension://') || 
    event.filename.includes('content-all.js') ||
    event.filename.includes('extension')
  );
  
  if (!isExtensionError) {
    // Only show critical errors to user
    const message = event.message || String(event.error);
    if (message.includes('Cannot read') || message.includes('undefined') || message.includes('null')) {
      console.warn('⚠️ Showing error toast to user');
      showToast('An error occurred. Please refresh the page.', 'error');
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
  
  // Don't show toast for Chrome extension errors
  const reason = String(event.reason?.message || event.reason || '');
  const isExtensionError = reason.includes('message channel closed') || 
                          reason.includes('connection') ||
                          reason.includes('Receiving end') ||
                          reason.includes('extension');
  
  if (!isExtensionError) {
    console.warn('⚠️ Showing promise rejection toast to user');
    showToast('A network error occurred. Please try again.', 'error');
  }
});

/**
 * ✅ NEW: Build dynamic mega menu from product data
 */
function buildDynamicMegaMenu(products) {
  console.log('🔧 Building dynamic mega menu...');
  
  if (!products || products.length === 0) {
    console.warn('⚠️ No products available for mega menu');
    return;
  }
  
  // Extract unique combinations of gender, category, and subcategory
  const menuStructure = {};
  
  products.forEach(product => {
    const gender = product.gender;
    const category = product.category;
    const subcategory = product.subcategory;
    
    if (!gender || !category) return; // Skip if missing required fields
    
    if (!menuStructure[gender]) {
      menuStructure[gender] = {};
    }
    
    if (!menuStructure[gender][category]) {
      menuStructure[gender][category] = new Set();
    }
    
    if (subcategory) {
      menuStructure[gender][category].add(subcategory);
    }
  });
  
  // Convert Sets to Arrays and sort
  for (const gender in menuStructure) {
    for (const category in menuStructure[gender]) {
      menuStructure[gender][category] = Array.from(menuStructure[gender][category]).sort();
    }
  }
  
  console.log('📋 Menu structure:', menuStructure);
  
  // Now update the mega menus for each gender
  ['Men', 'Women', 'Kids', 'Unisex'].forEach(gender => {
    updateMegaMenuForGender(gender, menuStructure[gender] || {});
  });
  
  console.log('✅ Dynamic mega menu built successfully');
}

/**
 * Update mega menu HTML for a specific gender
 */
function updateMegaMenuForGender(gender, categories) {
  const menuWrapper = document.querySelector(`[data-gender="${gender}"]`);
  if (!menuWrapper) {
    console.warn(`⚠️ Mega menu wrapper not found for ${gender}`);
    return;
  }
  
  const megaMenu = menuWrapper.querySelector('.mega-menu-content');
  if (!megaMenu) {
    console.warn(`⚠️ Mega menu content not found for ${gender}`);
    return;
  }
  
  let html = '';
  
  // Build columns for each category
  const categoryKeys = Object.keys(categories).sort();
  categoryKeys.forEach(category => {
    const subcategories = categories[category];
    
    html += `
      <div class="mega-menu-column">
        <h3>${category}</h3>
        <ul>
          ${subcategories.map(subcategory => `
            <li><a href="#" onclick="filterProducts('${category}', '${gender}', '${subcategory}'); return false;">${subcategory}</a></li>
          `).join('')}
          ${subcategories.length > 0 ? `<li><a href="#" onclick="filterProducts('${category}', '${gender}', null); return false;">All ${category}</a></li>` : ''}
        </ul>
      </div>
    `;
  });
  
  // Add Featured column
  html += `
    <div class="mega-menu-column">
      <h3>Featured</h3>
      <ul>
        <li><a href="#" onclick="filterAndNavigate({gender: '${gender}', isNew: true}); return false;">New Releases</a></li>
        <li><a href="#" onclick="filterAndNavigate({gender: '${gender}', isBestSeller: true}); return false;">Best Sellers</a></li>
        <li><a href="#" onclick="filterAndNavigate({gender: '${gender}', hasDiscount: true}); return false;">Sale</a></li>
      </ul>
    </div>
  `;
  
  megaMenu.innerHTML = html;
}

/**
 * Accessibility: Skip to content link
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
    );
    
    if (focusableElements.length > 0 && document.activeElement === document.body) {
      e.preventDefault();
      focusableElements[0].focus();
    }
  }
});

/**
 * Print page functionality
 */
function printPage() {
  window.print();
}

/**
 * Share functionality (Web Share API)
 */
async function sharePage() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'KiksNiks - Premium Athletic Footwear & Apparel',
        text: 'Check out KiksNiks for authentic athletic footwear and apparel!',
        url: window.location.href
      });
      showToast('Thanks for sharing!', 'success');
    } catch (error) {
      console.log('Error sharing:', error);
    }
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  }
}

/**
 * Theme toggle (optional dark mode)
 */
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

// ==================== HERO SLIDER FUNCTIONS ====================
let currentSlide = 0;
let sliderInterval = null;

function heroSliderGoTo(index) {
  const slides = document.querySelectorAll('.slider-slide');
  const dots = document.querySelectorAll('.slider-dot');
  
  if (!slides.length) return;
  
  // Remove active class from all
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  
  // Add active class to current
  currentSlide = index;
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  
  // Reset auto-play timer
  resetSliderInterval();
}

function heroSliderNext() {
  const slides = document.querySelectorAll('.slider-slide');
  if (!slides.length) return;
  
  currentSlide = (currentSlide + 1) % slides.length;
  heroSliderGoTo(currentSlide);
}

function heroSliderPrev() {
  const slides = document.querySelectorAll('.slider-slide');
  if (!slides.length) return;
  
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  heroSliderGoTo(currentSlide);
}

function resetSliderInterval() {
  if (sliderInterval) clearInterval(sliderInterval);
  sliderInterval = setInterval(heroSliderNext, 5000); // Auto-advance every 5 seconds
}

function initHeroSlider() {
  // Start auto-play
  resetSliderInterval();
  
  // Pause on hover
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    slider.addEventListener('mouseenter', () => {
      if (sliderInterval) clearInterval(sliderInterval);
    });
    slider.addEventListener('mouseleave', resetSliderInterval);
  }
  
  console.log('✅ Hero slider initialized');
}

// Make slider functions globally accessible
window.heroSliderGoTo = heroSliderGoTo;
window.heroSliderNext = heroSliderNext;
window.heroSliderPrev = heroSliderPrev;
window.initHeroSlider = initHeroSlider;

// ==================== PROFESSIONAL MOBILE MENU ====================

/**
 * ✨ Toggle professional full-screen mobile menu
 */
function toggleMobileMenu() {
  const overlay = document.getElementById('mobile-menu-overlay');
  const body = document.body;
  const menuIcon = document.getElementById('menu-icon');
  
  if (!overlay) {
    console.error('Mobile menu overlay not found');
    return;
  }
  
  const isActive = overlay.classList.contains('active');
  
  if (isActive) {
    // Close menu
    overlay.classList.remove('active');
    body.classList.remove('mobile-menu-open');
    if (menuIcon) menuIcon.setAttribute('data-lucide', 'menu');
  } else {
    // Open menu
    overlay.classList.add('active');
    body.classList.add('mobile-menu-open');
    if (menuIcon) menuIcon.setAttribute('data-lucide', 'x');
  }
  
  // Re-initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Update mobile footer year
  const mobileYearEl = document.getElementById('mobile-footer-year');
  if (mobileYearEl) {
    mobileYearEl.textContent = new Date().getFullYear();
  }
}

// Make it globally accessible
window.toggleMobileMenu = toggleMobileMenu;

/**
 * Console welcome message
 */
console.log('%c👟 Welcome to KiksNiks!', 'color: #000; font-size: 20px; font-weight: bold;');
console.log('%cLooking for a job? Check out our careers page!', 'color: #666; font-size: 14px;');
console.log('%cWebsite built with ❤️ by the KiksNiks team', 'color: #999; font-size: 12px;');