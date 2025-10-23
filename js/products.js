// Products Management - PRODUCTION READY

class ProductCatalog {
  constructor() {
    this.allProducts = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.viewMode = 'grid';
    this.selectedProducts = new Set();
    this.isLoading = true; // ✅ NEW: Track loading state
    
    this.filters = {
      category: [],
      subcategory: [], // NEW! For Running/Basketball/Training/etc
      gender: [],
      priceRange: [0, 20000],
      sizes: [],
      colors: [],
      brands: [],
      sortBy: 'featured'
    };
  }

  async initialize() {
    console.log('🚀 Initializing product catalog...');
    const container = document.getElementById('products-container');
    if (!container) {
      console.error('❌ Products container #products-container not found');
      return;
    }
    
    container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p style="margin-top: 16px; text-align: center; font-size: 14px; color: #666;">Loading products...</p></div>';
    
    try {
      console.log('📦 Fetching products...');
      
      // ✅ FIX: Use preloaded products if available for INSTANT loading!
      if (window.preloadedProducts && window.preloadedProducts.length > 0) {
        console.log('✅ Using PRELOADED products:', window.preloadedProducts.length);
        this.allProducts = window.preloadedProducts;
      } else {
        console.log('⏳ Preloaded products not ready, fetching now...');
        this.allProducts = await fetchProducts();
      }
      
      if (!this.allProducts || this.allProducts.length === 0) {
        throw new Error('No products returned');
      }
      
      console.log('✅ Products fetched:', this.allProducts.length);
      console.log('Sample product:', this.allProducts[0]);
      
      // ✅ NEW: Group products by ID (for variations)
      this.productGroups = this.groupProductsByID(this.allProducts);
      console.log('✅ Products grouped by ID:', Object.keys(this.productGroups).length, 'unique products');
      console.log('Product groups:', Object.keys(this.productGroups).slice(0, 5));
      
      this.applyFilters();
      this.render();
      this.renderFilters();
      
      // ✅ NEW: Mark as loaded and enable filters
      this.isLoading = false;
      this.enableFilters();
      
      console.log('✅✅✅ Product catalog initialized successfully! ✅✅✅');
      console.log('You can now click "View Details" to open modals');
    } catch (error) {
      console.error('❌ Failed to initialize product catalog:', error);
      this.isLoading = false;
      container.innerHTML = '<div class="empty-state"><p style="color: red;">Failed to load products: ' + error.message + '</p><button onclick="productCatalog.initialize()" class="btn-reset">Retry</button></div>';
    }
  }
  
  groupProductsByID(products) {
    // ✅ NEW: Group by product ID instead of name
    const groups = {};
    products.forEach(product => {
      // Use productId field if available, otherwise fallback to id
      const groupId = product.productId || product.id;
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(product);
    });
    return groups;
  }
  
  getUniqueProducts() {
    // ✅ Return only one product per productId (first variation)
    const uniqueMap = new Map();
    this.allProducts.forEach(product => {
      const groupId = product.productId || product.id;
      if (!uniqueMap.has(groupId)) {
        uniqueMap.set(groupId, product);
      }
    });
    return Array.from(uniqueMap.values());
  }

  getUniqueProductsFromArray(products) {
    // ✅ Return only ONE product per productId from given array
    const uniqueMap = new Map();
    products.forEach(product => {
      const groupId = product.productId || product.id;
      if (!uniqueMap.has(groupId)) {
        uniqueMap.set(groupId, product);
      }
    });
    return Array.from(uniqueMap.values());
  }

  smartDeduplicateVariations(products) {
    // ✅ SMART DEDUPLICATION FOR SPECIFIC FILTERS
    // Example: Filter "Size 7" → Show only variations that actually have size 7
    // But if multiple variations have size 7 with SAME color, show only 1
    
    const productGroups = new Map();
    
    // Group by productId
    products.forEach(product => {
      const groupId = product.productId || product.id;
      if (!productGroups.has(groupId)) {
        productGroups.set(groupId, []);
      }
      productGroups.get(groupId).push(product);
    });
    
    const result = [];
    
    // For each product group
    productGroups.forEach(variations => {
      if (variations.length === 1) {
        // Only one variation → show it
        result.push(variations[0]);
      } else {
        // Multiple variations → deduplicate by color
        // If they have different colors, show them separately
        // If same color, show only one
        const colorMap = new Map();
        variations.forEach(v => {
          if (!colorMap.has(v.color)) {
            colorMap.set(v.color, v);
          }
        });
        
        // Add one card per unique color
        result.push(...colorMap.values());
      }
    });
    
    return result;
  }

