const mongoose = require('mongoose');
const { Schema, model } = require("mongoose")
const userSchema = new Schema({
  name: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  password: { type: String, required: true },
  validEmail: { type: Boolean, default: false }
},
  { timestamps: true } //createdAt, updatedAt
);

const User = model("User", userSchema);
module.exports = User
