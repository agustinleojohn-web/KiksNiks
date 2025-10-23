// Google Sheets Integration

/**
 * Fetch products from Google Sheets with proper error handling and retry logic
 */
async function fetchProducts(retryCount = 0, maxRetries = 3) {
  // Check if we should use mock data
  if (FEATURES.useMockData || !FEATURES.useGoogleSheets) {
    console.log('📦 Using mock data (feature flags: useMockData =', FEATURES.useMockData, ', useGoogleSheets =', FEATURES.useGoogleSheets + ')');
    return getMockProducts();
  }
  
  // Check if URL is configured
  if (!CONFIG.GOOGLE_SHEETS.productsUrl || CONFIG.GOOGLE_SHEETS.productsUrl.trim() === '' || CONFIG.GOOGLE_SHEETS.productsUrl.includes('YOUR_SCRIPT_ID')) {
    console.error('❌ Google Sheets URL not configured properly!');
    console.error('Current URL:', CONFIG.GOOGLE_SHEETS.productsUrl);
    console.log('💡 FALLBACK: Using mock data');
    return getMockProducts();
  }
  
  try {
    console.log('🌐 Fetching from Google Sheets...');
    console.log('   URL:', CONFIG.GOOGLE_SHEETS.productsUrl);
    console.log('   Features:', { useGoogleSheets: FEATURES.useGoogleSheets, useMockData: FEATURES.useMockData });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏰ Request timed out after 15s');
      controller.abort();
    }, 15000); // 15s timeout
    
    const response = await fetch(CONFIG.GOOGLE_SHEETS.productsUrl, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Response received!');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }
    
    const text = await response.text();
    console.log('📄 Response text length:', text.length);
    console.log('📄 First 300 chars:', text.substring(0, 300));
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON!');
      console.error('Full response:', text);
      throw new Error('Invalid JSON response from Google Sheets');
    }
    
    console.log('📦 Data received!');
    console.log('   Data type:', typeof data);
    console.log('   Is array:', Array.isArray(data));
    console.log('   Data keys:', Object.keys(data));
    console.log('   Full data structure:', JSON.stringify(data, null, 2).substring(0, 800));
    
    // Handle ALL possible response formats from Google Sheets
    let products = null;
    
    // Format 1: {success: true, data: [...]}
    if (data.success === true && data.data && Array.isArray(data.data)) {
      products = data.data;
      console.log('✅ Format 1: {success: true, data: [...]}');
    } 
    // Format 2: {products: [...]}
    else if (data.products && Array.isArray(data.products)) {
      products = data.products;
      console.log('✅ Format 2: {products: [...]}');
    } 
    // Format 3: Direct array [...]
    else if (Array.isArray(data)) {
      products = data;
      console.log('✅ Format 3: Direct array');
    }
    // Format 4: {success: false, error: "..."}
    else if (data.success === false) {
      console.error('❌ Google Sheets returned error:', data.error);
      throw new Error(data.error || 'Google Sheets returned an error');
    }
    // Format 5: Check for ANY array property
    else {
      for (let key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          products = data[key];
          console.log(`✅ Found array in property: ${key}`);
          break;
        }
      }
    }
    
    if (!products || products.length === 0) {
      console.error('❌ No products found in ANY format!');
      console.error('Full response:', JSON.stringify(data, null, 2));
      throw new Error('No products found in response - check Google Apps Script');
    }
    
    console.log('✅ Successfully loaded', products.length, 'products from Google Sheets');
    console.log('   Sample product:', products[0]);
    return products;
    
  } catch (error) {
    console.error('❌ Error fetching from Google Sheets (Attempt ' + (retryCount + 1) + '/' + maxRetries + '):');
    console.error('   Error:', error.message);
    console.error('   URL:', CONFIG.GOOGLE_SHEETS.productsUrl);
    
    // Retry logic
    if (retryCount < maxRetries - 1) {
      const delay = (retryCount + 1) * 1000; // Exponential backoff: 1s, 2s, 3s
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchProducts(retryCount + 1, maxRetries);
    }
    
    console.log('📦 All retries failed. Falling back to mock data');
    showToast('Could not connect to Google Sheets. Using demo products.', 'error');
    return getMockProducts();
  }
}

