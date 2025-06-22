import React, { useEffect, useState } from 'react';
import googlelogo from '../../assets/image/googlelogo.png';
import bg_image from '../../assets/image/homepagebg.png';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  useEffect(()=>{
     let timer;
     if(showPassword){
        timer = setTimeout(() => {
            setShowPassword(false);
        }, (1000));
     }

     return () => clearTimeout(timer);
  },[showPassword])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative px-4">
      {/* Logo */}
      <h1 onClick={()=>navigate('/')} className="absolute top-4 left-4 sm:top-6 sm:left-10 text-xl sm:text-2xl font-semibold z-20 cursor-pointer">
        <span className="text-red-500">Holiday</span>
        <span className="text-gray-800">Nepal</span>
      </h1>

      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-10 bg-no-repeat bg-bottom bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${bg_image})` }}
      ></div>

      {/* Signup Card */}
      <div className="bg-white border border-gray-300 px-6 py-8 rounded-3xl shadow-md w-full max-w-md z-10 text-center">
        <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

        <form>
          {/* Name */}
          <div className="mb-4 text-left">
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border-2 border-gray-400 rounded-full outline-none  focus:border-red-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="mb-4 text-left">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border-2 border-gray-400 rounded-full  outline-none  focus:border-red-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-6 text-left relative">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border-2 border-gray-400 rounded-full outline-none focus:border-red-400 pr-10"
              placeholder="Enter your password"
            />
            {
              password.length > 0 && (
                <div
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
              )
            }
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition duration-200"
          >
            Sign up
          </button>

          {/* Google Sign In */}
          <button
            type="button"
            className="w-full mt-4 flex items-center justify-center border-2 border-gray-400 py-2 rounded-full hover:bg-gray-100 transition duration-200 text-sm"
          >
            <img src={googlelogo} alt="Google logo" className="mr-2 w-5 h-5" />
            Signin with Google
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-600 mt-6">
          Already have an account ?{' '}
          <span className="text-red-500 hover:underline cursor-pointer">Login</span>
        </p>
      </div>
    </div>
  );
};
