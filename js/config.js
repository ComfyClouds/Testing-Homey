// ============================================================
//  HOMEY VIBES — Configuration File
//  Edit this file to customize your store settings
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  //  Google Apps Script Web App URL
  //  After deploying your Apps Script, paste the URL here
  // ----------------------------------------------------------
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzkuaH1eNz3kOAuy89k8HL1lp7Z5jQ3dOxbx4duaXwInBS-F5Q4NCS8U6ITEr4VvKzVXA/exec',

  // ----------------------------------------------------------
  //  Store Info
  // ----------------------------------------------------------
  STORE_NAME: 'Homey Vibes',
  STORE_TAGLINE: 'Wrapped in warmth, made for you.',
  STORE_EMAIL: 'homeyvibeseg@gmail.com',
  WHATSAPP: '201558868380', // Egyptian number without +

  // ----------------------------------------------------------
  //  Announcement Bar Messages (rotating)
  //  You can also manage these from the Google Sheet
  // ----------------------------------------------------------
  ANNOUNCEMENTS: [
    '✨ New arrivals — Feminine PJs & Cashes now available!',
    '🚚 Free shipping on orders over 1500 EGP',
    '💌 Cash on Delivery — No prepayment needed!',
    '🎀 Sizes for everyone — One Size & Big Size options',
  ],

  // ----------------------------------------------------------
  //  Shipping Rates (EGP) — copied from Comfy Clouds
  // ----------------------------------------------------------
  SHIPPING: {
    'Cairo':                    { price: 60,  days: '1–3 business days' },
    'Giza':                     { price: 60,  days: '1–3 business days' },
    'Helwan':                   { price: 65,  days: '1–3 business days' },
    'Kerdasa':                  { price: 65,  days: '1–3 business days' },
    'Al Saf':                   { price: 65,  days: '1–3 business days' },
    'Al Ayat':                  { price: 65,  days: '1–3 business days' },
    'Alexandria':               { price: 70,  days: '1–3 business days' },
    'Damietta':                 { price: 70,  days: '1–3 business days' },
    'Gharbia':                   { price: 70, days: '2–4 business days' },
    'Beheira':                    { price: 70, days: '2–4 business days' },
    'Dakahlia':                  { price: 70, days: '2–4 business days' },
    'Qalyubia':                 { price: 70,  days: '2–4 business days' },
    'Sharqia':                  { price: 70,  days: '2–4 business days' },
    'Monufia':                  { price: 70,  days: '2–4 business days' },
    'Kafr El Sheikh':           { price: 70,  days: '2–4 business days' },
    'Fayum':                    { price: 90,  days: '3–5 business days' },
    'Beni Suef':                { price: 90,  days: '3–5 business days' },
    'Minya':                    { price: 90,  days: '3–5 business days' },
    'Assiut': { price: 90, days: '3–5 business days' },
    'Sohag': { price: 90, days: '3–5 business days' },
    'Qena': { price: 90, days: '3–5 business days' },
    'Luxor': { price: 90, days: '3–5 business days' },
    'Al Wadi Al Gadid':         { price: 100, days: '4–7 business days' },
    'North & South Sinai':      { price: 130, days: '4–7 business days' },
  },

  // ----------------------------------------------------------
  //  Categories & Subcategories
  // ----------------------------------------------------------
  CATEGORIES: {
    'PJs': {
      label: 'PJs',
      description: 'Pajama sets for the dreamiest nights in',
      subcategories: ['One Size', 'Big Size'],
    },
    'Cashes': {
      label: 'Cashes',
      description: 'Effortless loungewear for everyday comfort',
      subcategories: ['One Size', 'Big Size'],
    },
  },
};
