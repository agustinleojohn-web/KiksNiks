// Page Navigation and Content

/**
 * ✅ NEW: Update counters dynamically from Google Sheets
 */
function updateCountersFromGoogleSheets() {
  console.log('🔢 Attempting to update counters...');
  
  // Try multiple sources for products
  let products = null;
  
  if (window.productCatalog && window.productCatalog.allProducts && window.productCatalog.allProducts.length > 0) {
    products = window.productCatalog.allProducts;
    console.log('✅ Using productCatalog.allProducts:', products.length);
  } else if (window.preloadedProducts && window.preloadedProducts.length > 0) {
    products = window.preloadedProducts;
    console.log('✅ Using preloadedProducts:', products.length);
  } else {
    console.log('⚠️ No products found yet, retry count:', window.counterRetryCount || 0);
  }
  
  if (products && products.length > 0) {
    // Count unique products by productId
    const uniqueProductIds = new Set(products.map(p => p.productId || p.id));
    const productCount = uniqueProductIds.size;
    
    // Count unique brands
    const uniqueBrands = new Set(products.map(p => p.brand).filter(b => b));
    const brandCount = uniqueBrands.size;
    
    // Update DOM - Force update immediately
    const productCounter = document.getElementById('product-counter');
    const brandCounter = document.getElementById('brand-counter');
    
    if (productCounter) {
      productCounter.textContent = `${productCount}+`;
      productCounter.style.opacity = '1';
      console.log('✅ Product counter updated to:', productCount);
    } else {
      console.warn('⚠️ Product counter element not found!');
    }
    
    if (brandCounter) {
      brandCounter.textContent = `${brandCount}+`;
      brandCounter.style.opacity = '1';
      console.log('✅ Brand counter updated to:', brandCount);
    } else {
      console.warn('⚠️ Brand counter element not found!');
    }
    
    console.log('✅ Counters updated successfully:', {products: productCount, brands: brandCount});
    
    // Clear retry counter
    window.counterRetryCount = 0;
  } else {
    // Retry after 500ms if products aren't loaded yet (max 20 retries = 10 seconds)
    const retryCount = window.counterRetryCount || 0;
    if (retryCount < 20) {
      window.counterRetryCount = retryCount + 1;
      console.log(`⏳ Retrying counter update... (${retryCount + 1}/20)`);
      setTimeout(updateCountersFromGoogleSheets, 500);
    } else {
      console.error('❌ Failed to update counters after 20 retries (10 seconds)');
      // Set fallback values
      const productCounter = document.getElementById('product-counter');
      const brandCounter = document.getElementById('brand-counter');
      if (productCounter) productCounter.textContent = '100+';
      if (brandCounter) brandCounter.textContent = '5+';
    }
  }
}

/**
 * Navigate to different pages
 */
function navigateTo(page) {
  const mainContent = document.getElementById('main-content');
  
  if (!mainContent) {
    console.error('❌ main-content element not found!');
    return;
  }
  
  updateActiveNav(page);
  
  // Update navbar styling based on page
  if (typeof window.updateNavbarForPage === 'function') {
    window.updateNavbarForPage(page);
  }
  
  switch (page) {
    case 'home':
      renderHomePage(mainContent);
      break;
    case 'products':
      renderProductsPage(mainContent);
      break;
    case 'contact':
      renderContactPage(mainContent);
      break;
    default:
      renderHomePage(mainContent);
  }
  
  scrollToTop();
}

/**
 * Filter products and navigate to products page
 */
