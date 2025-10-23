// ==================== INFORMATION MODALS ====================
// Our Story, Shipping Info, Returns & Exchanges, FAQ

function openInfoModal(type) {
  const modalContainer = document.getElementById('legal-modal');
  if (!modalContainer) {
    console.error('Legal modal container not found');
    return;
  }
  
  let title, content;
  
  switch (type) {
    case 'story':
      title = 'Our Story';
      content = `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
            <h3 class="text-3xl font-bold mb-4">Welcome to KiksNiks</h3>
            <p class="text-lg text-gray-700 leading-relaxed">
              Where passion for authentic athletic footwear meets uncompromising quality and trust.
            </p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="heart" class="w-6 h-6 text-red-500"></i>
              Our Mission
            </h3>
            <p class="text-gray-700 leading-relaxed">
              At KiksNiks, we believe everyone deserves access to genuine, high-quality athletic footwear and apparel without the worry of counterfeits. Our mission is simple: to provide 100% authentic products from top brands while building lasting relationships with our customers based on trust and transparency.
            </p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="award" class="w-6 h-6 text-yellow-500"></i>
              100% Authenticity Guaranteed
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Every single product we sell is <strong>guaranteed authentic</strong>. We work directly with authorized distributors and maintain strict quality control measures. If any item is proven to be fake, we offer a <strong>full money-back guarantee</strong> - no questions asked.
            </p>
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p class="text-gray-700 font-semibold">
                💯 <strong>Our Promise:</strong> All items are genuine, original, and come with proper documentation.
              </p>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="users" class="w-6 h-6 text-blue-500"></i>
              Who We Are
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Founded in the Philippines, KiksNiks started from a simple passion: helping athletes and sneaker enthusiasts find the perfect pair. What began as a small operation has grown into a trusted name in authentic athletic footwear, serving thousands of satisfied customers across the country.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Our team consists of sneaker enthusiasts, athletes, and customer service experts who understand what you're looking for. We're not just here to sell shoes - we're here to help you find the perfect match for your lifestyle.
            </p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="target" class="w-6 h-6 text-green-500"></i>
              What Makes Us Different
            </h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong class="text-gray-900">Authenticity Verification:</strong>
                  <span class="text-gray-700"> Every product is verified and comes with proof of authenticity</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong class="text-gray-900">Transparent Pricing:</strong>
                  <span class="text-gray-700"> No hidden fees, fair prices, and regular promotions</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong class="text-gray-900">Expert Customer Service:</strong>
                  <span class="text-gray-700"> Our team is always ready to help you find the perfect fit</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong class="text-gray-900">Fast & Secure Delivery:</strong>
                  <span class="text-gray-700"> Reliable shipping with tracking and insurance</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong class="text-gray-900">Hassle-Free Returns:</strong>
                  <span class="text-gray-700"> 30-day return policy with full refund if not satisfied</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="shield-check" class="w-6 h-6 text-purple-500"></i>
              Our Commitment to You
            </h3>
            <p class="text-gray-700 leading-relaxed">
              We understand that buying online requires trust. That's why we've built our entire business around transparency and customer satisfaction. When you shop with KiksNiks, you're not just getting authentic products - you're getting peace of mind.
            </p>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <p class="text-gray-800 font-semibold text-center text-lg">
                "Your satisfaction is our success. Every customer is family."
              </p>
              <p class="text-gray-600 text-center mt-2">- The KiksNiks Team</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="phone" class="w-6 h-6 text-blue-500"></i>
              Get in Touch
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Have questions? Want to learn more about a specific product? Our team is always here to help.
            </p>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold text-gray-900 mb-2">📧 Email</p>
                <p class="text-gray-700">nikkocapili.01@gmail.com</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold text-gray-900 mb-2">📞 Phone</p>
                <p class="text-gray-700">+63-930-287-3442</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold text-gray-900 mb-2">📍 Location</p>
                <p class="text-gray-700">La Paz, Tarlac, Philippines</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold text-gray-900 mb-2">⏰ Hours</p>
                <p class="text-gray-700">Mon-Sat: 9AM - 6PM PHT</p>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'shipping':
      title = 'Shipping Information';
      content = `
        <div class="space-y-6">
          <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <p class="text-lg font-semibold text-gray-900">🚚 Free Shipping on Orders Over ₱3,000!</p>
            <p class="text-gray-700 mt-2">Get your authentic footwear delivered right to your doorstep with our reliable shipping service.</p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="truck" class="w-6 h-6"></i>
              Shipping Options
            </h3>
            
            <div class="grid gap-4">
              <div class="border border-gray-200 rounded-lg p-5 hover:border-black transition-colors">
                <div class="flex items-start justify-between mb-3">
                  <h4 class="text-lg font-semibold">Standard Shipping</h4>
                  <span class="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">₱150</span>
                </div>
                <ul class="space-y-2 text-gray-700">
                  <li>• Delivery: 4-5 business days</li>
                  <li>• <strong>FREE</strong> for orders over ₱3,000</li>
                  <li>• Available nationwide</li>
                  <li>• Tracking number provided</li>
                </ul>
              </div>
              
              <div class="border border-gray-200 rounded-lg p-5 hover:border-black transition-colors">
                <div class="flex items-start justify-between mb-3">
                  <h4 class="text-lg font-semibold">Express Shipping</h4>
                  <span class="bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">₱300</span>
                </div>
                <ul class="space-y-2 text-gray-700">
                  <li>• Delivery: 2-3 business days</li>
                  <li>• Priority handling</li>
                  <li>• Metro Manila & major cities</li>
                  <li>• Real-time tracking</li>
                </ul>
              </div>
              
              <div class="border border-gray-200 rounded-lg p-5 hover:border-black transition-colors">
                <div class="flex items-start justify-between mb-3">
                  <h4 class="text-lg font-semibold">Same-Day Delivery</h4>
                  <span class="bg-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">₱500</span>
                </div>
                <ul class="space-y-2 text-gray-700">
                  <li>• Delivery: Same day (if ordered before 12 PM)</li>
                  <li>• Metro Manila only</li>
                  <li>• Premium service</li>
                  <li>• Direct contact with rider</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="map-pin" class="w-6 h-6"></i>
              Shipping Coverage
            </h3>
            <p class="text-gray-700 leading-relaxed">We ship to all provinces and cities across the Philippines, including:</p>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold mb-2">Luzon</p>
                <p class="text-sm text-gray-600">Metro Manila, Cavite, Laguna, Bulacan, Pampanga, Batangas, and more</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold mb-2">Visayas</p>
                <p class="text-sm text-gray-600">Cebu, Iloilo, Bacolod, Tacloban, Dumaguete, and more</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold mb-2">Mindanao</p>
                <p class="text-sm text-gray-600">Davao, Cagayan de Oro, General Santos, Zamboanga, and more</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="package" class="w-6 h-6"></i>
              Order Processing
            </h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong>Order Confirmation:</strong> You'll receive an email confirmation immediately after placing your order
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong>Processing Time:</strong> Orders are processed within 24 hours (excluding weekends and holidays)
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong>Shipping Notification:</strong> You'll receive tracking information once your order ships
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <strong>Delivery Updates:</strong> Track your order in real-time through our partner courier
                </div>
              </li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="shield" class="w-6 h-6"></i>
              Packaging & Insurance
            </h3>
            <p class="text-gray-700 leading-relaxed">
              All orders are carefully packaged to ensure your items arrive in perfect condition:
            </p>
            <ul class="space-y-2 text-gray-700 ml-4">
              <li>• Double-boxed for extra protection</li>
              <li>• Bubble wrap for fragile items</li>
              <li>• Water-resistant outer packaging</li>
              <li>• All shipments are insured</li>
              <li>• Photo documentation before shipping</li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <i data-lucide="alert-circle" class="w-5 h-5"></i>
              Important Notes
            </h4>
            <ul class="space-y-2 text-gray-700 text-sm">
              <li>• Orders are processed Monday-Friday (excluding public holidays)</li>
              <li>• Delivery times are estimates and may vary due to weather or unforeseen circumstances</li>
              <li>• Ensure someone is available to receive the package</li>
              <li>• Please inspect your package upon delivery before signing</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold">Questions?</h3>
            <p class="text-gray-700">
              Need help with shipping? Contact our customer service team:
            </p>
            <div class="flex gap-4">
              <button onclick="navigateTo('contact'); closeInfoModal();" class="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'returns':
      title = 'Returns & Exchanges';
      content = `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 class="text-2xl font-bold mb-3">30-Day Money-Back Guarantee</h3>
            <p class="text-lg text-gray-700">
              Not satisfied? We offer hassle-free returns and exchanges within 30 days of delivery. 
              <strong class="text-red-600">If any item is proven fake, we offer a FULL REFUND - no questions asked!</strong>
            </p>
          </div>
          
          <div class="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
            <h4 class="font-bold text-gray-900 mb-2 flex items-center gap-2 text-lg">
              <i data-lucide="shield-alert" class="w-6 h-6 text-red-600"></i>
              100% Authenticity Guarantee
            </h4>
            <p class="text-gray-700 leading-relaxed">
              At KiksNiks, we stand behind every product we sell. All items are <strong>guaranteed authentic and original</strong>. 
              If any product is proven to be counterfeit or fake through verification by an authorized retailer or authentication service, 
              we will provide a <strong>full refund including shipping costs</strong> - absolutely no questions asked. Your trust is our priority.
            </p>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="rotate-ccw" class="w-6 h-6"></i>
              Return Policy
            </h3>
            
            <div class="border border-gray-200 rounded-lg p-5">
              <h4 class="font-semibold text-lg mb-3">Eligible for Return:</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start gap-2">
                  <i data-lucide="check" class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>Items returned within 30 days of delivery</span>
                </li>
                <li class="flex items-start gap-2">
                  <i data-lucide="check" class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>Unworn, unwashed, and in original condition</span>
                </li>
                <li class="flex items-start gap-2">
                  <i data-lucide="check" class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>Original packaging and tags attached</span>
                </li>
                <li class="flex items-start gap-2">
                  <i data-lucide="check" class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>Proof of purchase (order number or receipt)</span>
                </li>
                <li class="flex items-start gap-2">
                  <i data-lucide="check" class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"></i>
                  <span>No signs of wear, dirt, or damage</span>
                </li>
              </ul>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
              <h4 class="font-semibold text-lg mb-3">Not Eligible for Return:</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start gap-2">
                  <i data-lucide="x" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"></i>
                  <span>Items without original packaging or tags</span>
                </li>
                <li class="flex items-start gap-2">
                  <i data-lucide="x" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"></i>
                  <span>Worn, washed, or used items</span>
                </li>
                <li class="flex items-start gap-2">
                  <i data-lucide="x" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"></i>
                  <span>Sale or clearance items (unless defective)</span>
                </li>
                <li class="flex items-start gap-2">
                  <i data-lucide="x" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"></i>
                  <span>Items damaged due to misuse or negligence</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="repeat" class="w-6 h-6"></i>
              Exchange Policy
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Need a different size or color? We offer free exchanges within 30 days!
            </p>
            <div class="bg-blue-50 p-5 rounded-lg">
              <ul class="space-y-2 text-gray-700">
                <li>• Free size and color exchanges</li>
                <li>• Exchange shipping is FREE (we pay for it!)</li>
                <li>• Same product exchanges only</li>
                <li>• Subject to stock availability</li>
              </ul>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="list-checks" class="w-6 h-6"></i>
              How to Return or Exchange
            </h3>
            
            <div class="space-y-3">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Contact Us</h4>
                  <p class="text-gray-700">Email us at nikkocapili.01@gmail.com or call +63-930-287-3442 with your order number</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Get Return Authorization</h4>
                  <p class="text-gray-700">We'll review your request and provide a return authorization number (RMA)</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Pack Your Item</h4>
                  <p class="text-gray-700">Securely pack the item with all original packaging, tags, and accessories</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Ship It Back</h4>
                  <p class="text-gray-700">Use the prepaid shipping label we provide (for exchanges) or your preferred courier (for returns)</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Get Your Refund or Exchange</h4>
                  <p class="text-gray-700">Refunds processed within 7-10 business days after we receive your return</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold flex items-center gap-2">
              <i data-lucide="clock" class="w-6 h-6"></i>
              Refund Processing
            </h3>
            <div class="space-y-3 text-gray-700">
              <p><strong>Standard Refunds:</strong> 7-10 business days after item is received and inspected</p>
              <p><strong>Refund Method:</strong> Original payment method or bank transfer</p>
              <p><strong>Shipping Costs:</strong> Original shipping fee is non-refundable (except for defective items or our error)</p>
            </div>
          </div>
          
          <div class="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h4 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <i data-lucide="thumbs-up" class="w-5 h-5"></i>
              Defective or Wrong Items
            </h4>
            <p class="text-gray-700 mb-3">
              Received a defective or wrong item? We'll make it right immediately!
            </p>
            <ul class="space-y-2 text-gray-700">
              <li>• Full refund including shipping costs</li>
              <li>• Free return shipping (we pay for it)</li>
              <li>• Fast processing (within 3 business days)</li>
              <li>• Option for immediate replacement</li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-bold">Questions About Returns?</h3>
            <p class="text-gray-700">
              Our customer service team is here to help make your return or exchange as smooth as possible.
            </p>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold text-gray-900 mb-2">📧 Email</p>
                <p class="text-gray-700 text-sm">nikkocapili.01@gmail.com</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-semibold text-gray-900 mb-2">📞 Phone</p>
                <p class="text-gray-700 text-sm">+63-930-287-3442</p>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'faq':
      title = 'Frequently Asked Questions';
      content = `
        <div class="space-y-6">
          <!-- Search Box -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 class="text-2xl font-bold mb-3">How can we help you?</h3>
            <input 
              type="text" 
              id="faq-search" 
              placeholder="Search for answers..." 
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 outline-none"
              onkeyup="filterFAQ(this.value)"
            />
          </div>
          
          <div id="faq-list" class="space-y-4">
            <!-- Ordering -->
            <div class="faq-category">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                Ordering
              </h3>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">How do I place an order?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>Placing an order is easy! Simply browse our products, select your desired item, choose your size and color, then click "Add to Bag". Once you're ready, proceed to checkout, fill in your shipping information, and complete payment. You'll receive an order confirmation email immediately.</p>
                </div>
              </div>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">What payment methods do you accept?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>We accept various payment methods including:</p>
                  <ul class="list-disc ml-5 mt-2 space-y-1">
                    <li>Credit/Debit Cards (Visa, Mastercard, AMEX)</li>
                    <li>GCash and PayMaya</li>
                    <li>Bank Transfer</li>
                    <li>Cash on Delivery (COD) for Metro Manila</li>
                  </ul>
                </div>
              </div>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">Can I modify or cancel my order?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>You can modify or cancel your order within 2 hours of placing it by contacting our customer service immediately. Once the order has been processed and shipped, modifications are no longer possible. However, you can still return the item within 30 days of delivery.</p>
                </div>
              </div>
            </div>
            
            <!-- Authenticity -->
            <div class="faq-category">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
                Product Authenticity
              </h3>
              
              <div class="faq-item border border-gray-200 rounded-lg bg-red-50">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-red-100 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">Are all your products 100% authentic?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p class="font-semibold text-red-600 mb-2">YES! Absolutely 100% authentic and original!</p>
                  <p>Every single product we sell is guaranteed authentic. We work directly with authorized distributors and maintain strict quality control. All items come with proper documentation and can be verified. If any item is proven fake, we offer a FULL REFUND with no questions asked - including all shipping costs.</p>
                </div>
              </div>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">How can I verify authenticity?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>We provide proof of authenticity with every purchase:</p>
                  <ul class="list-disc ml-5 mt-2 space-y-1">
                    <li>Official receipt from authorized retailer</li>
                    <li>Original box and packaging with proper labels</li>
                    <li>Authentication tags and holograms (where applicable)</li>
                    <li>Detailed product photos before shipping</li>
                  </ul>
                  <p class="mt-2">You can also have the product authenticated by any authorized retailer or professional authentication service.</p>
                </div>
              </div>
            </div>
            
            <!-- Shipping -->
            <div class="faq-category">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="truck" class="w-6 h-6"></i>
                Shipping & Delivery
              </h3>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">How long will it take to receive my order?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>Delivery times depend on your chosen shipping method:</p>
                  <ul class="list-disc ml-5 mt-2 space-y-1">
                    <li><strong>Standard:</strong> 4-5 business days</li>
                    <li><strong>Express:</strong> 2-3 business days</li>
                    <li><strong>Same-Day:</strong> Same day (Metro Manila, order before 12 PM)</li>
                  </ul>
                  <p class="mt-2">Processing time is 24 hours (excluding weekends and holidays).</p>
                </div>
              </div>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">Do you offer free shipping?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>Yes! We offer <strong>FREE standard shipping on all orders over ₱3,000</strong>. For orders under ₱3,000, standard shipping is ₱150.</p>
                </div>
              </div>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">Can I track my order?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>Yes! Once your order ships, you'll receive a tracking number via email. You can use this to track your package in real-time through our courier partner's website.</p>
                </div>
              </div>
            </div>
            
            <!-- Returns & Exchanges -->
            <div class="faq-category">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="rotate-ccw" class="w-6 h-6"></i>
                Returns & Exchanges
              </h3>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">What is your return policy?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>We offer a 30-day return policy. Items must be unworn, unwashed, in original condition with tags attached. Full refund will be processed within 7-10 business days after we receive and inspect the return.</p>
                </div>
              </div>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">Can I exchange for a different size?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>Yes! We offer FREE size exchanges within 30 days. Simply contact us with your order number, and we'll arrange the exchange. Exchange shipping is completely FREE - we pay for it!</p>
                </div>
              </div>
            </div>
            
            <!-- Sizing -->
            <div class="faq-category">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="ruler" class="w-6 h-6"></i>
                Sizing & Fit
              </h3>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">How do I find my correct size?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>Use our comprehensive <button onclick="showSizeGuide(); closeInfoModal();" class="text-blue-600 hover:underline font-semibold">Size Guide</button> which includes measurements for shoes and apparel in US, UK, and EU sizes. If you're between sizes, we recommend sizing up for a more comfortable fit.</p>
                </div>
              </div>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">Do shoes fit true to size?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>Most of our shoes fit true to size, but sizing can vary slightly between brands. Check the product description for specific fit notes, or contact us for personalized sizing advice.</p>
                </div>
              </div>
            </div>
            
            <!-- Customer Service -->
            <div class="faq-category">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="headphones" class="w-6 h-6"></i>
                Customer Service
              </h3>
              
              <div class="faq-item border border-gray-200 rounded-lg">
                <button class="faq-question w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors" onclick="toggleFAQ(this)">
                  <span class="font-semibold pr-4">How can I contact customer service?</span>
                  <i data-lucide="plus" class="w-5 h-5 flex-shrink-0 faq-icon"></i>
                </button>
                <div class="faq-answer hidden p-5 pt-0 text-gray-700">
                  <p>You can reach us through:</p>
                  <ul class="list-disc ml-5 mt-2 space-y-1">
                    <li>Email: nikkocapili.01@gmail.com</li>
                    <li>Phone: +63-930-287-3442</li>
                    <li>Contact Form on our website</li>
                  </ul>
                  <p class="mt-2">Our team is available Monday-Saturday, 9AM-6PM PHT. We aim to respond to all inquiries within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-6 rounded-lg text-center">
            <h4 class="font-bold text-gray-900 mb-2">Still have questions?</h4>
            <p class="text-gray-700 mb-4">Our customer service team is here to help!</p>
            <button onclick="navigateTo('contact'); closeInfoModal();" class="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
              Contact Us
            </button>
          </div>
        </div>
      `;
      break;
      
    default:
      console.error('Unknown modal type:', type);
      return;
  }
  
  const modalHTML = `
    <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75" onclick="closeInfoModal(event)">
      <div class="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="sticky top-0 bg-black text-white px-6 py-4 flex items-center justify-between z-10">
          <h2 class="text-2xl font-bold">${title}</h2>
          <button onclick="closeInfoModal()" class="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="overflow-y-auto px-6 py-6" style="max-height: calc(90vh - 140px);">
          ${content}
        </div>
        
        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button onclick="closeInfoModal()" class="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
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
  window.infoModalKeyHandler = (e) => {
    if (e.key === 'Escape') {
      closeInfoModal();
    }
  };
  document.addEventListener('keydown', window.infoModalKeyHandler);
}

function closeInfoModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modalContainer = document.getElementById('legal-modal');
  if (modalContainer) {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  }
  
  // Re-enable body scroll
  enableBodyScroll();
  
  // Remove escape key listener
  if (window.infoModalKeyHandler) {
    document.removeEventListener('keydown', window.infoModalKeyHandler);
    window.infoModalKeyHandler = null;
  }
}

