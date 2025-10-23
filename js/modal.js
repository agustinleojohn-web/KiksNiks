// Product Modal System

function openProductModal(productIdOrName) {
  console.log('🔵 Opening modal for:', productIdOrName);
  
  // Check if productCatalog exists
  if (!window.productCatalog) {
    console.error('❌ Product catalog not initialized - waiting...');
    setTimeout(() => openProductModal(productIdOrName), 500);
    return;
  }
  
  // Check if productGroups exists
  if (!window.productCatalog.productGroups) {
    console.error('❌ Product groups not initialized');
    showToast('Please wait for products to load', 'error');
    return;
  }
  
  // ✅ NEW: Get all variations for this product ID
  let variations = productCatalog.productGroups[productIdOrName] || [];
  console.log('🔵 Found variations:', variations.length);
  
  if (variations.length === 0) {
    console.error('❌ No variations found for:', productIdOrName);
    console.log('Available product IDs:', Object.keys(productCatalog.productGroups));
    showToast('Product not found', 'error');
    return;
  }
  
  // ✅ FIX: Filter variations based on ALL current filters
  if (window.productCatalog && window.productCatalog.filters) {
    const filters = window.productCatalog.filters;
    
    variations = variations.filter(v => {
      // Price filter
      if (v.price < filters.priceRange[0] || v.price > filters.priceRange[1]) {
        return false;
      }
      
      // Gender filter
      if (filters.gender.length > 0 && !filters.gender.includes(v.gender)) {
        return false;
      }
      
      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(v.category)) {
        return false;
      }
      
      // Subcategory filter
      if (filters.subcategory.length > 0 && !filters.subcategory.includes(v.subcategory)) {
        return false;
      }
      
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(v.brand)) {
        return false;
      }
      
      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(v.color)) {
        return false;
      }
      
      // Boolean filters
      if (filters.isNew && !v.isNew) {
        return false;
      }
      
      if (filters.isFeatured && !v.isFeatured) {
        return false;
      }
      
      if (filters.isBestSeller && !v.isBestSeller) {
        return false;
      }
      
      if (filters.hasDiscount && (!v.discount || v.discount <= 0)) {
        return false;
      }
      
      return true;
    });
    
    console.log(`✅ Filtered variations: ${variations.length} variations match current filters`);
    
    if (variations.length === 0) {
      console.warn('⚠️ No variations match current filters!');
      showToast('No color variations match your current filters', 'info');
      return;
    }
  }
  
  // Start with first variation
  const product = variations[0];
  console.log('✅ Using product:', product);
  
  // Get related images (different angles) for this variation
  let relatedImages = [];
  if (product.images) {
    if (typeof product.images === 'string') {
      relatedImages = product.images.split(',').map(img => img.trim()).filter(img => img);
    } else if (Array.isArray(product.images)) {
      relatedImages = product.images;
    }
  }
  
  // Fallback to main image if no related images
  if (relatedImages.length === 0) {
    relatedImages = [product.image];
  }
  
  console.log('🖼️ Related images:', relatedImages.length);
  
  const modalHTML = `
    <div class="modal-overlay" onclick="closeProductModal(event)">
      <div class="modal-container" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeProductModal()">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <div class="modal-content">
          <!-- Left Side - Images -->
          <div class="modal-images">
            <div class="thumbnails-vertical" id="modal-thumbnails">
              ${relatedImages.map((img, idx) => `
                <button class="thumb-vertical ${idx === 0 ? 'active' : ''}" 
                        onclick="changeModalRelatedImage('${escapeQuotes(img)}', ${idx}, this)">
                  <img src="${escapeQuotes(img)}" alt="View ${idx + 1}">
                </button>
              `).join('')}
            </div>
            
            <div class="main-image-container">
              <img src="${relatedImages[0]}" alt="${sanitizeHTML(product.name)}" 
                   class="modal-main-image" id="modal-main-image">
              
              ${product.isNew ? '<span class="modal-badge badge-new">★ Highly Rated</span>' : ''}
              
              <div class="image-nav">
                <button class="nav-arrow" onclick="navigateRelatedImage(-1)">
                  <i data-lucide="chevron-left" class="w-6 h-6"></i>
                </button>
                <button class="nav-arrow" onclick="navigateRelatedImage(1)">
                  <i data-lucide="chevron-right" class="w-6 h-6"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Side - Details -->
          <div class="modal-details">
            <div class="modal-header">
              <div>
                <h2 class="modal-title" id="modal-title">${sanitizeHTML(product.name)}</h2>
                <p class="modal-subtitle" id="modal-subtitle">${sanitizeHTML(product.subcategory)}'s ${sanitizeHTML(product.category)}</p>
              </div>
              <p class="modal-price" id="modal-price">${formatCurrency(product.price)}</p>
            </div>

            <!-- Color Variations -->
            ${variations.length > 1 ? `
              <div class="modal-section">
                <p class="section-label">Select Color</p>
                <div class="color-selector">
                  ${variations.map((v, idx) => `
                    <button class="color-option ${idx === 0 ? 'active' : ''}" 
                            onclick="changeModalVariation('${escapeQuotes(v.id)}')"
                            title="${escapeQuotes(v.color)}">
                      <img src="${v.image}" alt="${escapeQuotes(v.color)}">
                      <span class="color-name">${sanitizeHTML(v.color)}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Size Selector -->
            <div class="modal-section">
              <div class="size-header">
                <span class="size-title">Select Size</span>
                <button class="size-guide-link" onclick="showSizeGuide()">
                  <i data-lucide="ruler" class="w-4 h-4"></i>
                  Size Guide
                </button>
              </div>
              
              <div class="size-grid-modal" id="modal-size-grid">
                ${(product.sizes || []).map(size => `
                  <button class="size-btn-modal" 
                          onclick="selectModalSize('${size}', this)" 
                          data-size="${size}">
                    ${product.category === 'Shoes' ? 'US ' : ''}${size}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button onclick="addModalProductToBag()" class="btn-add-bag">
                Add to Bag
              </button>

            </div>

            <!-- Product Description -->
            <div class="modal-section">
              <p class="product-description" id="modal-description">
                ${product.description || `Experience premium quality with the ${product.name}. Designed for ${product.gender.toLowerCase()} who demand both style and performance. Features advanced materials and innovative design for all-day comfort.`}
              </p>
              
              <div class="product-details-list" id="modal-details">
                <p class="details-title">Product Details:</p>
                <ul>
                  <li>Colour Shown: <span id="modal-colour-shown">${product.colourShown || product.color}</span></li>
                  <li>Style: <span id="modal-style">${product.style || product.id}</span></li>
                  <li>Country/Region of Origin: <span id="modal-origin">${product.origin || 'Vietnam'}</span></li>
                </ul>
              </div>
              
              <button class="link-view-product" onclick="alert('Full product details coming soon!')">
                View Product Details
              </button>
            </div>

            <!-- Delivery & Returns -->
            <div class="modal-section">
              <button class="accordion-header" onclick="toggleAccordion(this)">
                <span class="accordion-title">Free Delivery and Returns</span>
                <i data-lucide="chevron-down" class="w-5 h-5 accordion-icon"></i>
              </button>
              <div class="accordion-body">
                <p>Your order of ₱3,000 or more gets free standard delivery.</p>
                <ul class="delivery-list">
                  <li>Standard delivered 4-5 Business Days</li>
                  <li>Express delivered 2-4 Business Days</li>
                </ul>
                <p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>
              </div>
            </div>

            <!-- Reviews -->
            <div class="modal-section">
              <button class="accordion-header" onclick="toggleAccordion(this)">
                <span class="accordion-title">
                  Reviews (${Math.floor(Math.random() * 50) + 10})
                </span>
                <div class="reviews-rating">
                  ${'★'.repeat(5)}
                  <i data-lucide="chevron-down" class="w-5 h-5 accordion-icon"></i>
                </div>
              </button>
              <div class="accordion-body">
                <p>Customer reviews will be displayed here. Join our community and share your experience!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  let modalContainer = document.getElementById('product-modal');
  if (!modalContainer) {
    console.warn('⚠️ Modal container not found, creating it now...');
    modalContainer = document.createElement('div');
    modalContainer.id = 'product-modal';
    modalContainer.className = 'hidden';
    document.body.appendChild(modalContainer);
    console.log('✅ Modal container created and added to DOM');
  }
  
  console.log('✅ Rendering modal HTML...');
  modalContainer.innerHTML = modalHTML;
  
  console.log('✅ Showing modal...');
  modalContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Force display
  modalContainer.style.display = 'block';
  modalContainer.style.visibility = 'visible';
  modalContainer.style.opacity = '1';
  modalContainer.style.zIndex = '10000';
  
  // Re-initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  console.log('✅ Modal displayed successfully!');
  
  // ✅ FIX: Disable background scroll
  disableBodyScroll();
  
  // Store current modal data
  window.currentModalData = {
    productId: productIdOrName,
    variations: variations,
    currentVariation: product,
    currentRelatedImages: relatedImages,
    currentImageIndex: 0,
    selectedSize: null
  };
  
  // ✅ FIX: Setup keyboard navigation
  setupModalKeyboardNavigation();
}

function changeModalVariation(variationId) {
  console.log('🔄 Changing variation to:', variationId);
  
  if (!window.currentModalData) {
    console.error('❌ No currentModalData found!');
    return;
  }
  
  console.log('Available variations:', window.currentModalData.variations);
  
  const variation = window.currentModalData.variations.find(v => v.id === variationId);
  if (!variation) {
    console.error('❌ Variation not found:', variationId);
    return;
  }
  
  console.log('✅ Found variation:', variation);
  
  // Get related images for this variation - handle both string and array
  let newRelatedImages;
  if (variation.images) {
    // Check if it's already an array
    if (Array.isArray(variation.images)) {
      newRelatedImages = variation.images;
    } else if (typeof variation.images === 'string') {
      // It's a string, split it
      newRelatedImages = variation.images.split(',').map(img => img.trim());
    } else {
      // Fallback to main image
      newRelatedImages = [variation.image];
    }
  } else {
    newRelatedImages = [variation.image];
  }
  
  console.log('New images:', newRelatedImages);
  
  window.currentModalData.currentVariation = variation;
  window.currentModalData.currentRelatedImages = newRelatedImages;
  window.currentModalData.currentImageIndex = 0;
  window.currentModalData.selectedSize = null; // Reset size selection
  
  // ✅ FIX: Update ALL details (not just images!)
  
  // Update main image
  const mainImg = document.getElementById('modal-main-image');
  if (mainImg) {
    mainImg.style.opacity = '0.6';
    setTimeout(() => {
      mainImg.src = newRelatedImages[0];
      mainImg.style.opacity = '1';
    }, 150);
  }
  
  // Update related images thumbnails
  const thumbsContainer = document.getElementById('modal-thumbnails');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = newRelatedImages.map((img, idx) => `
      <button class="thumb-vertical ${idx === 0 ? 'active' : ''}" 
              onclick="changeModalRelatedImage('${escapeQuotes(img)}', ${idx}, this)">
        <img src="${escapeQuotes(img)}" alt="View ${idx + 1}">
      </button>
    `).join('');
  }
  
  // Update details
  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = variation.name;
  
  const subtitleEl = document.getElementById('modal-subtitle');
  if (subtitleEl) subtitleEl.textContent = `${variation.subcategory} ${variation.category}`;
  
  // ✅ Update price with discount support
  const priceEl = document.getElementById('modal-price');
  if (priceEl) {
    const hasDiscount = variation.discount && variation.originalPrice;
    priceEl.innerHTML = hasDiscount 
      ? `<span class="text-2xl font-bold">₱${variation.price.toLocaleString()}</span>
         <span class="ml-2 line-through text-gray-400">₱${variation.originalPrice.toLocaleString()}</span>
         <span class="ml-2 text-red-600">-${variation.discount}%</span>`
      : `₱${variation.price.toLocaleString()}`;
  }
  
  // ✅ Update color displayed
  const colorEl = document.getElementById('modal-color-name');
  if (colorEl) colorEl.textContent = variation.color;
  
  // ✅ Update colour shown (Nike style)
  const colourShownEl = document.getElementById('modal-colour-shown');
  if (colourShownEl && variation.colourShown) {
    colourShownEl.textContent = `Colour Shown: ${variation.colourShown}`;
  }
  
  // ✅ Update style code
  const styleEl = document.getElementById('modal-style');
  if (styleEl && variation.style) {
    styleEl.textContent = `Style: ${variation.style}`;
  }
  
  // ✅ Update sizes - only show sizes from Google Sheet for this variation
  const sizeGrid = document.getElementById('modal-size-grid');
  if (sizeGrid) {
    const sizesArray = variation.sizes || [];
    console.log('✅ Sizes for this variation:', sizesArray);
    
    sizeGrid.innerHTML = sizesArray.map(size => `
      <button class="size-btn-modal" 
              onclick="selectModalSize('${size}', this)" 
              data-size="${size}">
        ${variation.category === 'Shoes' ? 'US ' : ''}${size}
      </button>
    `).join('');
  }
  
  // Update active color
  document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
  document.querySelectorAll('.color-option').forEach((opt, idx) => {
    if (window.currentModalData.variations[idx]?.id === variationId) {
      opt.classList.add('active');
    }
  });
  
  lucide.createIcons();
}

