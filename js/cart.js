// Shopping Cart Management

class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.updateCartCount();
  }

  loadCart() {
    return Storage.get(CONFIG.STORAGE_KEYS.cart) || [];
  }

  saveCart() {
    Storage.set(CONFIG.STORAGE_KEYS.cart, this.items);
    this.updateCartCount();
  }

  addItem(product, size = null, showToastNotification = true) {
    const itemId = `${product.id}-${size || 'default'}`;
    const existingItem = this.items.find(item => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: itemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        color: product.color,
        category: product.category,
        quantity: 1
      });
    }

    this.saveCart();
    
    // ✅ Only show toast if requested (prevent spam when adding multiple items)
    if (showToastNotification) {
      showToast(`${product.name} ${size ? `(${size})` : ''} added`, 'success');
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
    this.renderCart();
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.renderCart();
      }
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.renderCart();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCartCount() {
    const countElement = document.getElementById('cart-count');
    const count = this.getItemCount();
    
    if (count > 0) {
      countElement.textContent = count;
      countElement.classList.remove('hidden');
      countElement.classList.add('flex');
    } else {
      countElement.classList.add('hidden');
      countElement.classList.remove('flex');
    }
  }

  renderCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const cartContent = sidebar.querySelector('.bg-white');
    
    if (this.items.length === 0) {
      cartContent.innerHTML = `
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <h2 class="text-xl font-bold">Shopping Cart (0)</h2>
          </div>
          <button onclick="closeCart()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        
        <div class="flex-1 flex flex-col items-center justify-center text-center px-6">
          <i data-lucide="shopping-bag" class="w-16 h-16 text-gray-300 mb-4"></i>
          <p class="text-gray-600 font-medium mb-2">Your cart is empty</p>
          <p class="text-sm text-gray-500">Add items to get started</p>
        </div>
      `;
    } else {
      const itemsHTML = this.items.map(item => `
        <div class="flex gap-4 pb-4 border-b border-gray-200">
          <img src="${item.image}" alt="${sanitizeHTML(item.name)}" class="w-24 h-24 object-cover rounded-lg">
          <div class="flex-1">
            <h3 class="text-sm font-medium mb-1 line-clamp-2">${sanitizeHTML(item.name)}</h3>
            ${item.size ? `<p class="text-xs text-gray-600">Size: ${item.size}</p>` : ''}
            ${item.color ? `<p class="text-xs text-gray-600">Color: ${item.color}</p>` : ''}
            <p class="mt-2 font-medium">${formatCurrency(item.price)}</p>
            
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-2 border border-gray-300 rounded-full">
                <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <i data-lucide="minus" class="w-3 h-3"></i>
                </button>
                <span class="text-sm w-8 text-center font-medium">${item.quantity}</span>
                <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <i data-lucide="plus" class="w-3 h-3"></i>
                </button>
              </div>
              
              <button onclick="cart.removeItem('${item.id}')" class="text-red-600 hover:text-red-700 transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');

      cartContent.innerHTML = `
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <h2 class="text-xl font-bold">Shopping Cart (${this.getItemCount()})</h2>
          </div>
          <button onclick="closeCart()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div id="cart-items-list" class="space-y-4">
            ${itemsHTML}
          </div>
        </div>
        
        <div class="border-t border-gray-200 px-6 py-4 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">Subtotal</span>
            <span class="text-2xl font-bold">${formatCurrency(this.getTotal())}</span>
          </div>
          
          <p class="text-xs text-gray-600">Shipping and taxes calculated at quotation</p>

          <button onclick="showCheckout()" class="w-full bg-black text-white py-4 rounded-full hover:bg-gray-900 transition-colors font-medium">
            Proceed to Inquiry
          </button>
          
          <button onclick="if(confirm('Clear all items from cart?')) cart.clearCart()" class="w-full py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium">
            Clear Cart
          </button>
        </div>
      `;
    }
    
    lucide.createIcons();
  }
}

// Initialize cart
const cart = new ShoppingCart();

/**
 * Open cart sidebar
 */
function openCart() {
  const sidebar = document.getElementById('cart-sidebar');
  sidebar.classList.remove('hidden');
  cart.renderCart();
  document.body.style.overflow = 'hidden';
}

/**
 * Close cart sidebar
 */
function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  sidebar.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Show checkout form
 */
function showCheckout() {
  const sidebar = document.getElementById('cart-sidebar');
  const cartContent = sidebar.querySelector('.bg-white');
  
  cartContent.innerHTML = `
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <i data-lucide="shopping-bag" class="w-5 h-5"></i>
        <h2 class="text-xl font-bold">Customer Information</h2>
      </div>
      <button onclick="closeCart()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>
    
    <div class="flex-1 overflow-y-auto px-6 py-4">
      <form id="checkout-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">
            Full Name <span class="text-red-600">*</span>
          </label>
          <input type="text" id="checkout-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="John Doe">
          <div class="error-message hidden" id="error-name"></div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            Email Address <span class="text-red-600">*</span>
          </label>
          <input type="email" id="checkout-email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="john@example.com">
          <div class="error-message hidden" id="error-email"></div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            Phone Number <span class="text-red-600">*</span>
          </label>
          <input type="tel" id="checkout-phone" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="+63 912 345 6789">
          <div class="error-message hidden" id="error-phone"></div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            Additional Message
          </label>
          <textarea id="checkout-message" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none" rows="3" placeholder="Any special requests or questions..."></textarea>
        </div>
      </form>
    </div>
    
    <div class="border-t border-gray-200 px-6 py-4 space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-lg font-medium">Total</span>
        <span class="text-2xl font-bold">${formatCurrency(cart.getTotal())}</span>
      </div>
      
      <button onclick="submitCheckout()" class="w-full bg-black text-white py-4 rounded-full hover:bg-gray-900 transition-colors font-medium">
        Submit Inquiry
      </button>
      
      <button onclick="cart.renderCart()" class="w-full py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium">
        Back to Cart
      </button>
    </div>
  `;
  
  lucide.createIcons();
}

/**
 * Submit checkout inquiry
 */
async function submitCheckout() {
  const name = document.getElementById('checkout-name').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const message = document.getElementById('checkout-message').value.trim();
  
  // Reset errors
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.add('hidden');
    el.textContent = '';
  });
  
  document.querySelectorAll('#checkout-form input, #checkout-form textarea').forEach(el => {
    el.classList.remove('error');
  });
  
  // Validate
  let hasError = false;
  
  if (!name || name.length < 2) {
    document.getElementById('error-name').textContent = 'Name must be at least 2 characters';
    document.getElementById('error-name').classList.remove('hidden');
    document.getElementById('checkout-name').classList.add('error');
    hasError = true;
  }
  
  if (!email || !validateEmail(email)) {
    document.getElementById('error-email').textContent = 'Please enter a valid email address';
    document.getElementById('error-email').classList.remove('hidden');
    document.getElementById('checkout-email').classList.add('error');
    hasError = true;
  }
  
  if (!phone || !validatePhone(phone)) {
    document.getElementById('error-phone').textContent = 'Please enter a valid phone number';
    document.getElementById('error-phone').classList.remove('hidden');
    document.getElementById('checkout-phone').classList.add('error');
    hasError = true;
  }
  
  if (hasError) {
    showToast('Please correct the errors in the form', 'error');
    return;
  }
  
  // Show loading
  const submitBtn = event.target;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="spinner mx-auto" style="width: 20px; height: 20px; border-width: 2px;"></div>';
  
  try {
    await submitCartInquiry(cart.items, { name, email, phone, message });
    
    showToast('Inquiry sent successfully!', 'success', 'Check your email for confirmation.');
    cart.clearCart();
    closeCart();
  } catch (error) {
    showToast('Failed to send inquiry', 'error', 'Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Inquiry';
  }
}
