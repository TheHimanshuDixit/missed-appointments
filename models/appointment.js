const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  appointmentTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["scheduled", "missed", "rescheduled"],
    default: "scheduled",
  },
  rescheduledTime: Date,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