function changeModalRelatedImage(imageSrc, index, btn) {
  const mainImg = document.getElementById('modal-main-image');
  mainImg.style.opacity = '0.6';
  setTimeout(() => {
    mainImg.src = imageSrc;
    mainImg.style.opacity = '1';
  }, 150);
  
  if (window.currentModalData) {
    window.currentModalData.currentImageIndex = index;
  }
  
  // Update active thumbnail
  document.querySelectorAll('.thumb-vertical').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function navigateRelatedImage(direction) {
  if (!window.currentModalData) return;
  
  const { currentRelatedImages, currentImageIndex } = window.currentModalData;
  let newIndex = currentImageIndex + direction;
  
  if (newIndex < 0) newIndex = currentRelatedImages.length - 1;
  if (newIndex >= currentRelatedImages.length) newIndex = 0;
  
  const newImage = currentRelatedImages[newIndex];
  window.currentModalData.currentImageIndex = newIndex;
  
  const mainImg = document.getElementById('modal-main-image');
  mainImg.style.opacity = '0.6';
  setTimeout(() => {
    mainImg.src = newImage;
    mainImg.style.opacity = '1';
  }, 150);
  
  // Update active thumbnail
  document.querySelectorAll('.thumb-vertical').forEach((t, idx) => {
    t.classList.toggle('active', idx === newIndex);
  });
}

function closeProductModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modalContainer = document.getElementById('product-modal');
  if (modalContainer) {
    modalContainer.classList.add('hidden');
    modalContainer.style.display = 'none';
    modalContainer.innerHTML = '';
  }
  
  // ✅ FIX: Re-enable background scroll
  enableBodyScroll();
  window.currentModalData = null;
  
  // ✅ FIX: Remove keyboard listener
  removeModalKeyboardNavigation();
  
  // Re-initialize icons on the main page
  if (typeof lucide !== 'undefined') {
    setTimeout(() => {
      lucide.createIcons();
    }, 100);
  }
  
  console.log('✅ Modal closed successfully');
}

