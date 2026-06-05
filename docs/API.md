API Documentation (selected endpoints)

Auth
- POST /api/auth/register - Register customer
- POST /api/auth/login - Login customer
- POST /api/auth/vendor/register - Register vendor
- POST /api/auth/vendor/login - Login vendor
- POST /api/auth/admin/login - Login admin (admin is a user with role=admin)
- POST /api/auth/forgot - Generate reset code (body: { email, type })
- POST /api/auth/verify-code - Verify reset code (body: { email, code, type })
- POST /api/auth/reset - Reset password (body: { email, newPassword, type })

Products
- POST /api/products - Create product (protected, supports multipart form-data with images)
- GET /api/products - List products (query: search, category, min, max, featured)
- GET /api/products/:id - Get product
- PUT /api/products/:id - Update product (protected)
- DELETE /api/products/:id - Delete product (protected)

Cart
- POST /api/cart/add - Add item to cart (protected)
- GET /api/cart - Get current user's cart (protected)
- PUT /api/cart/update - Update quantity (protected)
- DELETE /api/cart/remove - Remove item (protected)

Orders
- POST /api/orders - Create order from cart (protected)
- GET /api/orders - Get orders (protected; admin sees all)
- GET /api/orders/:id - Get single order (protected)
- PUT /api/orders/:id/status - Update order status (protected)

Payments
- POST /api/payments/razorpay - Create Razorpay order (protected)
- POST /api/payments/cod - Confirm COD payment (protected)

Reviews
- POST /api/reviews - Add review (protected)
- GET /api/reviews/product/:productId - Get reviews for product

Coupons
- POST /api/coupons - Create coupon (protected)
- GET /api/coupons - List coupons
- POST /api/coupons/apply - Apply coupon (protected)

Vendors
- GET /api/vendors/me - Vendor profile (protected)
- GET /api/vendors/products - Vendor products (protected)
- GET /api/vendors/orders - Vendor orders (protected)

Wallets
- GET /api/wallets - Get vendor wallet (protected)
- POST /api/wallets/transactions - Add wallet transaction (protected)

Admin
- GET /api/admin/stats - Dashboard stats (protected, admin)
- GET /api/admin/vendors - Manage vendors (protected, admin)
- PUT /api/admin/vendors/:id/approve - Approve vendor (admin)
- PUT /api/admin/vendors/:id/reject - Reject vendor (admin)
