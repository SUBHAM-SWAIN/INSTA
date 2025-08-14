import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Mainlayout from "./components/Mainlayout";
import Home from "./components/Home";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/" element={<Mainlayout />}>
          {/* Nested routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
