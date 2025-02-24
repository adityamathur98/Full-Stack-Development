const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  specialization: { type: String },
});

module.exports = mongoose.model("doctors", doctorSchema);
