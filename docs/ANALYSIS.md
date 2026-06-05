Project Analysis Report

Detected frontend pages and primary workflows:

- Authentication: index.html (login), register.html (customer), vendor.html (vendor register), forgot.html, otp.html
- Customer: enter.html, home.html, filter.html, vino.html, checkout.html, payment.html, order.html
- Admin: admin.html, dashboard.html, product.html, coupon.html, reviews.html, wallet.html, settings.html

Forms and fields:
- Login pages: expect `email`, `password` fields
- Registration pages: customer -> `name`, `email`, `password`; vendor -> `storeName`, `ownerName`, `email`, `password`
- Forgot/OTP: `email`, `code`, `newPassword`
- Product pages: search input `#search`, product create forms expected `title`, `description`, `price`, `stock`, `category`, `images` file input
- Cart/checkout: add-to-cart buttons with `.add-to-cart` and `data-product-id`; checkout form `#checkoutForm` with `#shippingAddress` and payment method radios

Backend will expose REST APIs under `/api` to cover authentication, products, cart, orders, payments, reviews, coupons, vendors, wallets, and admin operations.
