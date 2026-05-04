const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // This will be the Enrollment Number
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentPhone: { type: String, required: true },
  studentCollege: { type: String },
  studentBranch: { type: String },
  studentSemester: { type: String },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookName: { type: String, required: true },
  rentalDays: { type: Number, required: true },
  requestDate: { type: String, required: true },
  status: { type: String, default: 'Pending' }, 
  approvedCost: { type: Number, default: null },
  rejectionReason: { type: String, default: null }
});

module.exports = mongoose.model('Request', requestSchema);
