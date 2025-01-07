const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, // Reference to Task model
  hoursWorked: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String }, // Optional description of work done
  createdAt: { type: Date, default: Date.now },
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);
module.exports = Timesheet;
