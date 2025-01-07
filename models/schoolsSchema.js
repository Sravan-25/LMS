const mongoose = require('mongoose');

const SchoolsSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  address: { type: String, required: true },
  principalName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  file: { type: String, required: true }, 
});

module.exports = mongoose.model('Schools', SchoolsSchema);
