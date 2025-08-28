import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
   const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white">
      <div onClick={()=>navigate('/')} className="text-xl font-bold cursor-pointer">
        <span className="text-red-500">Holiday</span>Nepal
      </div>
      <div className="space-x-6">
        <Link to={'/'}>Home</Link>
        <Link>Packages</Link>
        <Link>Places</Link>
        <Link>Activities</Link>
        <Link>Events</Link>
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
