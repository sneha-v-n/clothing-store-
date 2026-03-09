// ═══════════════════════════════════════════════
//  StyleCart – script.js
// ═══════════════════════════════════════════════

// ── PRODUCT DATA ──────────────────────────────
const products = [
  {
    id: 1,
    name: 'Floral Wrap Dress',
    brand: 'StyleCart',
    price: 899,
    original: 1499,
    image:'image/floralwrap.jpg',
    badge: 'sale',
    category: 'dresses',
    colors: ['#e8b4b8', '#98c1d9', '#ffffff'],
    rating: 4.8,
    reviews: 231,
    tag: 'sale'
  },
  {
    id: 2,
    name: 'Linen Co-ord Set',
    brand: 'StyleCart',
    price: 1299,
    original: 1799,
    image:'image/linen.jpg',
    badge: 'new',
    category: 'tops',
    colors: ['#f5deb3', '#d2b48c', '#8b7355'],
    rating: 4.9,
    reviews: 89,
    tag: 'new'
  },
  {
    id: 3,
    name: 'High-Rise Skinny Jeans',
    brand: 'StyleCart',
    price: 1199,
    original: null,
    image:'image/jeans.jpg',
    badge: 'bestseller',
    category: 'jeans',
    colors: ['#191970', '#36454f', '#c0c0c0'],
    rating: 4.7,
    reviews: 412,
    tag: 'bestseller'
  },
  {
    id: 4,
    name: 'Satin Slip Dress',
    brand: 'StyleCart',
    price: 799,
    original: 1199,
    image:'image/slip.jpg',
    badge: 'sale',
    category: 'dresses',
    colors: ['#000000', '#8b0000', '#f5f5dc'],
    rating: 4.6,
    reviews: 178,
    tag: 'sale'
  },
  {
    id: 5,
    name: 'Oversized Graphic Tee',
    brand: 'StyleCart',
    price: 399,
    original: null,
    image:'image/tee.jpg',
    badge: 'new',
    category: 'tops',
    colors: ['#ffffff', '#000000', '#808080'],
    rating: 4.5,
    reviews: 305,
    tag: 'new'
  },
  {
    id: 6,
    name: 'Kurta',
    brand: 'StyleCart',
    price: 1599,
    original: 2199,
    image:'image/kurta.jpg',
    badge: 'new',
    category: 'men',
    colors: ['#2f4f4f', '#8b0000', '#f5f5dc'],
    rating: 4.9,
    reviews: 67,
    tag: 'new'
  },
  {
    id: 7,
    name: 'Pleated Midi Skirt',
    brand: 'StyleCart',
    price: 699,
    original: 999,
    image:'image/midi.jpg',
    badge: 'sale',
    category: 'dresses',
    colors: ['#ffc0cb', '#000080', '#228b22'],
    rating: 4.4,
    reviews: 193,
    tag: 'sale'
  },
  {
    id: 8,
    name: 'Yoga Set 2-piece',
    brand: 'StyleCart',
    price: 1099,
    original: 1499,
    image:'image/yoga.jpg',
    badge: 'bestseller',
    category: 'active',
    colors: ['#000000', '#ff69b4', '#40e0d0'],
    rating: 4.8,
    reviews: 524,
    tag: 'bestseller'
  }
];

// ── STATE ──────────────────────────────────────
let cartItems = [];
let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
let currentProduct = null;

