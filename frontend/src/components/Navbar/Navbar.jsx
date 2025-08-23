import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white">
      <div className="text-xl font-bold">
        <span className="text-red-500">Holiday</span>Nepal
      </div>
      <div className="space-x-6">
        <a href="#">Home</a>
        <a href="#">Packages</a>
        <a href="#">Places</a>
        <a href="#">Activities</a>
        <a href="#">Events</a>
      </div>
      <div className="flex items-center space-x-3">
      
        <Link to={'/login'} className="px-3 py-1 border rounded-full">Login</Link>
        <Link to={'/signup'} className="px-3 py-1 bg-white text-black rounded-full">
          Signup
        </Link>
      </div>
    </nav>
  );
}
