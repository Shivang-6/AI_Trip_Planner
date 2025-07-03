const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  displayName: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now },
  itineraries: [{ type: Schema.Types.Mixed }]
});

const User = mongoose.model('User', userSchema);

module.exports = User; 