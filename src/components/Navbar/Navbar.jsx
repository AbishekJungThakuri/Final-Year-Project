import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/loginAuth/authThunks";

export default function Navbar() {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const {user, isAuthenticated, error, loading} = useSelector(state => state.auth);

  //  console.log(user)
   
    const handleLogout = () => {
       dispatch(logoutUser());
     };
   

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white">
      <div onClick={()=>navigate('/')} className="text-xl font-bold cursor-pointer">
        <span className="text-red-500">Holiday</span>Nepal
      </div>
      <div className="space-x-6">
        <Link to={'/'}>Home</Link>
        <Link to={'/packages'}>Packages</Link>
        <Link to={'/places'}>Places</Link>
        <Link to={'/activities'}>Activities</Link>
        <Link to={'/events'}>Events</Link>
      </div>
      <div className="flex items-center space-x-3">
         
         {
          isAuthenticated ? 
            <div className="flex gap-5 items-center">
                <button onClick={handleLogout} className="cursor-pointer px-3 py-1 border rounded-full">Logout</button>
                <h1 className="text-xl font-semibold">Hello {user.username}</h1>
            </div> :
            <div>
              <Link to={'/login'} className="px-3 py-1 border rounded-full">Login</Link>
              <Link to={'/signup'} className="px-3 py-1 bg-white text-black rounded-full">Signup</Link>
            </div>
         }
      </div>
    </nav>
  );
}
