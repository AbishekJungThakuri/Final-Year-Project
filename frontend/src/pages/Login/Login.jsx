import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import googlelogo from '../../assets/image/googlelogo.png';
import bg_image from '../../assets/image/homepagebg.png';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

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
      <h1 onClick={()=>navigate('/')} className="absolute top-4 left-4 sm:top-5 sm:left-8 text-xl sm:text-2xl font-semibold z-20 cursor-pointer">
        <span className="text-red-500">Holiday</span>
        <span className="text-gray-800">Nepal</span>
      </h1>

      {/* Background Image Layer */}
      <div
        className="absolute inset-0 opacity-10 bg-no-repeat bg-bottom bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${bg_image})` }}
      ></div>

      {/* Main Container */}
      <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md z-10">
        <h2 className="text-xl sm:text-xl font-medium text-center mb-6 sm:mb-8">
          Welcome back !
        </h2>

        {/* Username Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            className="w-full mt-1 px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-red-400"
            placeholder="Enter your username"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="text-sm text-gray-700">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-red-400 pr-10"
            placeholder="Enter your password"
          />
          {password.length > 0 && (
            <div
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          )}
          <div className="text-right text-xs mt-1 text-gray-500 hover:underline cursor-pointer">
            forgot password ?
          </div>
        </div>

        {/* Login Button */}
        <button className="w-full bg-black text-white py-2 rounded-xl hover:bg-red-600 transition duration-200 mt-2">
          Login
        </button>

        {/* Google Sign-In */}
        <button className="w-full mt-4 flex items-center justify-center border-2 py-2 border-gray-200 rounded-xl hover:bg-gray-100 transition duration-200 text-sm">
          <img src={googlelogo} alt="Google logo" className="mr-2" />
          Sign in with Google
        </button>

        {/* Sign Up */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account ?
          <span onClick={()=>navigate('/signup')} className="text-red-500 ml-1 hover:underline cursor-pointer">
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};
