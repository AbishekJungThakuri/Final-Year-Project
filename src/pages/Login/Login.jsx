import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import googlelogo from "../../assets/images/googlelogo.png";
import bg_image from "../../assets/images/homepagebg.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/loginAuth/authThunks";
import { getGoogleUrl } from "../../features/auth/loginAuth/authThunks";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email_or_username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, user, role, error } = useSelector(
    (state) => state.auth
  );

  const { googleUrl } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getGoogleUrl());
  }, [dispatch]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "OAUTH_SUCCESS") {
        window.location.href = "/";
      } else if (event.data?.type === "OAUTH_ERROR") {
        navigate("/login?error=oauth_failed");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)); // 👈 async, don’t navigate here
  };

  // 👇 navigate after Redux state updates
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === "admin") {
        navigate("/allPlaces");
      } else if (role === "user") {
        navigate("/");
      }
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    let timer;
    if (showPassword) {
      timer = setTimeout(() => {
        setShowPassword(false);
      }, 1000); // Auto-hide after 1 second
    }
    return () => clearTimeout(timer);
  }, [showPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative px-4">
      {/* Logo */}
      <h1
        className="absolute top-4 left-4 text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-red-500">Holiday</span>
        <span className="text-gray-800">Nepal</span>
      </h1>

      {/* Background Image Layer */}
      <div
        className="absolute inset-0 opacity-10 bg-no-repeat bg-bottom bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${bg_image})` }}
      ></div>

      {/* Main Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-gray-200 p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md z-10"
      >
        <h2 className="text-xl sm:text-xl font-medium text-center mb-6 sm:mb-8">
          Welcome back !
        </h2>

        {/* Username Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            name="email_or_username"
            className="w-full mt-1 px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-red-400"
            placeholder="username or Email"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="text-sm text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full mt-1 px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-red-400 pr-10"
            placeholder="Enter your password"
            required
          />
          {formData.password.length > 0 && (
            <div
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          )}
          <Link
            to={"/forget_password"}
            className="text-right text-xs mt-1 text-gray-500 hover:underline cursor-pointer"
          >
            forgot password ?
          </Link>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 mt-2">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl hover:bg-red-600 transition duration-200 mt-2 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Google Sign-In */}

        {googleUrl && (
          <button
            type="button"
            onClick={() => {
              const width = 400;
              const height = 500;
              const left = window.screenX + (window.outerWidth - width) / 2;
              const top = window.screenY + (window.outerHeight - height) / 2;

              window.open(
                googleUrl,
                "GoogleSignIn",
                `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
              );
            }}
            className="w-full mt-4 flex items-center justify-center border-2 py-2 border-gray-200 rounded-xl hover:bg-gray-100 transition duration-200 text-sm cursor-pointer "
          >
            <img src={googlelogo} alt="Google logo" className="mr-2" />
            Sign in with Google
          </button>
        )}

        {/* Sign Up */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account ?
          <span
            onClick={() => navigate("/signup")}
            className="text-red-500 ml-1 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </div>
      </form>
    </div>
  );
};
