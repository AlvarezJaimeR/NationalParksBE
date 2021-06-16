const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema({
  text: { type: String },
  date: {type: Date, default:Date.now},
});

const Park = mongoose.model("Park", parkSchema);

exports.Park = Park;
exports.parkSchema = parkSchema;