/**
 * Submit contact form to Google Sheets
 */
async function submitContactForm(formData) {
  if (!FEATURES.useGoogleSheets) {
    console.log('📝 Contact form submitted (mock mode):', formData);
    return { success: true };
  }
  
  console.log('📧 Submitting contact form to Google Sheets...');
  
  try {
    const payload = {
      action: 'submitContact',
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      subject: formData.subject,
      message: formData.message
    };
    
    console.log('Payload:', payload);
    
    // IMPORTANT: mode: 'no-cors' is required for Google Apps Script POST requests
    const response = await fetch(CONFIG.GOOGLE_SHEETS.productsUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Note: no-cors means we can't read the response, but the request will go through
    console.log('✅ Contact form submitted successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit newsletter subscription to Google Sheets
 */
async function submitNewsletter(email) {
  if (!FEATURES.useGoogleSheets) {
    console.log('📬 Newsletter subscription submitted (mock mode):', email);
    return { success: true };
  }
  
  console.log('📬 Submitting newsletter subscription to Google Sheets...');
  
  try {
    const payload = {
      action: 'submitNewsletter',
      email: email
    };
    
    console.log('Payload:', payload);
    
    // IMPORTANT: mode: 'no-cors' is required for Google Apps Script POST requests
    const response = await fetch(CONFIG.GOOGLE_SHEETS.productsUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Note: no-cors means we can't read the response, but the request will go through
    console.log('✅ Newsletter subscription submitted successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error submitting newsletter:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit cart inquiry to Google Sheets
 */
async function submitCartInquiry(items, customerInfo) {
  if (!FEATURES.useGoogleSheets) {
    console.log('📝 Cart inquiry submitted (mock mode)');
    return { success: true };
  }
  
  console.log('📧 Submitting cart inquiry to Google Sheets...');
  
  try {
    const payload = {
      action: 'submitCartInquiry',
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone || '',
      message: customerInfo.message || '',
      cartItems: items.map(item => ({
        name: item.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      })),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    
    console.log('Payload:', payload);
    
    // IMPORTANT: mode: 'no-cors' is required for Google Apps Script POST requests
    const response = await fetch(CONFIG.GOOGLE_SHEETS.productsUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Note: no-cors means we can't read the response, but the request will go through
    console.log('✅ Cart inquiry submitted successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error submitting cart inquiry:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate mock products - WITH VARIATIONS (same name = variations)
 * Each variation has its own related images (different angles)
 */
function getMockProducts() {
  const products = [];
  const baseProducts = [
    { name: 'Air Max 90', brand: 'Nike', category: 'Shoes', subcategory: 'Running' },
    { name: 'Air Force 1', brand: 'Nike', category: 'Shoes', subcategory: 'Casual' },
    { name: 'Ultraboost 22', brand: 'Adidas', category: 'Shoes', subcategory: 'Running' },
    { name: 'Suede Classic', brand: 'Puma', category: 'Shoes', subcategory: 'Lifestyle' },
    { name: '574 Core', brand: 'New Balance', category: 'Shoes', subcategory: 'Casual' },
    { name: 'Chuck Taylor', brand: 'Converse', category: 'Shoes', subcategory: 'Casual' },
    { name: 'Old Skool', brand: 'Vans', category: 'Shoes', subcategory: 'Lifestyle' },
    { name: 'LeBron 20', brand: 'Nike', category: 'Shoes', subcategory: 'Basketball' },
    { name: 'Metcon 8', brand: 'Nike', category: 'Shoes', subcategory: 'Training' },
    { name: 'Tech Fleece Hoodie', brand: 'Nike', category: 'Apparel', subcategory: 'Hoodies' },
    { name: 'Training Jacket', brand: 'Adidas', category: 'Apparel', subcategory: 'Jackets' },
    { name: 'Running Shorts', brand: 'Puma', category: 'Apparel', subcategory: 'Shorts' },
    { name: 'Sports Bra', brand: 'Nike', category: 'Apparel', subcategory: 'Sports Bras' },
    { name: 'Yoga Leggings', brand: 'Adidas', category: 'Apparel', subcategory: 'Leggings' },
    { name: 'Training T-Shirt', brand: 'Puma', category: 'Apparel', subcategory: 'Tops' },
    { name: 'Backpack Elite', brand: 'Nike', category: 'Accessories', subcategory: 'Bags' },
    { name: 'Sport Socks', brand: 'Adidas', category: 'Accessories', subcategory: 'Socks' },
  ];
  
  const colors = ['Black', 'White', 'Red', 'Blue', 'Navy', 'Gray'];
  const colourDescriptions = {
    'Black': 'Black/Black/Black',
    'White': 'White/White/White',
    'Red': 'University Red/White/Black',
    'Blue': 'Royal Blue/White/Black',
    'Navy': 'Midnight Navy/White/Grey',
    'Gray': 'Wolf Grey/White/Black'
  };
  const genders = ['Men', 'Women', 'Unisex'];
  const origins = ['Vietnam', 'China', 'Indonesia', 'Thailand'];
  
  const shoeImages = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800'
  ];
  
  let idCounter = 1;
  
  // Create color variations for each base product
  baseProducts.forEach(base => {
    colors.forEach(color => {
      const isShoe = base.category === 'Shoes';
      const hasDiscount = Math.random() > 0.7;
      const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
      const originalPrice = Math.floor(Math.random() * 5000) + 3000;
      const price = hasDiscount ? Math.floor(originalPrice * (1 - discount / 100)) : originalPrice;
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const origin = origins[Math.floor(Math.random() * origins.length)];
      
      // Generate style code (like Nike)
      const styleCode = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 900) + 100}`;
      
      // Generate related images (different angles)
      const mainImage = shoeImages[Math.floor(Math.random() * shoeImages.length)];
      const relatedImages = [];
      for (let j = 0; j < 5; j++) {
        relatedImages.push(shoeImages[Math.floor(Math.random() * shoeImages.length)]);
      }
      
      const description = `Experience premium quality with the ${base.name}. Designed for ${gender.toLowerCase()} who demand both style and performance. Features advanced materials and innovative design for all-day comfort.`;
      
      // ✅ Generate date (recent products within last 90 days)
      const daysAgo = Math.floor(Math.random() * 90);
      const dateAdded = new Date();
      dateAdded.setDate(dateAdded.getDate() - daysAgo);
      const dateStr = dateAdded.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const isNewProduct = daysAgo <= 30; // New if added within last 30 days
      const isFeaturedProduct = Math.random() > 0.85; // 15% featured
      const isBestSellerProduct = Math.random() > 0.80; // 20% best sellers
      
      products.push({
        id: `PROD-${String(idCounter).padStart(4, '0')}`,
        name: base.name, // Same name = variations!
        brand: base.brand,
        category: base.category,
        subcategory: base.subcategory,
        gender: gender,
        price: price,
        originalPrice: hasDiscount ? originalPrice : null,
        discount: hasDiscount ? discount : null,
        color: color,
        sizes: isShoe ? ['7', '8', '9', '10', '11', '12'] : ['S', 'M', 'L', 'XL', 'XXL'],
        image: mainImage,
        images: relatedImages, // ✅ Keep as array (not joined string)
        colourShown: colourDescriptions[color],
        style: styleCode,
        origin: origin,
        description: description,
        isNew: isNewProduct,           // ✅ Boolean (not string)
        isFeatured: isFeaturedProduct,  // ✅ Boolean
        isBestSeller: isBestSellerProduct, // ✅ Boolean
        dateAdded: dateStr,             // ✅ YYYY-MM-DD format
        stock: Math.floor(Math.random() * 50) + 10  // ✅ Number
      });
      
      idCounter++;
    });
  });

  console.log('✅ Generated', products.length, 'mock products');
  return products;
}
