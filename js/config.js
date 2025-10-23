// Configuration
const CONFIG = {
  // Google Sheets Web App URLs
  // IMPORTANT: After deploying your Google Apps Script, replace YOUR_SCRIPT_ID below
  // Example: https://script.google.com/macros/s/AKfycbx.../exec
  GOOGLE_SHEETS: {
    // REPLACE WITH YOUR WEB APP URL AFTER DEPLOYMENT
    productsUrl: 'https://script.google.com/macros/s/AKfycbw8S0scQXwftGlY0OHJHSBY_gsnBLVJ8riV8fXTJszuPVZ6aPneFwM-vRaPL2JHxjLt0A/exec?action=getProducts',
    contactFormUrl: 'https://script.google.com/macros/s/AKfycbw8S0scQXwftGlY0OHJHSBY_gsnBLVJ8riV8fXTJszuPVZ6aPneFwM-vRaPL2JHxjLt0A/exec?action=submitContact',
    cartInquiryUrl: 'https://script.google.com/macros/s/AKfycbw8S0scQXwftGlY0OHJHSBY_gsnBLVJ8riV8fXTJszuPVZ6aPneFwM-vRaPL2JHxjLt0A/exec?action=submitCartInquiry'
  },
  
  // Your Google Sheet ID
  SHEET_ID: '1pAwnY88m1d1pP-WLKHXlYJUfIAy0-zMm6CkNQXb6TT0',
  
  // Company Information - Update with your details
  COMPANY: {
    name: 'KiksNiks',
    email: 'nikkocapili.01@gmail.com', // Change this to your email
    phone: '+639302873442',
    address: 'La Paz, Tarlac, Philippines'
  },
  
  // Pagination
  ITEMS_PER_PAGE: 6,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    cart: 'kiksniks_cart',
    filters: 'kiksniks_filters'
  }
};

// Feature Flags
const FEATURES = {
  useGoogleSheets: true, // Using Google Sheets!
  useMockData: false // NOT using mock data
};

/**
 * QUICK SETUP GUIDE:
 * 
 * 1. Open the file: /html-version/google-apps-script-auto-setup.js
 * 2. Copy ALL the code from that file
 * 3. Create a NEW Google Sheet: https://sheets.google.com
 * 4. In your new sheet, go to: Extensions > Apps Script
 * 5. Delete any existing code and paste the copied code
 * 6. Click the disk icon to save
 * 7. Click "Run" button, select "setupSheets" from dropdown
 * 8. Grant permissions when prompted
 * 9. Wait for it to finish (check execution log)
 * 10. Go back to your sheet - you'll see 3 new sheets with data!
 * 11. Click Deploy > New deployment
 * 12. Select type: Web app
 * 13. Execute as: Me
 * 14. Who has access: Anyone
 * 15. Click Deploy and COPY the Web App URL
 * 16. Come back here and replace YOUR_SCRIPT_ID in the URLs above
 * 17. Change useGoogleSheets to true and useMockData to false
 * 18. Done! Your website is now connected to Google Sheets!
 */
