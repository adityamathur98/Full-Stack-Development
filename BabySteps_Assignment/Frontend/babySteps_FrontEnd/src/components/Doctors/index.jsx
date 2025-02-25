import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { FaUserMd, FaClock } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/doctors")
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6">
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-4xl font-bold text-blue-800 text-center mb-6">
          Our Doctors
        </h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <ul className="flex flex-wrap justify-start gap-6">
          {doctors.map((doctor) => (
            <li
              key={doctor._id}
              className="bg-white p-6 rounded-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 w-72">
              <div className="flex items-center gap-3">
                <FaUserMd className="text-blue-700 text-3xl" />
                <Link
                  to={`/calendar/${doctor._id}`}
                  className="text-xl font-semibold text-blue-700 hover:underline">
                  {doctor.name}
                </Link>
              </div>
              <p className="text-gray-600 mt-2">
                <strong>Specialization:</strong>{" "}
                {doctor.specialization || "Not Specified"}
              </p>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <FaClock className="text-gray-500" />
                <strong>Working Hours:</strong> {doctor.workingHours.startTime}{" "}
                - {doctor.workingHours.endTime}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Doctors;
