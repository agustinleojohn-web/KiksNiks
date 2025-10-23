// Utility Functions

/**
 * Show toast notification
 */
function showToast(message, type = 'success', description = '') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  
  toast.className = `toast ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3`;
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
    <div class="flex-1">
      <p class="font-semibold">${message}</p>
      ${description ? `<p class="text-sm opacity-90 mt-1">${description}</p>` : ''}
    </div>
    <button onclick="this.parentElement.remove()" class="text-white hover:text-gray-200">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  return `₱${amount.toLocaleString('en-PH')}`;
}

/**
 * Debounce function
 */
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

/**
 * Validate email
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number
 */
function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Sanitize HTML
 */
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Escape quotes for HTML attributes
 */
function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Get query parameter
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Set query parameter
 */
function setQueryParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

/**
 * Scroll to top
 */
function scrollToTop(smooth = true) {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

/**
 * Show loading spinner
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="flex items-center justify-center py-20">
        <div class="spinner"></div>
      </div>
    `;
  }
}

/**
 * Create skeleton loading
 */
function createSkeletonCards(count = 6) {
  let html = '<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="animate-pulse">
        <div class="skeleton aspect-square rounded-lg mb-4"></div>
        <div class="skeleton h-4 rounded w-3/4 mb-2"></div>
        <div class="skeleton h-4 rounded w-1/2"></div>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

/**
 * Local Storage helpers
 */
const Storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('menu-icon');
  
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    icon.setAttribute('data-lucide', 'x');
  } else {
    menu.classList.add('hidden');
    icon.setAttribute('data-lucide', 'menu');
  }
  
  lucide.createIcons();
}

/**
 * Update active navigation
 */
function updateActiveNav(page) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add('active', 'text-black');
      link.classList.remove('text-gray-600');
    } else {
      link.classList.remove('active', 'text-black');
      link.classList.add('text-gray-600');
    }
  });
}

/**
 * Header scroll effect - Fixed for banner and mega menu
 */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  const banner = document.getElementById('top-banner');
  const megaMenus = document.querySelectorAll('.mega-menu');
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 40) {
    // Hide banner and adjust header
    if (banner) {
      banner.style.display = 'none';
    }
    header.style.top = '0';
    header.classList.add('shadow-md');
    
    // Adjust mega menu position
    megaMenus.forEach(menu => {
      menu.style.top = '64px';
    });
  } else {
    // Show banner and adjust header
    if (banner) {
      banner.style.display = 'block';
    }
    header.style.top = '32px';
    header.classList.remove('shadow-md');
    
    // Reset mega menu position
    megaMenus.forEach(menu => {
      menu.style.top = '96px';
    });
  }
  
  lastScroll = currentScroll;
});

/**
 * Initialize Lucide icons
 */
function initIcons() {
  lucide.createIcons();
}

/**
 * Filter products by category and gender (for mega menu links)
 */
function filterProducts(category, gender) {
  console.log('🔍 Filtering:', category, gender);
  
  // Navigate to products page
  navigateTo('products');
  
  // Wait for catalog to initialize, then apply filters
  setTimeout(() => {
    if (window.productCatalog && window.productCatalog.setFilter) {
      // Clear existing filters
      window.productCatalog.clearFilters();
      
      // Apply new filters
      window.productCatalog.setFilter('category', category);
      window.productCatalog.setFilter('gender', gender);
      
      console.log('✅ Filters applied:', category, gender);
    } else {
      console.error('❌ Product catalog not ready');
    }
  }, 500);
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initSearch();
});
