// ============================================================
//  HOMEY VIBES — Checkout Logic
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  await Cart.validate();
  buildOrderSummary();
  buildGovernorateOptions();
  setupPromoCode();
  setupFormHandlers();
  updateTotals();
});

// ----------------------------------------------------------
//  Build order summary sidebar
// ----------------------------------------------------------
function buildOrderSummary() {
  const container = document.getElementById('checkout-items');
  if (!container) return;
  const items = Cart.getAll();
  if (!items.length) { window.location.href = BASE_URL + 'cart/'; return; }

  container.innerHTML = items.map(item => {
    const price = parseFloat(item.sale_price || item.price) || 0;
    const img = item.image1 || `https://placehold.co/80x100/f0e0dc/9d5a5e?text=Item`;
    return `
      <div class="co-item">
        <img src="${img}" alt="${item.name}">
        <div class="co-item-info">
          <p class="co-item-name">${item.name}</p>
          <p class="co-item-sub">${item.subcategory || ''} · Qty: ${item.qty}</p>
        </div>
        <span class="co-item-price">${formatPrice(price * item.qty)}</span>
      </div>`;
  }).join('');
  updateTotals();
}

// ----------------------------------------------------------
//  Populate governorate dropdown with shipping rates
// ----------------------------------------------------------
function buildGovernorateOptions() {
  const sel = document.getElementById('governorate');
  if (!sel) return;
  sel.innerHTML = '<option value="">Select your governorate…</option>';
  Object.entries(CONFIG.SHIPPING).forEach(([name, info]) => {
    const opt = document.createElement('option');
    opt.value = name;
    // This line below is the only change: it now only shows the name.
    opt.textContent = name; 
    opt.dataset.price = info.price;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', updateTotals);
}

// ----------------------------------------------------------
//  Promo code
// ----------------------------------------------------------
let _promoDiscount = 0;
let _promoCode      = '';
let _promoPercent   = 0;

function setupPromoCode() {
  const btn = document.getElementById('apply-promo');
  if (!btn) return;
  btn.addEventListener('click', applyPromo);
  document.getElementById('promo-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') applyPromo();
  });
}

async function applyPromo() {
  const input = document.getElementById('promo-input');
  const code  = input?.value.trim().toUpperCase();
  if (!code) return;

  const msgEl = document.getElementById('promo-msg');

  // Fetch from Apps Script
  if (CONFIG.APPS_SCRIPT_URL && CONFIG.APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
    try {
      const res  = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=promo&code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.valid) {
        applyPromoDiscount(data, code, msgEl);
      } else {
        msgEl.textContent = 'Invalid or expired promo code.';
        msgEl.className = 'promo-msg error';
        _promoDiscount = 0;
        _promoCode = '';
        _promoPercent = 0;
        updateTotals();
      }
      return;
    } catch (e) { /* fall through to demo */ }
  }

  // Demo fallback
  if (code === 'VIBES10') {
    applyPromoDiscount({ type: 'percent', value: 10 }, code, msgEl);
  } else if (code === 'SAVE50') {
    applyPromoDiscount({ type: 'fixed', value: 50 }, code, msgEl);
  } else {
    if (msgEl) { msgEl.textContent = 'Invalid or expired promo code.'; msgEl.className = 'promo-msg error'; }
    _promoDiscount = 0; _promoCode = ''; _promoPercent = 0;
    updateTotals();
  }
}

function applyPromoDiscount(data, code, msgEl) {
  const sub = Cart.subtotal();
  _promoCode = code;
  if (data.type === 'percent') {
    _promoPercent = parseFloat(data.value) || 0;
    _promoDiscount = Math.round(sub * _promoPercent / 100);
    if (msgEl) { msgEl.textContent = `✓ ${data.value}% off applied!`; msgEl.className = 'promo-msg success'; }
  } else {
    _promoPercent = 0;
    _promoDiscount = parseFloat(data.value) || 0;
    if (msgEl) { msgEl.textContent = `✓ ${formatPrice(_promoDiscount)} off applied!`; msgEl.className = 'promo-msg success'; }
  }
  updateTotals();
}