function changeModalImage(imageSrc, btn) {
  const mainImg = document.getElementById('modal-main-image');
  
  mainImg.style.opacity = '0.6';
  setTimeout(() => {
    mainImg.src = imageSrc;
    mainImg.style.opacity = '1';
  }, 150);
  
  // Update active states
  document.querySelectorAll('.thumb-vertical, .color-option').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  // Update current index
  if (window.currentModalData) {
    window.currentModalData.currentImageIndex = window.currentModalData.variations.indexOf(imageSrc);
  }
}

function navigateModalImage(direction) {
  if (!window.currentModalData) return;
  
  const { variations, currentImageIndex } = window.currentModalData;
  let newIndex = currentImageIndex + direction;
  
  if (newIndex < 0) newIndex = variations.length - 1;
  if (newIndex >= variations.length) newIndex = 0;
  
  const newImage = variations[newIndex];
  window.currentModalData.currentImageIndex = newIndex;
  
  const mainImg = document.getElementById('modal-main-image');
  mainImg.style.opacity = '0.6';
  setTimeout(() => {
    mainImg.src = newImage;
    mainImg.style.opacity = '1';
  }, 150);
  
  // Update thumbnails
  document.querySelectorAll('.thumb-vertical').forEach((t, idx) => {
    t.classList.toggle('active', idx === newIndex);
  });
}

