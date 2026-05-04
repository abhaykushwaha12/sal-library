const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  college: { type: String },
  enrollmentNo: { type: String },
  branch: { type: String },
  semester: { type: String },
  phone: { type: String }
});

module.exports = mongoose.model('User', userSchema);
