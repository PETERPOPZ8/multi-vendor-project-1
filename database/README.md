# Database Setup

This folder contains the MongoDB setup script for the Multi Vendor project.

## Run the setup

From the project root, run:

```powershell
cd database
node seedDatabase.js
```

## What it does

- Creates collections for:
  - users
  - vendors
  - categories
  - products
  - carts
  - wishlists
  - orders
  - payments
  - coupons
  - reviews
  - wallets
- Creates unique indexes for:
  - users.email
  - vendors.email
  - categories.name
  - coupons.code
- Seeds sample data for:
  - admin user
  - category
  - vendor

## Requirements

- Ensure `backend/.env` exists with a valid `MONGO_URI`
- Run from the project root so the environment file can be loaded
