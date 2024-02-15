// models/query.js
const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  message: String,
  // Add other query data fields as needed
});

module.exports = mongoose.model('Query', querySchema);