function filterAndNavigate(filters) {
  console.log('🚀 filterAndNavigate called with:', filters);
  
  navigateTo('products');
  
  // Wait for products page to render, then apply filters
  setTimeout(() => {
    console.log('⏰ Timeout fired, checking productCatalog...');
    
    if (window.productCatalog) {
      console.log('✅ productCatalog found!');
      console.log('Current filters before:', window.productCatalog.filters);
      
      // Clear existing filters first
      window.productCatalog.clearFilters();
      
      // Apply each filter
      Object.keys(filters).forEach(filterType => {
        const value = filters[filterType];
        
        console.log(`Setting filter ${filterType} = ${value}`);
        
        // ✅ Handle boolean filters (isNew, isFeatured, isBestSeller, hasDiscount)
        if (filterType === 'isNew' || filterType === 'isFeatured' || filterType === 'isBestSeller' || filterType === 'hasDiscount') {
          window.productCatalog.filters[filterType] = value;
        }
        // Handle array filters (category, gender, subcategory)
        else if (Array.isArray(window.productCatalog.filters[filterType])) {
          // Clear and add new value
          window.productCatalog.filters[filterType] = [value];
        } else {
          window.productCatalog.filters[filterType] = value;
        }
      });
      
      console.log('Current filters after:', window.productCatalog.filters);
      
      // Apply and render
      window.productCatalog.applyFilters();
      window.productCatalog.render();
      window.productCatalog.renderFilters();
      
      console.log('✅ Filters applied and rendered!');
    } else {
      console.error('❌ productCatalog not found!');
    }
  }, 200); // Increased timeout to 200ms
}

/**
 * Filter products by category, gender, and subcategory (from mega menu)
 */
function filterProducts(category, gender, subcategory) {
  console.log('🔍 filterProducts called with:', { category, gender, subcategory });
  
  const filters = {};
  if (category) filters.category = category;
  if (gender) filters.gender = gender;
  if (subcategory) filters.subcategory = subcategory;
  
  console.log('Filters to apply:', filters);
  
  filterAndNavigate(filters);
}

/**
 * Filter by category card index (from homepage)
 */
function filterCategoryCard(index) {
  console.log('🏠 filterCategoryCard called with index:', index);
  
  const categoryFilters = [
    { category: 'Shoes', gender: 'Men' },     // 0: Men's Shoes
    { category: 'Shoes', gender: 'Women' },   // 1: Women's Shoes
    { category: 'Apparel' },                   // 2: Athletic Apparel
    { category: 'Accessories' }                // 3: Accessories
  ];
  
  const filters = categoryFilters[index] || {};
  console.log('Applying filters:', filters);
  
  filterAndNavigate(filters);
}

// Make functions globally accessible - CRITICAL FOR ONCLICK HANDLERS!
window.filterProducts = filterProducts;
window.filterCategoryCard = filterCategoryCard;
window.filterAndNavigate = filterAndNavigate;
window.navigateTo = navigateTo;

console.log('✅ Global functions exported:', {
  filterProducts: typeof window.filterProducts,
  filterCategoryCard: typeof window.filterCategoryCard,
  filterAndNavigate: typeof window.filterAndNavigate,
  navigateTo: typeof window.navigateTo
});

/**
 * Render Home Page
 */
