const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/user');
const Category = require('./models/Category');
const Product = require('./models/product');
const Vendor = require('./models/vendor');

dotenv.config();
connectDB();

const seed = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Vendor.deleteMany();

    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@site.com', password: adminPassword, role: 'admin' });

    const vendorPassword = await bcrypt.hash('vendor123', 10);
    const vendor = await Vendor.create({
      storeName: 'Default Store',
      ownerName: 'Vendor One',
      email: 'vendor@site.com',
      password: vendorPassword,
      approvalStatus: 'approved',
    });

    const categories = await Category.insertMany([
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Books' },
    ]);

    const products = [
      {
        title: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        category: categories[0]._id,
        vendor: vendor._id,
        price: 1999,
        stock: 50,
        images: [],
        featured: true,
      },
      {
        title: 'T-Shirt',
        description: '100% cotton t-shirt',
        category: categories[1]._id,
        vendor: vendor._id,
        price: 499,
        stock: 100,
      },
      {
        title: 'Novel',
        description: 'Bestselling novel',
        category: categories[2]._id,
        vendor: vendor._id,
        price: 299,
        stock: 20,
      },
    ];

    await Product.insertMany(products);

    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
