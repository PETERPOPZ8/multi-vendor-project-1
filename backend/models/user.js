const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  { timestamps: true }
);

userSchema.add({
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
