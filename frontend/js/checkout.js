const API_BASE = 'http://localhost:5000/api';

async function placeOrder(payload) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  return res.json();
}

document.addEventListener('submit', (e) => {
  if (e.target.matches('#checkoutForm')) {
    e.preventDefault();
    const shippingAddress = document.querySelector('#shippingAddress').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    placeOrder({ shippingAddress, paymentMethod }).then((r) => console.log('Order placed', r));
  }
});
