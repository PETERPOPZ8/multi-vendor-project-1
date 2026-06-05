const API_BASE = 'http://localhost:5000/api';

async function authFetch(url, opts = {}) {
  const token = localStorage.getItem('token');
  opts.headers = opts.headers || {};
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, opts).then((r) => r.json());
}

async function addToCart(productId, quantity = 1) {
  return authFetch(`${API_BASE}/cart/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) });
}

async function getCart() { return authFetch(`${API_BASE}/cart`); }

async function updateCart(productId, quantity) { return authFetch(`${API_BASE}/cart/update`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) }); }

async function removeFromCart(productId) { return authFetch(`${API_BASE}/cart/remove`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) }); }

// Wire add-to-cart buttons
document.addEventListener('click', (e) => {
  if (e.target.matches('.add-to-cart')) {
    const productId = e.target.dataset.productId;
    addToCart(productId).then((r) => console.log('Added', r));
  }
});
