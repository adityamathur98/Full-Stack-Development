import React from "react";
import { Routes, Route } from "react-router-dom";

import Doctors from "./components/Doctors";
import Calendar from "./components/Calendar";
import BookingForm from "./components/BookingForm";
import Appointments from "./components/Appointments";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Doctors />} />
      <Route exact path="/calendar/:doctorId" element={<Calendar />} />
      <Route exact path="/book/:doctorId/:date" element={<BookingForm />} />
      <Route path="/appointments" element={<Appointments />} />
    </Routes>
  );
};

export default App;
