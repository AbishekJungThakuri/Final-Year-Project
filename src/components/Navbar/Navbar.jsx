import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../features/auth/loginAuth/authThunks";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, role } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  return (
    <nav className="fixed w-full top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 bg-white/90 backdrop-blur-md shadow-md">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer"
      >
        <h1
          className="absolute top-4 left-4 text-xl font-semibold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-red-500">Holiday</span>
          <span className="text-gray-800">Nepal</span>
        </h1>
      </div>

      {/* Right Section (Links + Auth/Profile) */}
      <div className="flex items-center space-x-8 font-medium text-gray-700">
        <Link to="/">Home</Link>
        <Link to="/plans">Plans</Link>
        <Link to="/saved">Saved</Link>
        <Link to="/profile">Profile</Link>

        {role=="admin"?(
          <Link to="/allPlaces">Admin</Link>
        ):null}

        <div onClick={() => navigate("/profile")} className="cursor-pointer">
          {user?.image?.url ? (
            <img
              src={user.image.url}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold uppercase">
              {user?.username?.[0] || "?"}
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}
