const express = require("express");
const {
  detectNoShows,
  findAvailableSlots,
  rescheduleAppointment,
} = require("../controllers/appointmentController");
const router = express.Router();

router.get("/no-shows", async (req, res) => {
  const missedAppointments = await detectNoShows();
  res.status(200).json(missedAppointments);
});

router.get("/available-slots/:doctorName", async (req, res) => {
  const slots = await findAvailableSlots(req.params.doctorName);
  res.status(200).json(slots);
});

router.post("/reschedule", rescheduleAppointment);

module.exports = router;