function renderHomePage(container) {
  // Reset retry counter
  window.counterRetryCount = 0;
  
  // ✅ Update counters from Google Sheets
  updateCountersFromGoogleSheets();
  
  container.innerHTML = `
    <!-- Hero Slider (Microsoft Store Style) NO SPACE -->
    <section class="hero-slider" style="margin-top: 0 !important; padding-top: 0 !important;">
      <div class="slider-wrapper">
        <!-- Slide 1 - Air Jordan 1 Low -->\
        <div class="slider-slide active" data-slide="0">
          <div class="slider-content" style="background: radial-gradient(circle,rgba(80, 12, 7, 1) 0%, rgba(8, 8, 8, 1) 100%);">
            <div class="slide-text">
              <div class="nike-category-badge">
                <span>MEN'S SHOES</span>
                <div class="color-indicator">
                  <span class="color-dot" style="background: #D10017;"></span>
                  <span class="color-dot" style="background: #FFF;"></span>
                  <span class="color-dot" style="background: #000;"></span>
                </div>
              </div>
              <h1 class="slide-title nike-title">AIR JORDAN 1 LOW</h1>
              <p class="slide-subtitle nike-description">Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that's familiar yet always fresh. With an iconic design that pairs perfectly with any 'fit, these kicks ensure you'll always be on point.</p>
              <button onclick="filterAndNavigate({isNew: true})" class="btn-slide nike-btn bg-[#D10017] hover:bg-[#600800]">ORDER NOW</button>
            </div>
            <div class="slide-image">
         
              <img class="contrast-110" src="img/hero/1.webp" alt="Air Jordan 1 Low" />
            </div>
          </div>
        </div>
          <!-- Slide 5 -->\
        <div class="slider-slide" data-slide="2">
          <div class="slider-content" style="background: radial-gradient(circle,rgba(77, 82, 63, 1) 0%, rgba(8, 8, 8, 1) 100%);">
            <div class="slide-text">
              <div class="nike-category-badge">
               <span>Men's Slides</span>
                <div class="color-indicator">
                  <span class="color-dot" style="background: #4D523F;"></span>
                  <span class="color-dot" style="background: #CAC3C0;"></span>
                </div>
              </div>
              <h1 class="slide-title nike-title">Offcourt Adjust</h1>
              <p class="slide-subtitle nike-description">Post game, errands and more—adjust your comfort on the go. The adjustable, padded strap lets you perfect your fit, while the lightweight foam midsole brings first-class comfort to your feet.</p>
              <button onclick="filterAndNavigate({hasDiscount: true})" class="btn-slide nike-btn bg-[#4D523F] hover:bg-[#34342b]">ORDER NOW</button>
            </div>
              <div class="slide-image filter-contrast(150%)">
         
              <img class="contrast-115" src="img/hero/5.webp" alt="Nike Offcourt Adjust" />
            </div>
          </div>
        </div>

        <!-- Slide 2 -->\
        <div class="slider-slide" data-slide="1">
          <div class="slider-content" style="background:  radial-gradient(circle,rgba(236, 75, 3, 1) 0%, rgba(8, 8, 8, 1) 100%);">
            <div class="slide-text">
              <div class="nike-category-badge">
                <span>MEN'S SHOES</span>
                <div class="color-indicator">
                  <span class="color-dot" style="background: #ec4b03;"></span>
                  <span class="color-dot" style="background: #FFF;"></span>
                  <span class="color-dot" style="background: #000;"></span>
                </div>
              </div>
              <h1 class="slide-title nike-title">AIR JORDAN 1 LOW</h1>
              <p class="slide-subtitle nike-description">Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that's familiar yet always fresh. With an iconic design that pairs perfectly with any 'fit, these kicks ensure you'll always be on point.</p>
              <button onclick="filterAndNavigate({isBestSeller: true})" class="btn-slide nike-btn bg-[#ec4b03] hover:bg-[#ff3300]">ORDER NOW</button>
            </div>
             <div class="slide-image">
         
              <img src="img/hero/2.webp" alt="Air Jordan 1 Low" />
            </div>
          </div>
        </div>

         <!-- Slide 2 -->\
        <div class="slider-slide" data-slide="1">
          <div class="slider-content" style="background:  radial-gradient(circle,rgba(238, 81, 149, 1) 0%, rgba(8, 8, 8, 1) 100%);">
            <div class="slide-text">
              <div class="nike-category-badge">
                <span>MEN'S SHOES</span>
                <div class="color-indicator">
                  <span class="color-dot" style="background: #EE5195;"></span>
                  <span class="color-dot" style="background: #FFF;"></span>
                  <span class="color-dot" style="background: #000;"></span>
                </div>
              </div>
              <h1 class="slide-title nike-title">Nike Gato</h1>
              <p class="slide-subtitle nike-description">The 2010 indoor football shoe has been seeking its revival for some time now. Well, the wait is over—the beloved Gato is back! Primed and ready for the streets, this clean edition mixes premium leather and breezy textiles for a layered look that's easy to style.</p>
              <button onclick="filterAndNavigate({isBestSeller: true})" class="btn-slide nike-btn bg-[#EE5195] hover:bg-[#b90754]">ORDER NOW</button>
            </div>
             <div class="slide-image">
         
              <img class="contrast-125" src="img/hero/6.webp" alt="Nike Gato" />
            </div>
          </div>
        </div>
        
        <!-- Slide 3 --->\
        <div class="slider-slide" data-slide="2">
          <div class="slider-content" style="background: radial-gradient(circle,rgba(54, 52, 56, 1) 0%, rgba(8, 8, 8, 1) 100%);">
            <div class="slide-text">
              <div class="nike-category-badge">
               <span>MEN'S SHOES</span>
                <div class="color-indicator">
                  <span class="color-dot" style="background: #363438;"></span>
                  <span class="color-dot" style="background: #FFF;"></span>
                </div>
              </div>
              <h1 class="slide-title nike-title">AIR JORDAN 1 LOW</h1>
              <p class="slide-subtitle nike-description">Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that's familiar yet always fresh. With an iconic design that pairs perfectly with any 'fit, these kicks ensure you'll always be on point.</p>
              <button onclick="filterAndNavigate({hasDiscount: true})" class="btn-slide nike-btn bg-[#363438] hover:bg-[#1f1f20]">ORDER NOW</button>
            </div>
              <div class="slide-image ">
         
              <img class="contrast-125" src="img/hero/3.webp" alt="Air Jordan 1 Low" />
            </div>
          </div>
        </div>

         <!-- Slide 4 -->\
        <div class="slider-slide" data-slide="2">
          <div class="slider-content" style="background: radial-gradient(circle,rgba(255, 155, 51, 1) 0%, rgba(8, 8, 8, 1) 100%);">
            <div class="slide-text">
              <div class="nike-category-badge">
               <span>MEN'S SHOES</span>
                <div class="color-indicator">
                  <span class="color-dot" style="background: #ff9b33;"></span>
                  <span class="color-dot" style="background: #000;"></span>
                </div>
              </div>
              <h1 class="slide-title nike-title">Nike Air Max Dn8</h1>
              <p class="slide-subtitle nike-description">More Air, less bulk. The Dn8 takes our Dynamic Air system and condenses it into a sleek, low-profile package. Powered by eight pressurised Air tubes, it gives you a responsive sensation with every step. Enter an unreal experience of movement.</p>
              <button onclick="filterAndNavigate({hasDiscount: true})" class="btn-slide nike-btn bg-[#ff9b33] hover:bg-[#fe6600]">ORDER NOW</button>
            </div>
              <div class="slide-image filter-contrast(150%)">
         
              <img src="img/hero/4.webp" alt="Nike Air Max Dn8" />
            </div>
          </div>
        </div>

       

        <!-- Slider Controls -->\
        <button class="slider-btn slider-prev text-white  bg-transparent hover:bg-white/10" onclick="heroSliderPrev()">
          <i data-lucide="chevron-left"></i>
        </button>
        <button class="slider-btn slider-next text-white  bg-transparent hover:bg-white/10" onclick="heroSliderNext()">
          <i data-lucide="chevron-right"></i>
        </button>
        
        <!-- Slider Dots -->\
        <div class="slider-dots">
          <button class="slider-dot active" onclick="heroSliderGoTo(0)"></button>
          <button class="slider-dot" onclick="heroSliderGoTo(1)"></button>
          <button class="slider-dot" onclick="heroSliderGoTo(2)"></button>
        </div>
      </div>
    </section>

      <!-- Brand Logos Infinite Scroll - REPLACES COUNTERS -->
    <section class="brand-scroll-section">
      <div class="brand-scroll-container">
        <!-- First set of logos -->
        <div class="brand-logo-item">
          <img src="img/hero/brands/1.png" alt="Jordan" class="h-12">
        </div>
        <div class="brand-logo-item">
         <img src="img/hero/brands/2.png" alt="Nike" class="h-12">
        </div>
        <div class="brand-logo-item">
          <img src="img/hero/brands/3.png" alt="Puma" class="h-12">
        </div>
        <div class="brand-logo-item">
          <img src="img/hero/brands/4.png" alt="NB" class="h-12">
        </div>
        <div class="brand-logo-item">
        <img src="img/hero/brands/5.png" alt="Vans" class="h-12">
        </div>
        <div class="brand-logo-item">
          <img src="img/hero/brands/6.png" alt="Adidas" class="h-12">
        </div>
        <div class="brand-logo-item">
          <img src="img/hero/brands/7.png" alt="Crocs" class="h-12">
        </div>
        
      </div>
    </section>

      <!-- Secondary Hero Banners WITH FILTER FUNCTIONS -->
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="relative h-[400px] rounded-lg overflow-hidden group cursor-pointer" onclick="filterAndNavigate({subcategory: 'Running'})">
            <img 
              src="https://images.unsplash.com/photo-1639843093167-ed40b985c01e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhY3Rpb258ZW58MXx8fHwxNzYwMzUzNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Running Collection"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-8 left-8 right-8">
              <p class="text-white text-sm mb-2 tracking-wide">PERFORMANCE</p>
              <h3 class="text-white text-3xl font-bold mb-4">Running Collection</h3>
              <button class="text-white flex items-center gap-2 group/btn font-medium">
                Shop Running <i data-lucide="chevron-right" class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>

          <div class="relative h-[400px] rounded-lg overflow-hidden group cursor-pointer" onclick="filterAndNavigate({category: 'Apparel'})">
            <img 
              src="https://images.unsplash.com/photo-1759476530978-07f0eb6906fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMGFwcGFyZWx8ZW58MXx8fHwxNzYwMzUzNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Lifestyle Apparel"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-8 left-8 right-8">
              <p class="text-white text-sm mb-2 tracking-wide">STYLE</p>
              <h3 class="text-white text-3xl font-bold mb-4">Lifestyle Apparel</h3>
              <button class="text-white flex items-center gap-2 group/btn font-medium">
                Shop Apparel <i data-lucide="chevron-right" class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="py-16 bg-white">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="text-4xl font-bold mb-2">Shop by Category</h2>
            <p class="text-gray-600">Find your perfect fit across our collections</p>
          </div>
          <button 
            onclick="navigateTo('products')"
            class="hidden md:flex items-center gap-2 text-sm hover:gap-4 transition-all font-medium"
          >
            View All <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${renderCategoryCards()}
        </div>
      </div>
    </section>
  `;
  
  lucide.createIcons();
  
  //  Initialize hero slider
  setTimeout(() => {
    if (typeof window.initHeroSlider === 'function') {
      window.initHeroSlider();
    }
  }, 100);
}

