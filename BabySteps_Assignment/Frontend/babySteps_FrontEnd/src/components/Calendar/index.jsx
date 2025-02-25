import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = () => {
  const { doctorId } = useParams();
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/doctors/${doctorId}/slots?date=${
          date.toISOString().split("T")[0]
        }`
      )
      .then((response) => {
        console.log(response);
        setSlots(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [doctorId, date]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-4xl font-bold text-blue-800 text-center mb-6">
          Available Slots
        </h2>

        <div className="flex flex-col items-center mb-6">
          <p className="text-gray-700 text-lg font-medium">Select a date:</p>
          <DatePicker
            selected={date}
            onChange={setDate}
            className="mt-2 p-3 rounded-md broder borde-gray-300 shadow-sm w-64 text-center"
          />
        </div>

        <h3 className="text-2xl font-medium text-gray-800 text-center mb-4">
          Time Slots for {doctorId}
        </h3>

        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-600 text-center mt-4">
            No Slots Available for the selected date.
          </p>
        ) : (
          <ul className="flex flex-wrap justify-center gap-6 mt-4">
            {slots.map((eachSlot) => (
              <li
                key={eachSlot.start}
                className="bg-white p-6 rounded-lg shadow-xl transition-all duration-300 border border-gray-200 w-64 text-center hover:scale-105">
                <span className="text-lg font-semibold text-gray-700">
                  {eachSlot.start} - {eachSlot.end}
                </span>
                <Link
                  to={`/book/${doctorId}/${date.toISOString().split("T")[0]}`}
                  className="mt-3 inline-block bg-blue-600 text-white text-lg font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-all">
                  Book Appointment
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Calendar;