function selectModalSize(size, btn) {
  document.querySelectorAll('.size-btn-modal').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  
  if (window.currentModalData) {
    window.currentModalData.selectedSize = size;
  }
}

function addModalProductToBag() {
  if (!window.currentModalData || !window.currentModalData.selectedSize) {
    showToast('Please select a size', 'error');
    
    // Shake animation
    const sizeGrid = document.querySelector('.size-grid-modal');
    if (sizeGrid) {
      sizeGrid.style.animation = 'shake 0.5s';
      setTimeout(() => {
        sizeGrid.style.animation = '';
      }, 500);
    }
    return;
  }
  
  const product = window.currentModalData.currentVariation;
  if (product) {
    cart.addItem(product, window.currentModalData.selectedSize);
    closeProductModal();
  }
}

function toggleAccordion(btn) {
  const accordionBody = btn.nextElementSibling;
  const icon = btn.querySelector('.accordion-icon');
  const isOpen = btn.parentElement.classList.contains('open');
  
  if (isOpen) {
    btn.parentElement.classList.remove('open');
    accordionBody.style.maxHeight = '0';
    icon.style.transform = 'rotate(0deg)';
  } else {
    btn.parentElement.classList.add('open');
    accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px';
    icon.style.transform = 'rotate(180deg)';
  }
}