// FAQ Search and Toggle
function filterFAQ(searchTerm) {
  const faqItems = document.querySelectorAll('.faq-item');
  const categories = document.querySelectorAll('.faq-category');
  searchTerm = searchTerm.toLowerCase();
  
  categories.forEach(category => {
    let hasVisibleItems = false;
    const items = category.querySelectorAll('.faq-item');
    
    items.forEach(item => {
      const question = item.querySelector('.faq-question span').textContent.toLowerCase();
      const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
      
      if (question.includes(searchTerm) || answer.includes(searchTerm)) {
        item.style.display = '';
        hasVisibleItems = true;
      } else {
        item.style.display = 'none';
      }
    });
    
    // Hide category if no items match
    if (hasVisibleItems) {
      category.style.display = '';
    } else {
      category.style.display = 'none';
    }
  });
}

function toggleFAQ(button) {
  const answer = button.nextElementSibling;
  const icon = button.querySelector('.faq-icon');
  const isHidden = answer.classList.contains('hidden');
  
  // Close all other FAQs
  document.querySelectorAll('.faq-answer').forEach(a => {
    a.classList.add('hidden');
  });
  document.querySelectorAll('.faq-icon').forEach(i => {
    i.setAttribute('data-lucide', 'plus');
  });
  
  // Toggle current FAQ
  if (isHidden) {
    answer.classList.remove('hidden');
    icon.setAttribute('data-lucide', 'minus');
  }
  
  // Reinitialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}
