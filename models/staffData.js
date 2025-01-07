const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    dateOfJoining: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Inactive', 'On Leave'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('STAFF', staffSchema);