function showSizeGuide() {
  const modalContainer = document.getElementById('legal-modal');
  if (!modalContainer) return;
  
  const modalHTML = `
    <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75" onclick="closeSizeGuide(event)">
      <div class="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="sticky top-0 bg-black text-white px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold">Size Guide</h2>
          <button onclick="closeSizeGuide()" class="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="overflow-y-auto px-6 py-6" style="max-height: calc(90vh - 140px);">
          <div class="space-y-8">
            <!-- Shoes Size Guide -->
            <div>
              <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="move" class="w-6 h-6"></i>
                Footwear Size Guide
              </h3>
              
              <!-- Men's Shoes -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold mb-3">Men's Shoes</h4>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-4 py-2 text-left">US</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">UK</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">EU</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td class="border border-gray-300 px-4 py-2">6</td><td class="border border-gray-300 px-4 py-2">5.5</td><td class="border border-gray-300 px-4 py-2">38.5</td><td class="border border-gray-300 px-4 py-2">24</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">6.5</td><td class="border border-gray-300 px-4 py-2">6</td><td class="border border-gray-300 px-4 py-2">39</td><td class="border border-gray-300 px-4 py-2">24.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">7</td><td class="border border-gray-300 px-4 py-2">6</td><td class="border border-gray-300 px-4 py-2">40</td><td class="border border-gray-300 px-4 py-2">25</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">7.5</td><td class="border border-gray-300 px-4 py-2">6.5</td><td class="border border-gray-300 px-4 py-2">40.5</td><td class="border border-gray-300 px-4 py-2">25.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">8</td><td class="border border-gray-300 px-4 py-2">7</td><td class="border border-gray-300 px-4 py-2">41</td><td class="border border-gray-300 px-4 py-2">26</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">8.5</td><td class="border border-gray-300 px-4 py-2">7.5</td><td class="border border-gray-300 px-4 py-2">42</td><td class="border border-gray-300 px-4 py-2">26.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">9</td><td class="border border-gray-300 px-4 py-2">8</td><td class="border border-gray-300 px-4 py-2">42.5</td><td class="border border-gray-300 px-4 py-2">27</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">9.5</td><td class="border border-gray-300 px-4 py-2">8.5</td><td class="border border-gray-300 px-4 py-2">43</td><td class="border border-gray-300 px-4 py-2">27.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">10</td><td class="border border-gray-300 px-4 py-2">9</td><td class="border border-gray-300 px-4 py-2">44</td><td class="border border-gray-300 px-4 py-2">28</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">10.5</td><td class="border border-gray-300 px-4 py-2">9.5</td><td class="border border-gray-300 px-4 py-2">44.5</td><td class="border border-gray-300 px-4 py-2">28.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">11</td><td class="border border-gray-300 px-4 py-2">10</td><td class="border border-gray-300 px-4 py-2">45</td><td class="border border-gray-300 px-4 py-2">29</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">11.5</td><td class="border border-gray-300 px-4 py-2">10.5</td><td class="border border-gray-300 px-4 py-2">45.5</td><td class="border border-gray-300 px-4 py-2">29.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">12</td><td class="border border-gray-300 px-4 py-2">11</td><td class="border border-gray-300 px-4 py-2">46</td><td class="border border-gray-300 px-4 py-2">30</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Women's Shoes -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold mb-3">Women's Shoes</h4>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-4 py-2 text-left">US</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">UK</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">EU</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td class="border border-gray-300 px-4 py-2">5</td><td class="border border-gray-300 px-4 py-2">2.5</td><td class="border border-gray-300 px-4 py-2">35.5</td><td class="border border-gray-300 px-4 py-2">22</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">5.5</td><td class="border border-gray-300 px-4 py-2">3</td><td class="border border-gray-300 px-4 py-2">36</td><td class="border border-gray-300 px-4 py-2">22.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">6</td><td class="border border-gray-300 px-4 py-2">3.5</td><td class="border border-gray-300 px-4 py-2">36.5</td><td class="border border-gray-300 px-4 py-2">23</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">6.5</td><td class="border border-gray-300 px-4 py-2">4</td><td class="border border-gray-300 px-4 py-2">37.5</td><td class="border border-gray-300 px-4 py-2">23.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">7</td><td class="border border-gray-300 px-4 py-2">4.5</td><td class="border border-gray-300 px-4 py-2">38</td><td class="border border-gray-300 px-4 py-2">24</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">7.5</td><td class="border border-gray-300 px-4 py-2">5</td><td class="border border-gray-300 px-4 py-2">38.5</td><td class="border border-gray-300 px-4 py-2">24.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">8</td><td class="border border-gray-300 px-4 py-2">5.5</td><td class="border border-gray-300 px-4 py-2">39</td><td class="border border-gray-300 px-4 py-2">25</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">8.5</td><td class="border border-gray-300 px-4 py-2">6</td><td class="border border-gray-300 px-4 py-2">40</td><td class="border border-gray-300 px-4 py-2">25.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">9</td><td class="border border-gray-300 px-4 py-2">6.5</td><td class="border border-gray-300 px-4 py-2">40.5</td><td class="border border-gray-300 px-4 py-2">26</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">9.5</td><td class="border border-gray-300 px-4 py-2">7</td><td class="border border-gray-300 px-4 py-2">41</td><td class="border border-gray-300 px-4 py-2">26.5</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">10</td><td class="border border-gray-300 px-4 py-2">7.5</td><td class="border border-gray-300 px-4 py-2">42</td><td class="border border-gray-300 px-4 py-2">27</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Apparel Size Guide -->
            <div>
              <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="shirt" class="w-6 h-6"></i>
                Apparel Size Guide
              </h3>
              
              <!-- Men's Apparel -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold mb-3">Men's Tops</h4>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-4 py-2 text-left">Size</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Chest (inches)</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Waist (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td class="border border-gray-300 px-4 py-2">XS</td><td class="border border-gray-300 px-4 py-2">32-34</td><td class="border border-gray-300 px-4 py-2">26-28</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">S</td><td class="border border-gray-300 px-4 py-2">34-37</td><td class="border border-gray-300 px-4 py-2">28-30</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">M</td><td class="border border-gray-300 px-4 py-2">38-40</td><td class="border border-gray-300 px-4 py-2">30-33</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">L</td><td class="border border-gray-300 px-4 py-2">41-44</td><td class="border border-gray-300 px-4 py-2">33-36</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">XL</td><td class="border border-gray-300 px-4 py-2">45-48</td><td class="border border-gray-300 px-4 py-2">36-40</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">XXL</td><td class="border border-gray-300 px-4 py-2">49-52</td><td class="border border-gray-300 px-4 py-2">40-44</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Women's Apparel -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold mb-3">Women's Tops</h4>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-4 py-2 text-left">Size</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Bust (inches)</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Waist (inches)</th>
                        <th class="border border-gray-300 px-4 py-2 text-left">Hips (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td class="border border-gray-300 px-4 py-2">XS</td><td class="border border-gray-300 px-4 py-2">30-32</td><td class="border border-gray-300 px-4 py-2">23-25</td><td class="border border-gray-300 px-4 py-2">33-35</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">S</td><td class="border border-gray-300 px-4 py-2">32-34</td><td class="border border-gray-300 px-4 py-2">25-27</td><td class="border border-gray-300 px-4 py-2">35-37</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">M</td><td class="border border-gray-300 px-4 py-2">34-37</td><td class="border border-gray-300 px-4 py-2">27-30</td><td class="border border-gray-300 px-4 py-2">37-40</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">L</td><td class="border border-gray-300 px-4 py-2">37-40</td><td class="border border-gray-300 px-4 py-2">30-33</td><td class="border border-gray-300 px-4 py-2">40-43</td></tr>
                      <tr><td class="border border-gray-300 px-4 py-2">XL</td><td class="border border-gray-300 px-4 py-2">40-44</td><td class="border border-gray-300 px-4 py-2">33-37</td><td class="border border-gray-300 px-4 py-2">43-47</td></tr>
                      <tr class="bg-gray-50"><td class="border border-gray-300 px-4 py-2">XXL</td><td class="border border-gray-300 px-4 py-2">44-48</td><td class="border border-gray-300 px-4 py-2">37-41</td><td class="border border-gray-300 px-4 py-2">47-51</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Measurement Tips -->
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                <i data-lucide="info" class="w-5 h-5"></i>
                How to Measure
              </h3>
              <div class="space-y-3 text-gray-700">
                <p><strong>Foot Length:</strong> Stand on a piece of paper and mark the longest part of your foot. Measure from heel to toe.</p>
                <p><strong>Chest/Bust:</strong> Measure around the fullest part of your chest, keeping the tape parallel to the ground.</p>
                <p><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</p>
                <p><strong>Hips:</strong> Measure around the fullest part of your hips, approximately 8 inches below your waist.</p>
              </div>
            </div>
            
            <!-- Fit Tips -->
            <div class="bg-blue-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                <i data-lucide="lightbulb" class="w-5 h-5"></i>
                Fit Tips
              </h3>
              <ul class="space-y-2 text-gray-700">
                <li>• If you're between sizes, we recommend sizing up for a more comfortable fit</li>
                <li>• Different brands may fit differently - check product reviews for fit feedback</li>
                <li>• For performance footwear, consider going up half a size for added comfort during activity</li>
                <li>• Measure your feet in the evening when they're at their largest</li>
                <li>• Always measure both feet and use the larger measurement</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <p class="text-sm text-gray-600">Still have questions? <a href="#" onclick="navigateTo('contact'); closeSizeGuide(); closeProductModal(); return false;" class="text-black font-semibold hover:underline">Contact Us</a></p>
          <button onclick="closeSizeGuide()" class="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.innerHTML = modalHTML;
  modalContainer.classList.remove('hidden');
  
  // Disable body scroll
  disableBodyScroll();
  
  // Re-initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Add escape key listener
  window.sizeGuideKeyHandler = (e) => {
    if (e.key === 'Escape') {
      closeSizeGuide();
    }
  };
  document.addEventListener('keydown', window.sizeGuideKeyHandler);
}

function closeSizeGuide(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modalContainer = document.getElementById('legal-modal');
  if (modalContainer) {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  }
  
  // Re-enable body scroll
  enableBodyScroll();
  
  // Remove escape key listener
  if (window.sizeGuideKeyHandler) {
    document.removeEventListener('keydown', window.sizeGuideKeyHandler);
    window.sizeGuideKeyHandler = null;
  }
}

// ✅ FIX: Setup keyboard navigation properly
function setupModalKeyboardNavigation() {
  // Remove old listeners if they exist
  if (window.modalKeyboardHandler) {
    document.removeEventListener('keydown', window.modalKeyboardHandler);
  }
  
  // Create new handler
  window.modalKeyboardHandler = (e) => {
    if (!window.currentModalData) return;
    
    // Close modal on ESC
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeProductModal();
      return;
    }
    
    // Arrow key navigation
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      navigateRelatedImage(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      navigateRelatedImage(1);
    }
  };
  
  // Add listener
  document.addEventListener('keydown', window.modalKeyboardHandler);
  console.log('✅ Keyboard navigation setup');
}

// ✅ FIX: Remove keyboard listener when modal closes
function removeModalKeyboardNavigation() {
  if (window.modalKeyboardHandler) {
    document.removeEventListener('keydown', window.modalKeyboardHandler);
    window.modalKeyboardHandler = null;
    console.log('✅ Keyboard navigation removed');
  }
}

// ==================== SCROLL CONTROL ====================

function disableBodyScroll() {
  // Store current scroll position
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  window.scrollPosition = scrollY;
  
  // Add class to prevent scrolling
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.left = '0';
  document.body.style.right = '0';
}

function enableBodyScroll() {
  // Get stored scroll position
  const scrollY = window.scrollPosition || 0;
  
  // Remove scroll prevention
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.left = '';
  document.body.style.right = '';
  
  // Restore scroll position WITHOUT animation
  window.scrollTo({
    top: scrollY,
    behavior: 'instant'
  });
  
  // Clear stored position
  window.scrollPosition = 0;
}

// ==================== LEGAL MODALS ====================

function openModal(type) {
  const modalContainer = document.getElementById('legal-modal');
  if (!modalContainer) {
    console.error('Legal modal container not found');
    return;
  }
  
  let title, content;
  
  switch (type) {
    case 'privacy':
      title = 'Privacy Policy';
      content = `
        <div class="space-y-6">
          <p class="text-gray-700">Last updated: ${new Date().toLocaleDateString()}</p>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">1. Information We Collect</h3>
            <p class="text-gray-700">We collect information that you provide directly to us, including:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Name, email address, and phone number when you create an account or make inquiries</li>
              <li>Shipping address and payment information for order processing</li>
              <li>Product preferences and shopping history</li>
              <li>Communication preferences for marketing and newsletters</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">2. How We Use Your Information</h3>
            <p class="text-gray-700">We use the information we collect to:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about products, services, and promotions</li>
              <li>Improve our website and customer service</li>
              <li>Personalize your shopping experience</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">3. Information Sharing</h3>
            <p class="text-gray-700">We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Service providers who assist in operating our website and conducting our business</li>
              <li>Payment processors for secure transaction processing</li>
              <li>Shipping partners for order delivery</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">4. Data Security</h3>
            <p class="text-gray-700">We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">5. Your Rights</h3>
            <p class="text-gray-700">You have the right to:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">6. Cookies</h3>
            <p class="text-gray-700">We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">7. Contact Us</h3>
            <p class="text-gray-700">For questions about this Privacy Policy, please contact us at:</p>
            <p class="text-gray-700 ml-4">Email: nikkocapili.01@gmail.com<br>Phone: +63-930-287-3442</p>
          </div>
        </div>
      `;
      break;
      
    case 'terms':
      title = 'Terms of Use';
      content = `
        <div class="space-y-6">
          <p class="text-gray-700">Last updated: ${new Date().toLocaleDateString()}</p>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">1. Acceptance of Terms</h3>
            <p class="text-gray-700">By accessing and using KiksNiks website, you accept and agree to be bound by these Terms of Use and our Privacy Policy.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">2. Use of Website</h3>
            <p class="text-gray-700">You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the website.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">3. Product Information</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We strive to display products accurately, but actual colors may vary</li>
              <li>Product availability is subject to change without notice</li>
              <li>Prices are in Philippine Pesos (₱) and are subject to change</li>
              <li>We reserve the right to limit quantities</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">4. Orders and Payment</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>All orders are subject to acceptance and availability</li>
              <li>Payment must be received before order processing</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>Billing and shipping addresses must be accurate</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">5. Shipping and Delivery</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss passes to you upon delivery</li>
              <li>Free shipping on orders over ₱3,000</li>
              <li>International shipping may incur additional fees</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">6. Returns and Exchanges</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Items must be returned within 30 days of delivery</li>
              <li>Products must be unworn and in original packaging</li>
              <li>Proof of purchase required for all returns</li>
              <li>Refunds processed within 7-10 business days</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">7. Intellectual Property</h3>
            <p class="text-gray-700">All content on this website, including text, graphics, logos, and images, is the property of KiksNiks or its content suppliers and is protected by intellectual property laws.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">8. Limitation of Liability</h3>
            <p class="text-gray-700">KiksNiks shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or purchase of products.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">9. Modifications</h3>
            <p class="text-gray-700">We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of modified terms.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">10. Contact Information</h3>
            <p class="text-gray-700">For questions about these Terms of Use:</p>
            <p class="text-gray-700 ml-4">Email: nikkocapili.01@gmail.com<br>Phone: +63-930-287-3442<br>Address: La Paz, Tarlac, Philippines</p>
          </div>
        </div>
      `;
      break;
      
    case 'accessibility':
      title = 'Accessibility Statement';
      content = `
        <div class="space-y-6">
          <p class="text-gray-700">Last updated: ${new Date().toLocaleDateString()}</p>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Our Commitment</h3>
            <p class="text-gray-700">KiksNiks is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Conformance Status</h3>
            <p class="text-gray-700">We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Accessibility Features</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Keyboard Navigation:</strong> Full website functionality available via keyboard</li>
              <li><strong>Screen Reader Compatible:</strong> Semantic HTML and ARIA labels for assistive technologies</li>
              <li><strong>Text Alternatives:</strong> Alt text provided for all images</li>
              <li><strong>Color Contrast:</strong> Sufficient contrast ratios for text readability</li>
              <li><strong>Responsive Design:</strong> Compatible with various devices and screen sizes</li>
              <li><strong>Clear Navigation:</strong> Consistent and logical page structure</li>
              <li><strong>Focus Indicators:</strong> Visible focus states for interactive elements</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Browser Compatibility</h3>
            <p class="text-gray-700">Our website is designed to be compatible with the following assistive technologies:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Latest versions of Chrome, Firefox, Safari, and Edge</li>
              <li>JAWS, NVDA, and VoiceOver screen readers</li>
              <li>ZoomText and other screen magnifiers</li>
              <li>Speech recognition software</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Assistance</h3>
            <p class="text-gray-700">If you need assistance with:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Navigating our website</li>
              <li>Accessing content in an alternative format</li>
              <li>Product information and specifications</li>
              <li>Placing an order</li>
            </ul>
            <p class="text-gray-700 mt-4">Please contact us:</p>
            <p class="text-gray-700 ml-4">Email: nikkocapili.01@gmail.com<br>Phone: +63-930-287-3442<br>Hours: Monday-Saturday, 9:00 AM - 6:00 PM PHT</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Feedback</h3>
            <p class="text-gray-700">We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Email: nikkocapili.01@gmail.com with subject "Accessibility Feedback"</li>
              <li>We aim to respond within 2 business days</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Limitations and Alternatives</h3>
            <p class="text-gray-700">Despite our best efforts, some content may have accessibility limitations. We are committed to addressing these issues. If you encounter a problem, please contact us for an alternative accessible solution.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Assessment and Testing</h3>
            <p class="text-gray-700">KiksNiks assesses accessibility through:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Self-evaluation and internal testing</li>
              <li>Automated accessibility testing tools</li>
              <li>Manual testing with assistive technologies</li>
              <li>User feedback and reports</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Ongoing Improvements</h3>
            <p class="text-gray-700">We are continuously working to improve accessibility by:</p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Regular accessibility audits</li>
              <li>Training our team on accessibility best practices</li>
              <li>Incorporating user feedback</li>
              <li>Staying current with evolving standards and technologies</li>
            </ul>
          </div>
        </div>
      `;
      break;
      
    default:
      console.error('Unknown modal type:', type);
      return;
  }
  
  const modalHTML = `
    <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75" onclick="closeLegalModal(event)">
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold">${title}</h2>
          <button onclick="closeLegalModal()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="overflow-y-auto px-6 py-6" style="max-height: calc(90vh - 140px);">
          ${content}
        </div>
        
        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button onclick="closeLegalModal()" class="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.innerHTML = modalHTML;
  modalContainer.classList.remove('hidden');
  
  // Disable body scroll
  disableBodyScroll();
  
  // Re-initialize icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Add escape key listener
  window.legalModalKeyHandler = (e) => {
    if (e.key === 'Escape') {
      closeLegalModal();
    }
  };
  document.addEventListener('keydown', window.legalModalKeyHandler);
}

function closeLegalModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modalContainer = document.getElementById('legal-modal');
  if (modalContainer) {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  }
  
  // Re-enable body scroll
  enableBodyScroll();
  
  // Remove escape key listener
  if (window.legalModalKeyHandler) {
    document.removeEventListener('keydown', window.legalModalKeyHandler);
    window.legalModalKeyHandler = null;
  }
}
