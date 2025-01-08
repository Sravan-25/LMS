const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  uploadedAt: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
