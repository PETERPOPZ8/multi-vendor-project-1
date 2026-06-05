const API_BASE = 'http://localhost:5000/api';

async function getProducts(params = '') {
  const res = await fetch(`${API_BASE}/products${params}`);
  return res.json();
}

async function getProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return res.json();
}

async function createProduct(form) {
  const token = localStorage.getItem('token');
  const formData = new FormData(form);
  const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
  return res.json();
}

// Auto-wire search field on product listing pages
document.addEventListener('DOMContentLoaded', async () => {
  const search = document.querySelector('#search');
  if (search) {
    search.addEventListener('input', async (e) => {
      const q = e.target.value;
      const products = await getProducts(`?search=${encodeURIComponent(q)}`);
      // Replace static DOM with results - frontend must implement DOM update hooks
      console.log('Search results', products);
    });
  }
});