function renderCategoryCards() {
  const categories = [
    {
      title: "Men's Shoes",
      image: "https://images.unsplash.com/photo-1628254162935-20c03dbae545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzYwMjUxODU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      count: "500+ Products",
      filter: { category: 'Shoes', gender: 'Men' }
    },
    {
      title: "Women's Shoes",
      image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwc2hvZXN8ZW58MXx8fHwxNzYwMzMxMjQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      count: "450+ Products",
      filter: { category: 'Shoes', gender: 'Women' }
    },
    {
      title: "Athletic Apparel",
      image: "https://images.unsplash.com/photo-1678356188535-1c23c93b0746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjAzNTM0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      count: "300+ Products",
      filter: { category: 'Apparel' }
    },
    {
      title: "Accessories",
      image: "https://images.unsplash.com/photo-1696954895451-701b481056d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc2hvZXMlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzYwMjg1NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      count: "200+ Products",
      filter: { category: 'Accessories' }
    }
  ];

  return categories.map((category, idx) => `
    <button
      onclick="filterCategoryCard(${idx})"
      class="group relative h-[400px] rounded-lg overflow-hidden"
    >
      <img 
        src="${category.image}"
        alt="${category.title}"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div class="absolute bottom-6 left-6 right-6 text-left">
        <h3 class="text-white text-2xl font-bold mb-2">${category.title}</h3>
        <p class="text-gray-300 text-sm mb-4">${category.count}</p>
        <span class="inline-flex items-center gap-2 text-white text-sm group-hover:gap-4 transition-all">
          Explore <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </span>
      </div>
    </button>
  `).join('');
}

