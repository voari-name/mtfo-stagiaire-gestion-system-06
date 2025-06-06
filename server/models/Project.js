
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'not-started'],
    default: 'not-started'
  }
});

const projectInternSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: {
    type: String,
    enum: ['début', 'en cours', 'fin'],
    default: 'début'
  },
  completion: {
    type: Number,
    default: 0
  }
});

const projectSchema = new mongoose.Schema({
  id: Number,
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  description: String,
  interns: [projectInternSchema],
  tasks: [taskSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
