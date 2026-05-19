// ============================================================
//  HOMEY VIBES — Cart Management
// ============================================================

const Cart = (() => {
  const KEY = 'homeyvibes_cart';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    updateCartCount();
    window.dispatchEvent(new Event('cart:updated'));
  }

  // MECHANICAL FIX: Cross-reference cart with live Products data
// MECHANICAL FIX: Cross-reference cart with live Products data + Alert
  async function validate() {
    const items = getAll();
    if (!items.length) return items;

    try {
      const liveProducts = await Products.fetchAll();
      const validItems = items.filter(cartItem => {
        const liveMatch = liveProducts.find(p => String(p.id) === String(cartItem.id));
        return liveMatch && (liveMatch.active === true || liveMatch.active === 'TRUE' || liveMatch.active === undefined);
      });

      if (validItems.length !== items.length) {
        // Force the alert here so it always shows when items are purged
        alert("Some items in your cart are no longer available and have been removed.");
        save(validItems);
      }
      return validItems;
    } catch (e) {
      console.warn('Cart validation failed, proceeding with current items.', e);
      return items;
    }
  }

  function add(product, qty = 1) {
    const items = getAll();
    const id = product.id + '_' + (product.subcategory || product.selectedSize || '');
    const existing = items.find(i => i._key === id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ ...product, qty, _key: id });
    }
    save(items);
  }

  function remove(key) {
    save(getAll().filter(i => i._key !== key));
  }

  function updateQty(key, qty) {
    const items = getAll();
    const item = items.find(i => i._key === key);
    if (item) {
      if (qty <= 0) return remove(key);
      item.qty = qty;
      save(items);
    }
  }

  function clear() { save([]); }

  function count() {
    return getAll().reduce((sum, i) => sum + i.qty, 0);
  }

  function subtotal() {
    return getAll().reduce((sum, i) => {
      const price = parseFloat(i.sale_price || i.price) || 0;
      return sum + price * i.qty;
    }, 0);
  }

  function updateCartCount() {
    document.querySelectorAll('.cart-count').forEach(el => {
      const n = count();
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  }

  // Run on load
  document.addEventListener('DOMContentLoaded', updateCartCount);

  return { getAll, validate, add, remove, updateQty, clear, count, subtotal, updateCartCount };
})();
