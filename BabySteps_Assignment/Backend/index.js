require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { format } = require("date-fns");

const app = express();
app.use(express.json());
app.use(cors());

const moment = require("moment");

if (!process.env.MONGO_URI) {
  console.log("MONGO_URI is not defined in environment Variable.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDb"))
  .catch((error) => {
    console.log("DB Connection Error:", error.message);
    process.exit(1);
  });

const Doctor = require("./model/doctor");
const Appointment = require("./model/appointment");

app.listen(3000, () => console.log("Server running at http://localhost:3000/"));

//Get Doctors Api
app.get("/doctors", async (request, response) => {
  try {
    const doctors = await Doctor.find();
    response.status(200).json(doctors);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

//Get Available Slots Api
app.get("/doctors/:id/slots", async (request, response) => {
  try {
    const doctorId = request.params.id;
    const date = request.query.date;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return response.status(404).json({ message: "Doctor not Found" });
    }

    const start = moment(
      `${date} ${doctor.workingHours.startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const end = moment(
      `${date} ${doctor.workingHours.endTime}`,
      "YYYY-MM-DD HH:mm"
    );

    const duration = 30;

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: start.toDate(), $lt: end.toDate() },
    });

    const slots = [];

    for (
      let time = start.clone;
      time.isBefore(end);
      time.add(duration, "minutes")
    ) {
      const slotStart = time.clone();
      const slotEnd = time.clone().add(duration, "minutes");
      const isAvailable = !appointments.some((appointment) => {
        return (
          slotStart.isBetween(
            appointment.date,
            moment(appointment.date).add(appointment.duration, "minutes")
          ) ||
          slotEnd.isBetween(
            appointment.date,
            moment(appointment.date).add(appointment.duration, "minutes")
          )
        );
      });

      if (isAvailable) {
        slots.push({
          start: slotStart.format("HH:mm"),
          end: slotEnd.format("HH:mm"),
        });
      }
    }
    response.json(slots);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

//create Doctor Api
app.post("/doctors", async (request, response) => {
  try {
    const { name, specialization, startTime, endTime } = request.body;

    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      return response
        .status(400)
        .json({ error: "Invalid time format. Use HH:mm." });
    }

    const newDoctor = new Doctor({
      name,
      workingHours: {
        startTime,
        endTime,
      },
      specialization,
    });
    await newDoctor.save();
    response
      .status(201)
      .json({ message: "Doctor Added Successfully", doctor: newDoctor });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

//Get Appointments Api
app.get("/appointments", async (request, response) => {
  try {
    const appointments = await Appointment.find();
    response.status(200).json(appointments);
  } catch (error) {
    response.status(500).json({ message: "Failed to fetch Appointment" });
  }
});

//Get A Appointment details API
app.get("/appointments/:id", async (request, response) => {
  try {
    const appointmentId = request.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return response.status(404).json({ message: "Appointment not found" });
    }
    response.status(200).json(appointment);
  } catch (error) {
    response.status(500).json({ message: "Failed to fetch appointment" });
  }
});

//Create New Appointment Api
app.post("/appointments", async (request, response) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } =
      request.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      response.status(404).json({ message: "Doctor Not Found" });
    }

    const start = moment(date);
    const end = moment(date).add(duration, "minutes");
    const existingAppointments = await Appointment.find({
      doctorId,
      date: { $gte: start.toDate(), $lt: end.toDate() },
    });

    if (
      existingAppointments.some((appointment) => {
        return (
          start.isBetween(
            appointment.date,
            moment(appointment.date).add(appointment.duration, "minutes")
          ) ||
          end.isBetween(
            appointment.date,
            moment(appointment.date).add(appointment.duration, "minutes")
          )
        );
      })
    ) {
      return response
        .status(400)
        .json({ message: "Time slot is not available" });
    }

    const appointment = new Appointment({
      doctorId,
      date: start.toDate(),
      duration,
      appointmentType,
      patientName,
      notes,
    });
    await appointment.save();
    response.json(appointment);
  } catch (error) {
    response.status(500).json({ message: "Failed to create appointment" });
  }
});

//Update A Appointment Api
app.put("/appointments/:id", async (request, response) => {
  try {
    const appointmentId = request.params.id;
    const { date, duration } = request.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      response.status(404).json({ message: "Appointment not found" });
    }

    const start = moment(date);
    const end = moment(date).add(duration, "minutes");
    const existingAppointments = await Appointment.find({
      _id: { $ne: appointmentId },
      doctorId: appointment.doctorId,
      date: { $gte: start.toDate(), $lt: end.toDate() },
    });

    if (
      existingAppointments.some((appointment) => {
        return (
          start.isBetween(
            appointment.date,
            moment(appointment.date).add(appointment.duration, "minutes")
          ) ||
          end.isBetween(
            appointment.date,
            moment(appointment.date).add(appointment.duration, "minutes")
          )
        );
      })
    ) {
      return response
        .status(400)
        .json({ message: "Updated time slot is not available" });
    }

    appointment.date = start.toDate();
    appointment.duration = duration;
    await appointment.save();
    response.json(appointment);
  } catch (error) {
    response.status(500).json({ message: "Failed to Update appointment" });
  }
});

//Cancel An Appointment Api
app.delete("/appointment/:id", async (request, response) => {
  try {
    const appointmentId = request.params.id;
    await Appointment.findByIdAndDelete(appointmentId);
    response.json({ message: "Appointment deleted Successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