  applyFilters() {
    // ✅ SMART LOGIC: Start with ALL products, then filter, then intelligently deduplicate
    let filtered = [...this.allProducts];
    
    console.log(`🔍 Starting with ${filtered.length} total products`);

    if (this.filters.category.length > 0) {
      filtered = filtered.filter(p => this.filters.category.includes(p.category));
      console.log(`   After category filter: ${filtered.length} products`);
    }

    if (this.filters.subcategory.length > 0) {
      filtered = filtered.filter(p => this.filters.subcategory.includes(p.subcategory));
      console.log(`   After subcategory filter: ${filtered.length} products`);
    }

    if (this.filters.gender.length > 0) {
      filtered = filtered.filter(p => this.filters.gender.includes(p.gender));
      console.log(`   After gender filter: ${filtered.length} products`);
    }

    // ✅ Boolean filters (isNew, isFeatured, isBestSeller, hasDiscount)
    if (this.filters.isNew) {
      filtered = filtered.filter(p => p.isNew === true);
      console.log(`   After isNew filter: ${filtered.length} products`);
    }
    
    if (this.filters.isFeatured) {
      filtered = filtered.filter(p => p.isFeatured === true);
      console.log(`   After isFeatured filter: ${filtered.length} products`);
    }
    
    if (this.filters.isBestSeller) {
      filtered = filtered.filter(p => p.isBestSeller === true);
      console.log(`   After isBestSeller filter: ${filtered.length} products`);
    }
    
    if (this.filters.hasDiscount) {
      filtered = filtered.filter(p => p.discount && p.discount > 0);
      console.log(`   After hasDiscount filter: ${filtered.length} products`);
    }

    filtered = filtered.filter(p => 
      p.price >= this.filters.priceRange[0] && p.price <= this.filters.priceRange[1]
    );
    console.log(`   After price filter: ${filtered.length} products`);

    // ✅ FIX: Size filter - SHOWS ALL VARIATIONS WITH THAT SIZE
    if (this.filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes && p.sizes.some(size => this.filters.sizes.includes(size))
      );
      console.log(`   After size filter (${this.filters.sizes.join(', ')}): ${filtered.length} products`);
    }

    // ✅ FIX: Color filter - SHOWS ALL VARIATIONS WITH THAT COLOR
    if (this.filters.colors.length > 0) {
      filtered = filtered.filter(p => this.filters.colors.includes(p.color));
      console.log(`   After color filter: ${filtered.length} products`);
    }

    if (this.filters.brands.length > 0) {
      filtered = filtered.filter(p => this.filters.brands.includes(p.brand));
      console.log(`   After brand filter: ${filtered.length} products`);
    }

    // ✅ SMART DEDUPLICATION LOGIC
    // If NO specific filters (size/color) are active, show only 1 card per productId
    // If specific filters ARE active, show variations only if they actually differ
    const hasSpecificFilters = this.filters.sizes.length > 0 || this.filters.colors.length > 0;
    const hasAnyFilter = 
      this.filters.sizes.length > 0 || 
      this.filters.colors.length > 0 ||
      this.filters.category.length > 0 ||
      this.filters.subcategory.length > 0 ||
      this.filters.gender.length > 0 ||
      this.filters.brands.length > 0 ||
      this.filters.isNew ||
      this.filters.isFeatured ||
      this.filters.isBestSeller ||
      this.filters.hasDiscount;
    
