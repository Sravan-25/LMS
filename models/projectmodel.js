const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not started',
  },

  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
