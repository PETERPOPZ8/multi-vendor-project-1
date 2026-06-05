const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    if (uri === 'memory' || uri.includes('cluster0.k21z4ql.mongodb.net')) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Using local in-memory MongoDB');
    }
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const User = require('../models/user');
    const Vendor = require('../models/vendor');
    const bcrypt = require('bcryptjs');
    if ((await User.countDocuments()) === 0) {
      console.log('Seeding initial admin and vendor...');
      const adminPassword = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin', email: 'admin@site.com', password: adminPassword, role: 'admin' });
      const vendorPassword = await bcrypt.hash('vendor123', 10);
      await Vendor.create({ storeName: 'Default Store', ownerName: 'Vendor One', email: 'vendor@site.com', password: vendorPassword, approvalStatus: 'approved' });
      console.log('Seeded admin@site.com / admin123 and vendor@site.com / vendor123');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
