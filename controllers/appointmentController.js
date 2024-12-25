const Appointment = require("../models/appointment");
const moment = require("moment");

// Notify via email (dummy function)
const notifyPatient = async (email, message) => {
  console.log(`Notification sent to ${email}: ${message}`);
};

// Detect no-shows
const detectNoShows = async () => {
  const now = new Date();
  const gracePeriod = moment(now).subtract(15, "minutes");
  const missedAppointments = await Appointment.find({
    appointmentTime: { $lt: gracePeriod },
    status: "scheduled",
  });

  for (const appointment of missedAppointments) {
    appointment.status = "missed";
    await appointment.save();
    await notifyPatient(
      "patient@example.com",
      "You missed your appointment. Please reschedule."
    );
  }
  return missedAppointments;
};

// Find available slots
const findAvailableSlots = async (doctorName) => {
  // Dummy logic for simplicity
  const now = moment();
  return [now.add(1, "hours").toISOString(), now.add(2, "hours").toISOString()];
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
  const { appointmentId, newTime } = req.body;

  try {
    // Find the appointment to be rescheduled
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "missed") {
      return res
        .status(400)
        .json({ message: "Only missed appointments can be rescheduled" });
    }

    // Check for conflicts (existing appointments at the same time for the same doctor)
    const conflict = await Appointment.findOne({
      doctorName: appointment.doctorName,
      appointmentTime: newTime,
      status: { $in: ["scheduled", "rescheduled"] },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "The selected time slot is already booked" });
    }

    // No conflict, proceed with rescheduling
    appointment.rescheduledTime = newTime;
    appointment.status = "rescheduled";
    appointment.appointmentTime = newTime; // Update the original time for simplicity
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment rescheduled successfully", appointment });
  } catch (error) {
    console.error("Error during rescheduling:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  detectNoShows,
  findAvailableSlots,
  rescheduleAppointment,
};
