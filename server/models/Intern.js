
const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  id: Number,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  email: String,
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['début', 'en cours', 'fin'],
    default: 'début'
  },
  gender: {
    type: String,
    enum: ['Masculin', 'Féminin'],
    required: true
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Intern', internSchema);
