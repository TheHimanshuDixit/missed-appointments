const express = require("express");
const connectDB = require("./config/db");
const appointmentRoutes = require("./routes/appointmentRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/appointments", appointmentRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
