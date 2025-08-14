import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import UserProvider from "./context/userProvider";
// import UserProvider from './context/UserProvider.js';

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <StrictMode>
      <App />
      <ToastContainer position="top-center" autoClose={3000} />
    </StrictMode>
  </UserProvider>
);
