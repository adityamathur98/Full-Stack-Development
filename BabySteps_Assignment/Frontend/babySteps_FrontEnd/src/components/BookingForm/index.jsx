import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaUser, FaNotesMedical, FaCalendarCheck } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

function BookingForm() {
  const { doctorId, date } = useParams();
  const [patientName, setPatientName] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await axios.post("http://localhost:3000/appointments", {
        doctorId,
        date: new Date(`${date}T09:00:00.000Z`),
        duration: 30,
        appointmentType,
        patientName,
        notes,
      });
      setMessage("Appointment successfully booked!");
    } catch (err) {
      setError("Failed to book the appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Book an Appointment
        </h2>
        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block relative">
            <span className="text-lg font-medium">Patient Name:</span>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={patientName}
                onChange={(event) => setPatientName(event.target.value)}
                className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </label>

          <label className="block relative">
            <span className="text-lg font-medium">Appointment Type:</span>
            <div className="relative">
              <FaNotesMedical className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={appointmentType}
                onChange={(event) => setAppointmentType(event.target.value)}
                className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </label>

          <label className="block relative">
            <span className="text-lg font-medium">Notes:</span>
            <div className="relative">
              <FaCalendarCheck className="absolute left-3 top-3 text-gray-500" />
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"></textarea>
            </div>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md flex justify-center items-center"
            disabled={loading}>
            {loading ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              "Book Appointment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
