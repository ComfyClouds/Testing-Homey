// ============================================================
//  HOMEY VIBES — Products (Google Sheets backend)
// ============================================================

const Products = (() => {
  let _cache = null;

  // ----------------------------------------------------------
  //  Fetch all products from Google Apps Script
  // ----------------------------------------------------------
  async function fetchAll() {
    if (_cache) return _cache;
    if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      _cache = getDemoProducts();
      return _cache;
    }
    try {
      const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=products`);
      const data = await res.json();
      _cache = data.products || [];
      return _cache;
    } catch (e) {
      console.warn('Could not fetch products. Using demo data.', e);
      _cache = getDemoProducts();
      return _cache;
    }
  }

  // ----------------------------------------------------------
  //  Fetch single product by ID
  // ----------------------------------------------------------
  async function getById(id) {
    const all = await fetchAll();
    return all.find(p => String(p.id) === String(id)) || null;
  }

  // ----------------------------------------------------------
  //  Filter products
  // ----------------------------------------------------------
  async function getFiltered({ category, subcategory, featured } = {}) {
    let all = await fetchAll();
    if (category)    all = all.filter(p => p.category === category);
    
    // Logic fix: Allows items with "One Size / Big Size" to appear in either filter
    if (subcategory) {
      all = all.filter(p => {
        if (!p.subcategory) return false;
        return p.subcategory.toLowerCase().includes(subcategory.toLowerCase());
      });
    }
    
    if (featured)    all = all.filter(p => p.featured === true || p.featured === 'TRUE');
    return all.filter(p => p.active === true || p.active === 'TRUE' || p.active === undefined);
  }

  // ----------------------------------------------------------
  //  Render a product card HTML
  // ----------------------------------------------------------
  function cardHTML(product, opts = {}) {
    const price     = parseFloat(product.price) || 0;
    const salePrice = parseFloat(product.sale_price) || 0;
    const hasDiscount = salePrice > 0 && salePrice < price;
    const displayPrice = hasDiscount ? salePrice : price;
    const img = product.image1 || `https://placehold.co/400x500/f0e0dc/9d5a5e?text=${encodeURIComponent(product.name)}`;

    return `
      <div class="product-card" data-id="${product.id}">
        <a href="${BASE_URL}product/?id=${product.id}" class="card-img-wrap">
          <img src="${img}" alt="${product.name}" loading="lazy">
          ${hasDiscount ? `<span class="badge-sale">Sale</span>` : ''}
          ${product.featured === 'TRUE' || product.featured === true ? `<span class="badge-new">New</span>` : ''}
          <div class="card-overlay">
            <button class="btn-quick-add" data-id="${product.id}">Quick Add</button>
          </div>
        </a>
        <div class="card-info">
          <div class="card-category">${product.category} · ${product.subcategory || ''}</div>
          <a href="${BASE_URL}product/?id=${product.id}" class="card-name">${product.name}</a>
          <div class="card-price">
            ${hasDiscount
              ? `<span class="price-sale">${formatPrice(salePrice)}</span><span class="price-original">${formatPrice(price)}</span>`
              : `<span class="price-main">${formatPrice(displayPrice)}</span>`
            }
          </div>
        </div>
      </div>`;
  }

  // ----------------------------------------------------------
  //  Demo products
  // ----------------------------------------------------------
  function getDemoProducts() {
    const makeImg = (name) => `https://placehold.co/400x500/f0e0dc/9d5a5e?text=${encodeURIComponent(name)}`;
    return [
      { id:'1', name:'Rose Garden PJ Set',      category:'PJs',    subcategory:'One Size', price:450, sale_price:380, description:'Soft cotton blend pajama set with a delicate rose pattern. Perfect for cozy nights in.', image1:makeImg('Rose PJs'),   featured:'TRUE', active:'TRUE' },
      { id:'2', name:'Blush Floral PJ Set',      category:'PJs',    subcategory:'Big Size', price:480, sale_price:'',  description:'Oversized cotton pajama set in a soft blush floral print. Breathable and luxurious.', image1:makeImg('Blush PJs'),  featured:'FALSE', active:'TRUE' },
      { id:'3', name:'Ivory Dream PJ Set',       category:'PJs',    subcategory:'One Size', price:420, sale_price:360, description:'Minimalist ivory pajama set with lace trim details. Timeless and elegant.', image1:makeImg('Ivory PJs'),  featured:'TRUE', active:'TRUE' },
      { id:'4', name:'Mauve Stripe PJ Set',      category:'PJs',    subcategory:'Big Size', price:450, sale_price:'',  description:'Relaxed stripe pajama set in warm mauve tones. Ultra-soft fabric.',                image1:makeImg('Mauve PJs'),  featured:'FALSE', active:'TRUE' },
      { id:'5', name:'Dusty Rose Cash Dress',    category:'Cashes', subcategory:'One Size', price:550, sale_price:490, description:'Flowy caftan dress in dusty rose. Lightweight and flattering for all-day wear.',    image1:makeImg('Rose Cash'),  featured:'TRUE', active:'TRUE' },
      { id:'6', name:'Terracotta Cash Set',      category:'Cashes', subcategory:'Big Size', price:580, sale_price:'',  description:'Wide-cut cash set in warm terracotta. Comfortable and chic for home or outings.',    image1:makeImg('Terra Cash'), featured:'FALSE', active:'TRUE' },
      { id:'7', name:'Pearl Embroidered Cash',   category:'Cashes', subcategory:'One Size', price:620, sale_price:560, description:'Elegant cash with pearl embroidery details. A beautiful statement piece.',            image1:makeImg('Pearl Cash'), featured:'TRUE', active:'TRUE' },
      { id:'8', name:'Plum Velvet Cash Dress',   category:'Cashes', subcategory:'Big Size', price:650, sale_price:'',  description:'Rich plum velvet cash dress for special evenings at home.',                         image1:makeImg('Plum Cash'),  featured:'FALSE', active:'TRUE' },
    ];
  }

  return { fetchAll, getById, getFiltered, cardHTML };
})();
