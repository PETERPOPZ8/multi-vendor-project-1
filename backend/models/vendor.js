const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    logo: { type: String },
    address: { type: String },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

vendorSchema.add({
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
});

module.exports = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
