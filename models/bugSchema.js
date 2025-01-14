const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open',
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Bug = mongoose.model('Bug', bugSchema);
module.exports = Bug;