// ----------------------------------------------------------
//  Update totals display
// ----------------------------------------------------------
function updateTotals() {
  const sub      = Cart.subtotal();
  const govSel   = document.getElementById('governorate');
  
  // Logic: Check if order is 1500+ for free shipping
  let shipping = 0;
  const originalShipping = govSel?.selectedOptions[0]?.dataset.price ? parseFloat(govSel.selectedOptions[0].dataset.price) : 0;
  
  const isFreeShipping = (sub >= 1500 && originalShipping > 0);
  
  if (govSel && govSel.value) {
    shipping = isFreeShipping ? 0 : originalShipping;
  } else {
    shipping = 0;
  }

  // Recalculate percent-based promo against current subtotal
  if (_promoCode && _promoPercent > 0) {
    _promoDiscount = Math.round(sub * _promoPercent / 100);
  }
  const discount = _promoDiscount;
  const total    = Math.max(0, sub - discount + shipping);

  setText('co-subtotal',  formatPrice(sub));
  
  // Display handling
  if (!govSel || !govSel.value) {
    setText('co-shipping', 'Select governorate');
  } else if (isFreeShipping) {
    setText('co-shipping', 'FREE');
    const shipEl = document.getElementById('co-shipping');
    if (shipEl) shipEl.style.color = 'var(--success)';
  } else {
    setText('co-shipping', formatPrice(shipping));
    const shipEl = document.getElementById('co-shipping');
    if (shipEl) shipEl.style.color = '';
  }

  setText('co-discount',  discount > 0 ? `- ${formatPrice(discount)}` : '—');
  setText('co-total',     formatPrice(total));

  // Also update place-order button
  const btn = document.getElementById('place-order-btn');
  if (btn) btn.textContent = `Place Order · ${formatPrice(total)}`;

  return { sub, shipping, discount, total };
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ----------------------------------------------------------
//  Form submission
// ----------------------------------------------------------
function setupFormHandlers() {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('place-order-btn');

  // Validate governorate
  const govSel = document.getElementById('governorate');
  if (!govSel.value) {
    showToast('Please select your governorate', 'error');
    govSel.focus();
    return;
  }

  const totals = updateTotals();
  const orderId = 'HV-' + Date.now().toString(36).toUpperCase();
  const items = Cart.getAll();

  const order = {
    order_id:    orderId,
    date:        new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
    name:        document.getElementById('full-name').value.trim(),
    phone:       document.getElementById('phone').value.trim(),
    address:     document.getElementById('address').value.trim(),
    governorate: govSel.value,
    notes:       document.getElementById('notes')?.value.trim() || '',
    // UPDATED: Sending as an array of objects to include ID, Name, and Qty
    products:    items.map(i => ({
                   id: i.id || "N/A",
                   name: i.name,
                   size: i.subcategory || '',
                   qty: i.qty
                 })),
    subtotal:    totals.sub,
    shipping:    totals.shipping,
    discount:    totals.discount,
    promo_code:  _promoCode,
    total:       totals.total,
    payment:     'Cash on Delivery',
    status:      'New',
  };

  localStorage.setItem('homeyvibes_last_order', JSON.stringify(order));

  btn.textContent = 'Placing order…';
  btn.disabled = true;

  if (CONFIG.APPS_SCRIPT_URL && CONFIG.APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
    try {
      await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'order', order }),
      });
      // Delay to ensure the script processes before redirection
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.warn('Order submit failed, saved locally.', err);
      // Re-enable button so user can retry
      btn.textContent = 'Place Order';
      btn.disabled = false;
    }
  }

  Cart.clear();
  window.location.href = BASE_URL + 'thanks/';
}
