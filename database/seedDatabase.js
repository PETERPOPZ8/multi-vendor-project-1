const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../backend/.env');
dotenv.config({ path: envPath });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/multivendor';

const collections = [
  'users',
  'vendors',
  'categories',
  'products',
  'carts',
  'wishlists',
  'orders',
  'payments',
  'coupons',
  'reviews',
  'wallets',
];

const adminUser = {
  name: 'Admin',
  email: 'admin@acartz.com',
  phone: '9999999999',
  password: 'admin123',
  address: 'Admin Address',
  role: 'admin',
};

const sampleCategory = {
  name: 'Electronics',
  image: 'electronics.jpg',
};

const sampleVendor = {
  storeName: 'AcartZ Store',
  ownerName: 'Vendor Owner',
  email: 'vendor@acartz.com',
  phone: '8888888888',
  logo: 'vendor-logo.jpg',
  address: 'Vendor Address',
  approvalStatus: 'approved',
};

async function createCollections(db) {
  const existingCollections = await db.listCollections().toArray();
  const existingNames = existingCollections.map((c) => c.name);

  for (const collectionName of collections) {
    if (!existingNames.includes(collectionName)) {
      console.log(`Creating collection: ${collectionName}`);
      await db.createCollection(collectionName);
    } else {
      console.log(`Collection already exists: ${collectionName}`);
    }
  }
}

async function createIndexes(db) {
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('vendors').createIndex({ email: 1 }, { unique: true });
  await db.collection('categories').createIndex({ name: 1 }, { unique: true });
  await db.collection('coupons').createIndex({ code: 1 }, { unique: true });
}

async function seedSamples(db) {
  const userCount = await db.collection('users').countDocuments();
  if (userCount === 0) {
    console.log('Seeding admin user...');
    await db.collection('users').insertOne(adminUser);
  } else {
    console.log('Users already seeded.');
  }

  const categoryCount = await db.collection('categories').countDocuments();
  if (categoryCount === 0) {
    console.log('Seeding sample category...');
    await db.collection('categories').insertOne(sampleCategory);
  } else {
    console.log('Categories already seeded.');
  }

  const vendorCount = await db.collection('vendors').countDocuments();
  if (vendorCount === 0) {
    console.log('Seeding sample vendor...');
    await db.collection('vendors').insertOne(sampleVendor);
  } else {
    console.log('Vendors already seeded.');
  }
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    console.log(`Connected to MongoDB: ${MONGO_URI}`);

    await createCollections(db);
    await createIndexes(db);
    await seedSamples(db);

    console.log('Database setup complete.');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

run();
