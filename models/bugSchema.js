const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' }, // Reference to User model
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' }, // Reference to User model
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
  // project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // Reference to Project model
  project: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Bug = mongoose.model('Bug', bugSchema);
module.exports = Bug;
