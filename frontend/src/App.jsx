import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Login } from "./pages/Login/Login";
import { Signup } from "./pages/SignUp/Signup";
import { Home } from "./pages/Home/Home";
import Plan from './pages/Plan/Plan'
import ForgetPassword from "./components/AuthComp/ForgetPassword";
import ResetPassword from "./components/AuthComp/ResetPassword";
import GoogleCallbackPage from "./components/AuthComp/GoogleCallBack";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import PageNotFound from "./PageNotFound/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./Layout/Layout";
import { fetchUserProfile } from "./features/auth/loginAuth/authThunks";
import { Package } from "./pages/PublicPages/Package";
import  Place  from "./pages/PublicPages/Place";
import  Activities  from "./pages/PublicPages/Activities";
import { Events } from "./pages/PublicPages/Events";
import AdminDashboard from "./Admin/adminPages/Dashboard";
import AllUsers from "./Admin/adminPages/AllUsers";
import AllPlaces from "./Admin/adminPages/AllPlaces";
import AllActivities from "./Admin/adminPages/AllActivites";
import ServiceProvider from "./Admin/adminPages/ServiceProviders";
import AccommodationProvider from "./Admin/adminPages/AccomodationProviders";
import { LogOut, Settings } from "lucide-react";
import AdminLayout from "./Admin/adminPages/AdminLayout";


function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [token, isAuthenticated, dispatch]);

  return (
   <BrowserRouter>
      <Routes>
      {/* Public routes without Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forget_password" element={<ForgetPassword />} />
      <Route path="/forget_password/:token" element={<ResetPassword />} />
      <Route path="/google-callback" element={<GoogleCallbackPage />} />

      

      {/* Routes with Navbar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
         <Route path="/packages" element={<Package/>} />
         <Route path="/activities" element={<Activities/>} />
         <Route path="/events" element={<Events/>} />
         <Route path="/places" element={<Place/>} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/plan/:id" element={<Plan/>} />
            <Route path="/plan" element={<Plan/>} />
        </Route>
      </Route>


      <Route element={<AdminLayout/>}>
          {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/allUsers" element = {<AllUsers />}/>
          <Route path="/allPlaces" element = {<AllPlaces />}/>
          <Route path="/allActivities" element = {<AllActivities />}/>
          <Route path="/serviceproviders" element = {<ServiceProvider />}/>
          <Route path="/accommodationProviders" element = {<AccommodationProvider />}/>
          <Route path="/settings" element = {<Settings />}/>
          <Route path="/logout" element = {<LogOut />}/>
        </Route>
      </Route>

      

      {/* Catch-all route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

