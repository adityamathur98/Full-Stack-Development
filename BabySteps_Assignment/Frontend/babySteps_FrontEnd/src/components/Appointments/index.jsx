import React, { useState, useEffect } from "react";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/appointments")
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 mt-10">
      <h2 className="text-3xl font-bold mb-4">Upcoming Appointments</h2>
      <ul className="flex flex-col gap-4">
        {appointments.map((appointment) => (
          <li
            key={appointment._id}
            className="bg-gray-100 p-4 rounded-md shadow-md">
            <span className="text-lg">
              {appointment.patientName} - {appointment.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