// ── RENDER PRODUCTS ───────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('productsGrid');

  if (!list.length) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5" style="color:var(--text-muted)">
        <i class="bi bi-search" style="font-size:2rem;display:block;margin-bottom:12px;opacity:0.3"></i>
        No products found for this filter.
      </div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const discount = p.original
      ? Math.round((1 - p.price / p.original) * 100)
      : null;

    const badgeLabel = p.badge === 'sale'
      ? 'Sale'
      : p.badge === 'new'
      ? 'New In'
      : 'Best Seller';

    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '☆' : '');

    const swatches = p.colors
      .map(c => `<div class="swatch" style="background:${c}" title="${c}"></div>`)
      .join('');

    const priceHTML = p.original
      ? `<span class="price-current">₹${p.price.toLocaleString()}</span>
         <span class="price-original">₹${p.original.toLocaleString()}</span>
         <span class="price-discount">${discount}% OFF</span>`
      : `<span class="price-current">₹${p.price.toLocaleString()}</span>`;

    return `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="product-card" data-category="${p.category}" data-tag="${p.tag}">
          <div class="product-img">
           <img src="${p.image}" alt="${p.name}" 
  style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;"/>
            ${p.badge ? `<span class="product-badge badge-${p.badge}">${badgeLabel}</span>` : ''}
            <div class="product-actions">
              <button onclick="addToCart(${p.id})">Add to Bag</button>
             <button class="wishlist-btn" onclick="addToWishlist(${p.id})">
<i class="bi bi-heart"></i>
</button>
            </div>
          </div>
          <div class="product-info">
            <p class="product-brand">${p.brand}</p>
            <p class="product-name">${p.name}</p>
            <div class="product-rating">
              <span class="stars">${stars}</span>
              <span class="rating-count">(${p.reviews})</span>
            </div>
            <div class="product-price">${priceHTML}</div>
            <button class="quick-view-btn" onclick="openQuickView(${p.id})">Quick View</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// Initial render
renderProducts(products);

// ── FILTER ────────────────────────────────────
function setFilter(btn, filter) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  let filtered = products;
  if (filter === 'new')         filtered = products.filter(p => p.tag === 'new');
  else if (filter === 'sale')   filtered = products.filter(p => p.tag === 'sale');
  else if (filter === 'bestseller') filtered = products.filter(p => p.tag === 'bestseller');
  else if (filter === 'under500')   filtered = products.filter(p => p.price < 500);
  else if (filter !== 'all')    filtered = products.filter(p => p.category === filter);

  renderProducts(filtered);
}

function filterCategory(cat) {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const filtered = products.filter(p => p.category === cat);
    renderProducts(filtered.length ? filtered : products);

    // Highlight matching pill if exists
    document.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.remove('active');
      if (p.textContent.toLowerCase().trim() === cat) p.classList.add('active');
    });
  }, 400);
}

// ── SORT ──────────────────────────────────────
function sortProducts() {
  const val = document.getElementById('sortSelect').value;
  let sorted = [...products];

  if (val === 'low')    sorted.sort((a, b) => a.price - b.price);
  else if (val === 'high')   sorted.sort((a, b) => b.price - a.price);
  else if (val === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  else if (val === 'newest') sorted.sort((a, b) => b.id - a.id);

  renderProducts(sorted);
}

// ── LOAD MORE ─────────────────────────────────
function loadMore() {
  showToast('✅ All products loaded!');
  const btn = document.getElementById('loadMoreBtn');
  btn.textContent = 'All Caught Up!';
  btn.disabled = true;
  btn.style.opacity = '0.5';
  btn.style.cursor = 'default';
}

// ── CART ──────────────────────────────────────
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const existing = cartItems.find(x => x.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ ...p, qty: 1 });
  }

  updateCartUI();
  showToast(`🛍️ ${p.name} added to bag!`);
}

function updateCartUI() {
  // Badge count
  const total = cartItems.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartBadge').textContent = total;

  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');

  if (!cartItems.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-bag"></i>
        <p class="cart-empty-title">Your bag is empty</p>
        <p class="cart-empty-sub">Add items you love to get started</p>
        <a href="#products" onclick="toggleCart()" class="btn-hero-primary" style="padding:10px 24px">
          Start Shopping
        </a>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';

  body.innerHTML = cartItems.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-img">
<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">
</div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-variant">Size: M · Color: Default</p>
        <p class="cart-item-price">₹${item.price.toLocaleString()}</p>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${idx})">Remove</button>
        </div>
      </div>
    </div>`).join('');

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = `₹${subtotal.toLocaleString()}`;
}

function changeQty(idx, delta) {
  cartItems[idx].qty += delta;
  if (cartItems[idx].qty <= 0) cartItems.splice(idx, 1);
  updateCartUI();
}

function removeItem(idx) {
  cartItems.splice(idx, 1);
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}
function addToWishlist(id){

const product = products.find(p => p.id === id);

const exists = wishlistItems.find(p => p.id === id);

if(exists){
showToast("Already in wishlist 💛");
return;
}

wishlistItems.push(product);

localStorage.setItem("wishlist", JSON.stringify(wishlistItems));

showToast("💛 Added to wishlist!");

updateWishlistBadge();

}
function openWishlist(){

document.getElementById("wishlistDrawer").classList.add("open");
document.getElementById("wishlistOverlay").classList.add("open");

renderWishlist();

}

