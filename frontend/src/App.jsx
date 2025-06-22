import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Login } from "./pages/Login/Login";
import { Signup } from "./pages/SignUp/Signup";
import Navbar from "./components/Navbar/Navbar";
import { Home } from "./pages/Home/Home";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