    if (!hasAnyFilter) {
      // No filters at all → show 1 card per productId
      filtered = this.getUniqueProductsFromArray(filtered);
      console.log(`✅ No filters → Showing unique products: ${filtered.length}`);
    } else if (!hasSpecificFilters) {
      // Only general filters (gender, category, etc.) → show 1 card per productId
      // Example: Filter "Men" → all variations are men → show only 1 card
      filtered = this.getUniqueProductsFromArray(filtered);
      console.log(`✅ Only general filters → Showing unique products: ${filtered.length}`);
    } else {
      // Specific filters (size/color) → show variations that actually differ
      // Example: Filter "Size 7" → show only variations with size 7
      filtered = this.smartDeduplicateVariations(filtered);
      console.log(`✅ Specific filters → Smart deduplicated: ${filtered.length}`);
    }

    switch (this.filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // ✅ Sort by dateAdded (newest first)
        filtered.sort((a, b) => {
          const dateA = new Date(a.dateAdded || '1970-01-01');
          const dateB = new Date(b.dateAdded || '1970-01-01');
          return dateB - dateA;
        });
        break;
      case 'featured':
        // ✅ Show featured products first
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
        break;
      case 'best-sellers':
        // ✅ Show best sellers first
        filtered.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return 0;
        });
        break;
    }

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.selectedProducts.clear();
  }

  setFilter(filterType, value) {
    if (Array.isArray(this.filters[filterType])) {
      const index = this.filters[filterType].indexOf(value);
      if (index > -1) {
        this.filters[filterType].splice(index, 1);
      } else {
        this.filters[filterType].push(value);
      }
    } else {
      this.filters[filterType] = value;
    }
    
    this.applyFilters();
    this.render();
  }

  clearFilters() {
    this.filters = {
      category: [],
      subcategory: [],
      gender: [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [0, 20000],
      sortBy: 'featured',
      isNew: false,
      isFeatured: false,
      isBestSeller: false,
      hasDiscount: false
    };
    
    this.applyFilters();
    this.render();
    this.renderFilters();
  }

  setPriceRange(min, max) {
    this.filters.priceRange = [min, max];
    this.applyFilters();
    this.render();
  }

  setPage(page) {
    this.currentPage = page;
    this.render();
    scrollToTop();
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  toggleProductSelection(productId) {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
    this.render();
  }

  toggleSelectAll() {
    const currentProducts = this.getCurrentPageProducts();
    if (this.selectedProducts.size === currentProducts.length) {
      this.selectedProducts.clear();
    } else {
      currentProducts.forEach(p => this.selectedProducts.add(p.id));
    }
    this.render();
  }

  addSelectedToBag() {
    if (this.selectedProducts.size === 0) {
      showToast('Please select products first', 'error');
      return;
    }
    
    let added = 0;
    this.selectedProducts.forEach(productId => {
      const product = this.allProducts.find(p => p.id === productId);
      if (product) {
        cart.addItem(product, product.sizes[0] || null);
        added++;
      }
    });
    
    showToast(`Added ${added} items to bag`, 'success');
    this.selectedProducts.clear();
    this.render();
  }

  getCurrentPageProducts() {
    const start = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const end = start + CONFIG.ITEMS_PER_PAGE;
    return this.filteredProducts.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.filteredProducts.length / CONFIG.ITEMS_PER_PAGE);
  }

  render() {
    const container = document.getElementById('products-container');
    const currentProducts = this.getCurrentPageProducts();
    const totalPages = this.getTotalPages();
    const start = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE + 1;
    const end = Math.min(start + CONFIG.ITEMS_PER_PAGE - 1, this.filteredProducts.length);

    let html = `
      <!-- Toolbar -->
      <div class="products-toolbar">
        <div class="toolbar-left">
          <p class="results-count">Showing ${start}-${end} of ${this.filteredProducts.length} results</p>
          
          <button onclick="openFiltersDrawer()" class="filters-btn-mobile">
            <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
            Filters
          </button>
        </div>

        <div class="toolbar-right">
          <select onchange="productCatalog.setFilter('sortBy', this.value)" class="sort-select">
            <option value="featured" ${this.filters.sortBy === 'featured' ? 'selected' : ''}>Featured</option>
            <option value="newest" ${this.filters.sortBy === 'newest' ? 'selected' : ''}>Newest</option>
            <option value="price-asc" ${this.filters.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${this.filters.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="name-asc" ${this.filters.sortBy === 'name-asc' ? 'selected' : ''}>Name: A to Z</option>
          </select>

          <div class="view-toggle">
            <button onclick="productCatalog.setViewMode('grid')" class="${this.viewMode === 'grid' ? 'active' : ''}">
              <i data-lucide="grid-2x2" class="w-4 h-4"></i>
            </button>
            <button onclick="productCatalog.setViewMode('list')" class="hide-on-mobile ${this.viewMode === 'list' ? 'active' : ''}">
              <i data-lucide="list" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Active Filters -->
      ${this.renderActiveFilters()}

      <!-- Selected Items Actions -->
      ${this.selectedProducts.size > 0 ? `
        <div class="selected-actions">
          <span>${this.selectedProducts.size} items selected</span>
          <button onclick="productCatalog.addSelectedToBag()" class="btn-add-selected">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            Add Selected to Bag
          </button>
          <button onclick="productCatalog.selectedProducts.clear(); productCatalog.render()" class="btn-clear-selected">
            Clear
          </button>
        </div>
      ` : ''}

      <!-- Products -->
      ${currentProducts.length === 0 ? this.renderEmpty() : 
        this.viewMode === 'grid' ? this.renderGrid(currentProducts) : this.renderList(currentProducts)}

      <!-- Pagination -->
      ${totalPages > 1 ? this.renderPagination(totalPages) : ''}
    `;

    container.innerHTML = html;
    lucide.createIcons();
  }

  renderActiveFilters() {
    const activeFilters = [
      ...this.filters.category,
      ...this.filters.gender,
      ...this.filters.sizes,
      ...this.filters.colors,
      ...this.filters.brands
    ];

    if (activeFilters.length === 0) return '';

    return `
      <div class="active-filters">
        <span class="filter-label">Active Filters:</span>
        ${activeFilters.map(filter => `
          <button class="filter-tag" onclick="productCatalog.removeFilter('${filter}')">
            ${sanitizeHTML(filter)}
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        `).join('')}
        <button onclick="productCatalog.clearFilters()" class="clear-all">
          Clear All
        </button>
      </div>
    `;
  }

  removeFilter(value) {
    for (const key in this.filters) {
      if (Array.isArray(this.filters[key])) {
        this.filters[key] = this.filters[key].filter(v => v !== value);
      }
    }
    this.applyFilters();
    this.render();
    this.renderFilters();
  }

  renderGrid(products) {
    return `
      <div class="products-grid">
        ${products.map(product => this.renderProductCard(product)).join('')}
      </div>
    `;
  }

  renderProductCard(product) {
    // ✅ NEW: Get all variations for this product ID
    const groupId = product.productId || product.id;
    const variations = this.productGroups[groupId] || [product];
    const colorVariations = variations.slice(0, 6);
    
    // Ensure product.id exists
    const productId = product.id || `prod-${product.name.replace(/\s/g, '-').toLowerCase()}`;
    
    return `
      <div onclick="openProductModal('${groupId}')" class="product-card">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${sanitizeHTML(product.name)}" class="product-image" id="img-${product.id}">
          
          <div class="product-badges">
            ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
            ${product.discount ? `<span class="badge badge-sale">-${product.discount}%</span>` : ''}
          </div>



          ${variations.length > 1 ? `
            <div class="product-variations">
              ${colorVariations.map((v, idx) => `
                <button class="variation-thumb ${v.id === product.id ? 'active' : ''}" 
                        onclick="changeCardImage('${product.id}', '${v.image}', this, event)"
                        style="background-color: ${v.colorCode || '#ccc'}">
                  <img src="${v.image}" alt="${v.color}">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="product-info p-4">
          <p class="product-brand">${sanitizeHTML(product.brand)}</p>
          <h3 class="product-name">${sanitizeHTML(product.name)}</h3>
          <p class="product-category">${sanitizeHTML(product.gender)}'s ${sanitizeHTML(product.category)}</p>
          <p class="product-colors">${variations.length} ${variations.length === 1 ? 'Color' : 'Colors'}</p>
          
          <div class="product-price">
            ${product.discount ? `
              <span class="price-original">${formatCurrency(product.originalPrice)}</span>
              <span class="price-sale">${formatCurrency(product.price)}</span>
            ` : `
              <span class="price-current">${formatCurrency(product.price)}</span>
            `}
          </div>

          
        </div>
      </div>
    `;
  }

  renderList(products) {
    return `
      <div class="products-list">
        <table class="products-table">
          <thead>
            <tr>
             
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Sizes</th>
              <th>Price</th>
             
            </tr>
          </thead>
          <tbody>
            ${products.map(product => this.renderListRow(product)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderListRow(product) {
    const isSelected = this.selectedProducts.has(product.id);
    // ✅ NEW: Use ID-based grouping
    const groupId = product.productId || product.id;
    const variations = this.productGroups[groupId] || [product];
    
    return `
      <tr class="${isSelected ? 'selected' : ''} hover:bg-gray-100 hover:cursor-pointer" onclick="openProductModal('${groupId}')">
   
        <td>
          <div class="list-product-info">
            <img src="${product.image}" alt="${sanitizeHTML(product.name)}">
            <div>
              <p class="list-product-name">${sanitizeHTML(product.name)}</p>
              <p class="list-product-meta">${sanitizeHTML(product.gender)} • ${sanitizeHTML(product.subcategory)} ${sanitizeHTML(product.category)}</p>
              <p class="list-product-colors">${variations.length} ${variations.length === 1 ? 'Color' : 'Colors'}</p>
            </div>
          </div>
        </td>
        <td>${sanitizeHTML(product.category)}</td>
        <td>${sanitizeHTML(product.brand)}</td>
        <td>
          <div class="sizes-compact">
            ${product.sizes.slice(0, 4).map(size => `<span class="size-chip">${size}</span>`).join('')}
            ${product.sizes.length > 4 ? `<span class="size-more">+${product.sizes.length - 4}</span>` : ''}
          </div>
        </td>
        <td>
          <div class="list-price">
            ${product.discount ? `
              <span class="price-original small">${formatCurrency(product.originalPrice)}</span>
              <span class="price-sale">${formatCurrency(product.price)}</span>
            ` : `
              <span class="price-current">${formatCurrency(product.price)}</span>
            `}
          </div>
        </td>

      </tr>
    `;
  }

  renderEmpty() {
    return `
      <div class="empty-state">
        <i data-lucide="package-x" class="empty-icon"></i>
        <p class="empty-title">No products found</p>
        <p class="empty-text">Try adjusting your filters</p>
        <button onclick="productCatalog.clearFilters()" class="btn-reset">
          Clear All Filters
        </button>
      </div>
    `;
  }

  renderPagination(totalPages) {
    if (totalPages <= 1) return '';
    
    let pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (this.currentPage <= 3) {
        pages = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (this.currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', totalPages];
      }
    }

    return `
      <div class="pagination-wrapper">
        <div class="pagination">
          <button onclick="productCatalog.setPage(${this.currentPage - 1})" 
                  ${this.currentPage === 1 ? 'disabled' : ''} 
                  class="btn-page btn-nav">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
            <span class="nav-text pr-2">Previous</span>
          </button>
          
          ${pages.map(page => {
            if (page === '...') {
              return '<span class="page-dots">...</span>';
            }
            return `
              <button onclick="productCatalog.setPage(${page})" 
                      class="btn-page ${this.currentPage === page ? 'active' : ''}">
                ${page}
              </button>
            `;
          }).join('')}
          
          <button onclick="productCatalog.setPage(${this.currentPage + 1})" 
                  ${this.currentPage === totalPages ? 'disabled' : ''} 
                  class="btn-page btn-nav">
            <span class="nav-text pl-2">Next</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }

  renderFilters() {
    const filtersContainer = document.getElementById('filters-container');
    if (!filtersContainer) return;
    
    // ✅ NEW: If still loading, show disabled state
    const shouldDisable = this.isLoading;

    // ✅ CRITICAL FIX: Get sizes from FILTERED products, not all products
    // This way, size options only show sizes that exist in the currently selected categories
    let productsForFilters = this.allProducts;
    
    // If category filter is active, only get sizes from those categories
    if (this.filters.category.length > 0) {
      productsForFilters = this.allProducts.filter(p => this.filters.category.includes(p.category));
    }
    
    // DYNAMIC: Extract unique values
    const uniqueBrands = [...new Set(this.allProducts.map(p => p.brand))].filter(Boolean).sort();
    const uniqueColors = [...new Set(this.allProducts.map(p => p.color))].filter(Boolean).sort();
    const allSizes = [...new Set(productsForFilters.flatMap(p => p.sizes || []))].filter(Boolean);
    
    // ✅ Sort sizes properly - numeric first (7,8,9,10,11,12), then letters (S,M,L,XL,XXL)
    const numericSizes = allSizes.filter(s => !isNaN(s)).sort((a, b) => Number(a) - Number(b));
    const letterSizes = allSizes.filter(s => isNaN(s)).sort((a, b) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      return order.indexOf(a) - order.indexOf(b);
    });
    const uniqueSizes = [...numericSizes, ...letterSizes];
    
    console.log('🎨 Dynamic filters:', { brands: uniqueBrands, colors: uniqueColors, sizes: uniqueSizes });

    filtersContainer.innerHTML = `
      <div class="filters-content">
        <h3 class="filters-title">Filters</h3>
        
        ${this.renderPriceFilter()}
        ${this.renderCheckboxFilter('Category', 'category', ['Shoes', 'Apparel', 'Accessories'])}
        ${this.renderCheckboxFilter('Gender', 'gender', ['Men', 'Women', 'Unisex', 'Kids'])}
        ${this.renderCheckboxFilter('Brand', 'brands', uniqueBrands)}
        ${this.renderCheckboxFilter('Size', 'sizes', uniqueSizes)}
        ${this.renderCheckboxFilter('Color', 'colors', uniqueColors)}
      </div>
    `;

    lucide.createIcons();
    
    // ✅ NEW: If still loading, disable all filters
    if (shouldDisable) {
      this.disableFilters();
    }
  }

  renderPriceFilter() {
    return `
      <div class="filter-group">
        <button class="filter-header" onclick="toggleFilter(this)">
          <span>Price Range</span>
          <i data-lucide="chevron-down" class="chevron"></i>
        </button>
        <div class="filter-body">
          <div class="price-inputs">
            <input type="range" id="price-min" min="0" max="20000" step="100" 
                   value="${this.filters.priceRange[0]}" 
                   oninput="updatePriceRange()" class="price-range">
            <input type="range" id="price-max" min="0" max="20000" step="100" 
                   value="${this.filters.priceRange[1]}" 
                   oninput="updatePriceRange()" class="price-range">
            <div class="price-labels">
              <span id="price-min-label">${formatCurrency(this.filters.priceRange[0])}</span>
              <span id="price-max-label">${formatCurrency(this.filters.priceRange[1])}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCheckboxFilter(title, filterKey, options) {
    // ✅ NEW: Professional handling of long lists (e.g., sizes)
    const isLongList = options.length > 10;
    const containerClass = filterKey === 'sizes' && isLongList ? 'filter-body-scrollable' : 'filter-body';
    
    return `
      <div class="filter-group">
        <button class="filter-header" onclick="toggleFilter(this)">
          <span>${title}</span>
          <i data-lucide="chevron-down" class="chevron"></i>
        </button>
        <div class="${containerClass}">
          ${options.map(option => `
            <label class="filter-option">
              <input type="checkbox" 
                     onchange="productCatalog.setFilter('${filterKey}', '${option}')" 
                     ${this.filters[filterKey].includes(option) ? 'checked' : ''}>
              <span>${option}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // ✅ NEW: Enable filters after data loads
  enableFilters() {
    const filtersContainer = document.getElementById('filters-container');
    if (!filtersContainer) return;
    
    // Remove disabled state from all filter inputs
    const inputs = filtersContainer.querySelectorAll('input, button');
    inputs.forEach(input => {
      input.disabled = false;
      input.style.opacity = '1';
      input.style.cursor = 'pointer';
    });
    
    // Remove loading overlay if exists
    const overlay = filtersContainer.querySelector('.filters-loading-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    console.log('✅ Filters enabled');
  }
  
  // ✅ NEW: Disable filters during loading
  disableFilters() {
    const filtersContainer = document.getElementById('filters-container');
    if (!filtersContainer) return;
    
    // Add loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'filters-loading-overlay';
    overlay.innerHTML = `
      <div class="filters-loading-content">
        <div class="spinner"></div>
        <p>Loading filters...</p>
      </div>
    `;
    filtersContainer.style.position = 'relative';
    filtersContainer.appendChild(overlay);
    
    console.log('✅ Filters disabled during loading');
  }
}

// Initialize
const productCatalog = new ProductCatalog();
window.productCatalog = productCatalog; // Make globally accessible

console.log('✅ ProductCatalog class instantiated and made global');

// Helper functions
function toggleFilter(button) {
  const filterGroup = button.parentElement;
  // ✅ FIX: Support both .filter-body and .filter-body-scrollable
  const body = filterGroup.querySelector('.filter-body, .filter-body-scrollable');
  const chevron = button.querySelector('.chevron');
  const isOpen = filterGroup.classList.contains('open');
  
  if (!body) {
    console.error('❌ Filter body not found in:', filterGroup);
    return;
  }
  
  if (isOpen) {
    filterGroup.classList.remove('open');
    body.style.maxHeight = '0';
  } else {
    filterGroup.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

function updatePriceRange() {
  const min = parseInt(document.getElementById('price-min').value);
  const max = parseInt(document.getElementById('price-max').value);
  
  document.getElementById('price-min-label').textContent = formatCurrency(min);
  document.getElementById('price-max-label').textContent = formatCurrency(max);
  
  productCatalog.setPriceRange(min, max);
}

function changeMainImage(productId, imageSrc, btn, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  const card = btn.closest('.product-card');
  const mainImg = card.querySelector('.product-image');
  
  mainImg.style.opacity = '0.6';
  setTimeout(() => {
    mainImg.src = imageSrc;
    mainImg.style.opacity = '1';
  }, 150);
  
  card.querySelectorAll('.variation-thumb').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

// Favorites removed - no function

function openFiltersDrawer() {
  const drawer = document.getElementById('filters-drawer');
  drawer.classList.remove('hidden');
  
  // Render filters in drawer
  const drawerContent = drawer.querySelector('.filters-drawer-content');
  if (drawerContent) {
    drawerContent.innerHTML = `
      <div class="filters-drawer-header">
        <h3>Filters</h3>
        <button onclick="closeFiltersDrawer()" class="close-drawer-btn">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>
      <div id="mobile-filters-container" class="filters-drawer-body"></div>
      <div class="filters-drawer-footer">
        <button onclick="closeFiltersDrawer()" class="btn-apply-filters">
          Apply Filters
        </button>
      </div>
    `;
    
    // Render filters
    const mobileContainer = document.getElementById('mobile-filters-container');
    const tempFiltersContainer = document.getElementById('filters-container');
    if (tempFiltersContainer && mobileContainer) {
      mobileContainer.innerHTML = tempFiltersContainer.innerHTML;
    }
    
    lucide.createIcons();
  }
}

function changeCardImage(cardId, imageSrc, btn, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  const img = document.getElementById(`img-${cardId}`);
  if (img) {
    img.style.opacity = '0.6';
    setTimeout(() => {
      img.src = imageSrc;
      img.style.opacity = '1';
    }, 150);
  }
  
  // Update active state
  const card = btn.closest('.product-card');
  if (card) {
    card.querySelectorAll('.variation-thumb').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
}

function closeFiltersDrawer() {
  document.getElementById('filters-drawer').classList.add('hidden');
}
