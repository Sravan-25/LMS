const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'STAFF' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  hoursWorked: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);
module.exports = Timesheet;
