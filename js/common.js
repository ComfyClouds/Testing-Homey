var BASE_URL = (typeof _BASE_URL !== 'undefined') ? _BASE_URL : './';
// ============================================================
//  HOMEY VIBES — Common UI (Header, Footer, Announcement Bar)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  injectAnnouncements();
  injectHeader();
  injectFooter();
  startAnnouncementRotation();
});

// ----------------------------------------------------------
//  Announcement Bar
// ----------------------------------------------------------
let _annIdx = 0;
function injectAnnouncements() {
  const bar = document.getElementById('announcement-bar');
  if (!bar) return;
  renderAnnouncement(bar);
}

function renderAnnouncement(bar) {
  const msgs = CONFIG.ANNOUNCEMENTS;
  bar.innerHTML = `
    <div class="ann-inner">
      <button class="ann-arrow" id="ann-prev">&#8592;</button>
      <span class="ann-text" id="ann-text">${msgs[_annIdx]}</span>
      <button class="ann-arrow" id="ann-next">&#8594;</button>
    </div>`;
  document.getElementById('ann-prev').onclick = () => { _annIdx = (_annIdx - 1 + msgs.length) % msgs.length; renderAnnouncement(bar); };
  document.getElementById('ann-next').onclick = () => { _annIdx = (_annIdx + 1) % msgs.length; renderAnnouncement(bar); };
}

function startAnnouncementRotation() {
  const msgs = CONFIG.ANNOUNCEMENTS;
  if (msgs.length < 2) return;
  setInterval(() => {
    _annIdx = (_annIdx + 1) % msgs.length;
    const el = document.getElementById('ann-text');
    if (el) { el.style.opacity = '0'; setTimeout(() => { el.textContent = msgs[_annIdx]; el.style.opacity = '1'; }, 300); }
  }, 5000);
}

// ----------------------------------------------------------
//  Header
// ----------------------------------------------------------
function injectHeader() {
  const el = document.getElementById('main-header');
  if (!el) return;
  const path = window.location.pathname;
  el.innerHTML = `
    <nav class="navbar">
      <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <a href="${BASE_URL}" class="nav-logo">${CONFIG.STORE_NAME}</a>
      <div class="nav-links" id="nav-links">
        <a href="${BASE_URL}" class="${path.includes('index') || path === '/' ? 'active' : ''}">Home</a>
        <a href="${BASE_URL}shop/" class="${path.includes('shop') ? 'active' : ''}">Shop</a>
        <a href="${BASE_URL}shop/?cat=PJs" class="${path.includes('shop') && location.search.includes('PJs') ? 'active' : ''}">PJs</a>
        <a href="${BASE_URL}shop/?cat=Cashes" class="${path.includes('shop') && location.search.includes('Cashes') ? 'active' : ''}">Cashes</a>
      </div>
      <div class="nav-actions">
        <a href="${BASE_URL}cart/" class="cart-btn" aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="cart-count" style="display:none">0</span>
        </a>
      </div>
    </nav>
    <div class="nav-mobile-menu" id="nav-mobile-menu">
      <a href="${BASE_URL}">Home</a>
      <a href="${BASE_URL}shop/">All Products</a>
      <a href="${BASE_URL}shop/?cat=PJs">PJs</a>
      <a href="${BASE_URL}shop/?cat=Cashes">Cashes</a>
      <a href="${BASE_URL}cart/">Cart</a>
    </div>`;

  document.getElementById('nav-hamburger').onclick = () => {
    document.getElementById('nav-mobile-menu').classList.toggle('open');
  };

  Cart.updateCartCount();
}

// ----------------------------------------------------------
//  Footer
// ----------------------------------------------------------
function injectFooter() {
  const el = document.getElementById('main-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">${CONFIG.STORE_NAME}</div>
          <p>${CONFIG.STORE_TAGLINE}</p>
          <div class="footer-socials">
    <a href="https://wa.me/${CONFIG.WHATSAPP}" target="_blank" aria-label="WhatsApp">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>

    <a href="https://www.instagram.com/homeyvibes3?igsh=czU3bXRrcHAzNG12" target="_blank" aria-label="Instagram">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    </a>

    <a href="https://www.facebook.com/share/1DYXZyEtAn/?mibextid=wwXIfr" target="_blank" aria-label="Facebook">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
    </a>

   <a href="https://tiktok.com/@homeyvibes" target="_blank" aria-label="TikTok">
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 448 512">
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
  </svg>
</a>
</div>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <a href="${BASE_URL}shop/">All Products</a>
          <a href="${BASE_URL}shop/?cat=PJs">PJs</a>
          <a href="${BASE_URL}shop/?cat=Cashes">Cashes</a>
          <a href="${BASE_URL}cart/">Cart</a>
        </div>
        <div class="footer-col">
          <h4>Help</h4>
          <a href="${BASE_URL}shipping/">Delivery & Shipping</a>
          <a href="${BASE_URL}refund/">Refund Policy</a>
          <a href="https://wa.me/${CONFIG.WHATSAPP}" target="_blank">Contact Us</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="${BASE_URL}terms/">Terms of Service</a>
          <a href="${BASE_URL}privacy/">Privacy Policy</a>
          <a href="${BASE_URL}refund/">Refund Policy</a>
          <a href="${BASE_URL}shipping/">Shipping Policy</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 ${CONFIG.STORE_NAME} · Made with ♡ in Egypt 🇪🇬</p>
      </div>
    </footer>`;
}

// ----------------------------------------------------------
//  Helper: Format price
// ----------------------------------------------------------
function formatPrice(n) {
  return Number(n).toLocaleString('en-EG') + ' EGP';
}

// ----------------------------------------------------------
//  Helper: Show toast notification
// ----------------------------------------------------------
function showToast(msg, type = 'success') {
  let t = document.getElementById('hv-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'hv-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = `hv-toast show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ----------------------------------------------------------
//  Helper: Get URL param
// ----------------------------------------------------------
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