function closeWishlist(){

document.getElementById("wishlistDrawer").classList.remove("open");
document.getElementById("wishlistOverlay").classList.remove("open");

}

function renderWishlist(){

let body = document.getElementById("wishlistBody");

if(!wishlistItems.length){

body.innerHTML="<p style='text-align:center'>Your wishlist is empty</p>";

return;

}

body.innerHTML = wishlistItems.map(item =>`

<div class="cart-item">

<div class="cart-item-img">
<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">
</div>

<div class="cart-item-info">

<p class="cart-item-name">${item.name}</p>

<p class="cart-item-price">₹${item.price}</p>

<button class="btn btn-sm btn-dark" onclick="addToCart(${item.id})">
Add to Bag
</button>

<button class="remove-btn" onclick="removeFromWishlist(${item.id})">
Remove
</button>

</div>

</div>

`).join("");

}
function removeFromWishlist(id){

wishlistItems = wishlistItems.filter(item => item.id !== id);

localStorage.setItem("wishlist", JSON.stringify(wishlistItems));

updateWishlistBadge();

renderWishlist();

showToast("❌ Removed from wishlist");

}

// ── QUICK VIEW ────────────────────────────────
function openQuickView(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;

  document.getElementById('qvImage').innerHTML =
`<img src="${p.image}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;
  document.getElementById('qvBrand').textContent   = p.brand;
  document.getElementById('qvName').textContent    = p.name;
  document.getElementById('qvPrice').textContent   = `₹${p.price.toLocaleString()}`;
  document.getElementById('qvRating').textContent  = `(${p.reviews} reviews)`;

  const original = document.getElementById('qvOriginal');
  const discount = document.getElementById('qvDiscount');

  if (p.original) {
    original.textContent = `₹${p.original.toLocaleString()}`;
    discount.textContent = `${Math.round((1 - p.price / p.original) * 100)}% OFF`;
    original.style.display = '';
    discount.style.display = '';
  } else {
    original.style.display = 'none';
    discount.style.display = 'none';
  }

  // Reset size selection
  document.querySelectorAll('.size-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === 2); // default M
  });

  const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
  modal.show();
}

function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function addFromQuickView() {
  if (currentProduct) {
    addToCart(currentProduct.id);
    const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
    if (modal) modal.hide();
  }
}

// ── THEME TOGGLE ──────────────────────────────
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '🌙 Dark' : '☀️ Light';
}

// ── POPUP ─────────────────────────────────────
// Show popup after 2.5s, once per session
setTimeout(() => {
  if (!sessionStorage.getItem('popupShown')) {
    document.getElementById('popupOverlay').style.display = 'flex';
  }
}, 2500);

function closePopup() {
  document.getElementById('popupOverlay').style.display = 'none';
  sessionStorage.setItem('popupShown', 'true');
}

function claimDiscount() {
  const email = document.getElementById('popupEmail').value.trim();
  if (!email || !email.includes('@')) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }
  closePopup();
  showToast('🎉 Code STYLE25 unlocked! Enjoy 25% off your order!');
}

// Close popup on overlay click
document.getElementById('popupOverlay').addEventListener('click', function(e) {
  if (e.target === this) closePopup();
});

// ── NEWSLETTER ────────────────────────────────
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const email = input.value.trim();

  if (!email || !email.includes('@')) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }

  input.value = '';
  showToast('✅ Subscribed! Check your inbox for your 15% off code.');
}

// ── TOAST ─────────────────────────────────────
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toastNotif');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}


// ── BACK TO TOP ───────────────────────────────
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 400) btn.classList.add('visible');
  else btn.classList.remove('visible');
});

// ── SEARCH BAR ────────────────────────────────
document.getElementById('searchInput').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();

  const filtered = q
    ? products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      )
    : products;

  renderProducts(filtered);

  if (q) {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  }
});
function loginUser(){

showToast("✅ Login successful!");

}

function registerUser(){

showToast("🎉 Account created successfully!");

}
function goToCheckout(){

localStorage.setItem("cartItems", JSON.stringify(cartItems));

window.location.href="checkout.html";

}

function updateWishlistBadge(){

document.getElementById("wishlistBadge").innerText = wishlistItems.length;

}

updateWishlistBadge();