/**
 * Render Products Page
 */
function renderProductsPage(container) {
  container.innerHTML = `
    <div class="min-h-screen bg-white">
      <!-- Breadcrumb -->
      <div class="border-b border-gray-200">
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav class="flex items-center space-x-2 text-sm text-gray-600">
            <button onclick="navigateTo('home')" class="hover:text-black">Home</button>
            <span>/</span>
            <span class="text-black">All Products</span>
          </nav>
        </div>
      </div>

      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Desktop Filters Sidebar -->
          <aside class="hidden lg:block w-64 flex-shrink-0">
            <div id="filters-container"></div>
          </aside>

          <!-- Main Content -->
          <div class="flex-1">
            <div id="products-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Initialize products
  productCatalog.initialize();
  productCatalog.renderFilters();
}

/**
 * Render Contact Page
 */
function renderContactPage(container) {
  container.innerHTML = `
    <section class="pt-16 pb-16 bg-white">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold pt-8 mb-4">Get in Touch</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Contact Information -->
          <div class="lg:col-span-1 space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="p-3 bg-gray-100 rounded-full">
                    <i data-lucide="mail" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Email</p>
                    <a href="mailto:${CONFIG.COMPANY.email}" class="hover:underline font-medium">${CONFIG.COMPANY.email}</a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="p-3 bg-gray-100 rounded-full">
                    <i data-lucide="phone" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Phone</p>
                    <a href="tel:${CONFIG.COMPANY.phone}" class="hover:underline font-medium">${CONFIG.COMPANY.phone}</a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="p-3 bg-gray-100 rounded-full">
                    <i data-lucide="map-pin" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Address</p>
                    <p class="font-medium">${CONFIG.COMPANY.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="font-bold mb-4">Business Hours</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Monday - Friday</span>
                  <span class="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Saturday</span>
                  <span class="font-medium">10:00 AM - 6:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Sunday</span>
                  <span class="font-medium">10:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <form id="contact-form" class="space-y-6">
              <div class="grid sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">
                    Full Name <span class="text-red-600">*</span>
                  </label>
                  <input type="text" id="contact-name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="John Doe">
                  <div class="error-message hidden" id="error-contact-name"></div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">
                    Email Address <span class="text-red-600">*</span>
                  </label>
                  <input type="email" id="contact-email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="john@example.com">
                  <div class="error-message hidden" id="error-contact-email"></div>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">
                    Phone Number <span class="text-red-600">*</span>
                  </label>
                  <input type="tel" id="contact-phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="+63 912 345 6789">
                  <div class="error-message hidden" id="error-contact-phone"></div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">
                    Subject <span class="text-red-600">*</span>
                  </label>
                  <input type="text" id="contact-subject" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="How can we help?">
                  <div class="error-message hidden" id="error-contact-subject"></div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  Message <span class="text-red-600">*</span>
                </label>
                <textarea id="contact-message" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none" rows="6" placeholder="Tell us more about your inquiry..."></textarea>
                <div class="error-message hidden" id="error-contact-message"></div>
              </div>

              <button type="submit" class="w-full bg-black text-white py-4 rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group font-medium">
                <i data-lucide="send" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
  
  lucide.createIcons();
  
  // Add form submit handler
  document.getElementById('contact-form').addEventListener('submit', handleContactFormSubmit);
}

/**
 * Handle contact form submission
 */
async function handleContactFormSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  
  // Reset errors
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.add('hidden');
    el.textContent = '';
  });
  
  document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(el => {
    el.classList.remove('error');
  });
  
  // Validate
  let hasError = false;
  
  if (!name || name.length < 2) {
    document.getElementById('error-contact-name').textContent = 'Name must be at least 2 characters';
    document.getElementById('error-contact-name').classList.remove('hidden');
    document.getElementById('contact-name').classList.add('error');
    hasError = true;
  }
  
  if (!email || !validateEmail(email)) {
    document.getElementById('error-contact-email').textContent = 'Please enter a valid email address';
    document.getElementById('error-contact-email').classList.remove('hidden');
    document.getElementById('contact-email').classList.add('error');
    hasError = true;
  }
  
  if (!phone || !validatePhone(phone)) {
    document.getElementById('error-contact-phone').textContent = 'Please enter a valid phone number';
    document.getElementById('error-contact-phone').classList.remove('hidden');
    document.getElementById('contact-phone').classList.add('error');
    hasError = true;
  }
  
  if (!subject || subject.length < 3) {
    document.getElementById('error-contact-subject').textContent = 'Subject must be at least 3 characters';
    document.getElementById('error-contact-subject').classList.remove('hidden');
    document.getElementById('contact-subject').classList.add('error');
    hasError = true;
  }
  
  if (!message || message.length < 10) {
    document.getElementById('error-contact-message').textContent = 'Message must be at least 10 characters';
    document.getElementById('error-contact-message').classList.remove('hidden');
    document.getElementById('contact-message').classList.add('error');
    hasError = true;
  }
  
  if (hasError) {
    showToast('Please correct the errors in the form', 'error');
    return;
  }
  
  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="spinner mx-auto" style="width: 20px; height: 20px; border-width: 2px;"></div>';
  
  try {
    await submitContactForm({ name, email, phone, subject, message });
    
    showToast('Message sent successfully!', 'success', "We'll get back to you within 24 hours.");
    
    // Reset form
    e.target.reset();
  } catch (error) {
    showToast('Failed to send message', 'error', 'Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    lucide.createIcons();
  }
}