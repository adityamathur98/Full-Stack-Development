import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import DashBoard from "./components/DashBoard";

import "./App.css";

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Signup />} />
    <Route path="/dashboard" element={<DashBoard />} />
  </Routes>
);

export default App;
