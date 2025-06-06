
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  id: Number,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
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
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
