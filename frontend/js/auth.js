// Authentication integration for login/register/forgot/otp
const API_BASE = 'http://localhost:5000/api';

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

function showAlert(message) {
  window.alert(message);
}

async function loginHandler(e) {
  e.preventDefault();
  const email = document.querySelector('#email')?.value.trim();
  const password = document.querySelector('#password')?.value.trim();
  const role = document.querySelector('input[name="role"]:checked')?.value || 'customer';

  if (!email || !password) {
    return showAlert('Please enter email/username and password.');
  }

  const data = await postJSON(`${API_BASE}/auth/login`, { email, password, role });
  localStorage.setItem('token', data.token);
  showAlert('Login successful');
  window.location.href = 'enter.html';
}

async function registerHandler(e) {
  e.preventDefault();
  const name = document.querySelector('#name')?.value.trim();
  const email = document.querySelector('#email')?.value.trim();
  const phone = document.querySelector('#phone')?.value.trim();
  const password = document.querySelector('#password')?.value;
  const confirmPassword = document.querySelector('#confirmPassword')?.value;
  const address = document.querySelector('#address')?.value.trim();

  if (!name || !email || !password || !confirmPassword) {
    return showAlert('Please complete all required fields.');
  }
  if (password !== confirmPassword) {
    return showAlert('Passwords do not match.');
  }

  await postJSON(`${API_BASE}/auth/register`, { name, email, password, phone, address });
  showAlert('Registration successful. Please log in.');
  window.location.href = 'index.html';
}

async function vendorRegisterHandler(e) {
  e.preventDefault();
  const storeName = document.querySelector('#storeName')?.value.trim();
  const ownerName = document.querySelector('#ownerName')?.value.trim();
  const email = document.querySelector('#email')?.value.trim();
  const phone = document.querySelector('#phone')?.value.trim();
  const password = document.querySelector('#password')?.value;
  const confirmPassword = document.querySelector('#confirmPassword')?.value;
  const address = document.querySelector('#address')?.value.trim();

  if (!storeName || !ownerName || !email || !password || !confirmPassword) {
    return showAlert('Please complete all required fields.');
  }
  if (password !== confirmPassword) {
    return showAlert('Passwords do not match.');
  }

  await postJSON(`${API_BASE}/auth/vendor/register`, { storeName, ownerName, email, password, phone, address });
  showAlert('Vendor registration successful. Please log in.');
  window.location.href = 'index.html';
}

async function forgotHandler(e) {
  e.preventDefault();
  const email = document.querySelector('#email')?.value.trim();
  if (!email) {
    return showAlert('Please enter your email.');
  }

  const data = await postJSON(`${API_BASE}/auth/forgot`, { email, type: 'customer' });
  showAlert(`OTP sent. Code: ${data.code}`);
  window.location.href = 'otp.html';
}

async function verifyHandler(e) {
  e.preventDefault();
  const email = document.querySelector('#email')?.value.trim();
  const code = document.querySelector('#code')?.value.trim();
  if (!email || !code) {
    return showAlert('Please enter your email and OTP code.');
  }

  await postJSON(`${API_BASE}/auth/verify-code`, { email, code, type: 'customer' });
  document.getElementById('otpForm')?.classList.add('hidden');
  document.getElementById('resetForm')?.classList.remove('hidden');
  document.getElementById('resetEmail').value = email;
  showAlert('OTP verified. Please set a new password.');
}

async function resetPasswordHandler(e) {
  e.preventDefault();
  const email = document.querySelector('#resetEmail')?.value.trim();
  const newPassword = document.querySelector('#newPassword')?.value;
  const confirmPassword = document.querySelector('#confirmPassword')?.value;

  if (!email || !newPassword || !confirmPassword) {
    return showAlert('Please complete all fields.');
  }
  if (newPassword !== confirmPassword) {
    return showAlert('Passwords do not match.');
  }

  await postJSON(`${API_BASE}/auth/reset`, { email, newPassword, type: 'customer' });
  showAlert('Password reset successful. Please log in.');
  window.location.href = 'index.html';
}

function showOTP() {
  document.getElementById('resetForm')?.classList.add('hidden');
  document.getElementById('otpForm')?.classList.remove('hidden');
}

// Wire forms if present
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.matches('#loginForm')) return loginHandler(e);
  if (form.matches('#registerForm')) return registerHandler(e);
  if (form.matches('#vendorRegisterForm')) return vendorRegisterHandler(e);
  if (form.matches('#forgotForm')) return forgotHandler(e);
  if (form.matches('#otpForm')) return verifyHandler(e);
  if (form.matches('#resetForm')) return resetPasswordHandler(e);
});
