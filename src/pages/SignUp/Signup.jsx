import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import googlelogo from '../../assets/images/googlelogo.png';
import bg_image from '../../assets/images/homepagebg.png';
import { fetchCitiesThunk } from '../../features/plan/LocationSlice';
import VerifyEmailForm from '../../components/AuthComp/VerifyEmailForm';
import { register } from '../../features/auth/registerAuth/registerSlice';
import { useNavigate } from 'react-router-dom';
import {getGoogleUrl} from '../../features/auth/loginAuth/authThunks'


export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  const dispatch = useDispatch();
  const { cities, status } = useSelector((state) => state.location);
  const { loading, user, emailVerified, error } = useSelector((state) => state.register);

  const { googleUrl } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getGoogleUrl());
  }, [dispatch]);

  // Fetch cities on search
  useEffect(() => {
    if (citySearch.trim().length > 0) {
      const delayDebounce = setTimeout(() => {
        dispatch(fetchCitiesThunk({ search: citySearch }));
      }, 400);
      return () => clearTimeout(delayDebounce);
    }
  }, [citySearch, dispatch]);

  useEffect(() => {
    let timer;
    if (showPassword) {
      timer = setTimeout(() => {
        setShowPassword(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showPassword]);


  const {
    register: formRegister,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm();

    const onSubmit = (data) => {
    const payload = {
      ...data,
      city_id: selectedCity ? selectedCity.id : null,
    };

    dispatch(register(payload)).then((res) => {
      if (res.error) {
        // 🔹 Attach error to correct field
        if (res.payload?.field && res.payload?.message) {
          setError(res.payload.field, {
            type: 'manual',
            message: res.payload.message,
          });
        }
      }else{
      // Clear fields after success
      reset();
      setPassword("");
      setCitySearch("");
      setSelectedCity(null);
      }
    });


  };

  // Show verify email form
  if (!emailVerified && user?.status_code === 200) {
    return <VerifyEmailForm />;
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative px-4">
      {/* Logo */}
      <h1 className="absolute top-4 left-4 text-xl font-semibold cursor-pointer" onClick={()=>navigate('/')}>
        <span className="text-red-500">Holiday</span>
        <span className="text-gray-800">Nepal</span>
      </h1>

      {/* Background */}
      <div
        className="absolute inset-0 opacity-10 bg-no-repeat bg-bottom bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${bg_image})` }}
      />

      {/* Signup Card */}
      <div className="bg-white border px-6 py-8 rounded-3xl shadow-md w-full max-w-md z-10 text-center">
        <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-4 text-left">
            <label className="text-sm text-gray-700">Name</label>
            <input
              {...formRegister('username', { required: 'Username is required' })}
              className="w-full mt-1 px-4 py-2 border-2 border-gray-400 rounded-full outline-none focus:border-red-400"
              placeholder="Enter your name"
            />
            {errors.username && <p className="text-red-500 mt-3">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4 text-left">
            <label className="text-sm text-gray-700">Email</label>
            <input
              {...formRegister('email', {
            required: 'Email is required'
          })}
              className="w-full mt-1 px-4 py-2 border-2 border-gray-400 rounded-full outline-none focus:border-red-400"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 mt-3">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 text-left relative">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...formRegister('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border-2 border-gray-400 rounded-full outline-none focus:border-red-400 pr-10"
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
            {errors.password && <p className="text-red-500 mt-3">{errors.password.message}</p>}
          </div>

          {/* City Search */}
          <div className="mb-6 text-left relative">
            <label className="text-sm text-gray-700">City</label>
            <input
              type="text"
              value={selectedCity ? selectedCity.name : citySearch}
              onChange={(e) => {
                setSelectedCity(null); // reset selection
                setCitySearch(e.target.value);
                setValue('city_id', null);
              }}
              className="w-full mt-1 px-4 py-2 border-2 border-gray-400 rounded-full outline-none focus:border-red-400"
              placeholder="Search your city"
            />

            {/* Dropdown */}
            {citySearch.length > 0 && !selectedCity && (
              <ul className="absolute z-20 bg-white border border-gray-300 rounded-xl mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                {status === 'loading' && (
                  <li className="p-2 text-gray-500">Loading...</li>
                )}
                {cities.length > 0 ? (
                  cities.map((city) => (
                    <li
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        setCitySearch('');
                        setValue('city_id', city.id);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {city.name}
                    </li>
                  ))
                ) : (
                  status !== 'loading' && (
                    <li className="p-2 text-gray-500">No cities found</li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Global error fallback */}
         {error && !error.field && <p className="text-red-500 mb-1">{error.message || error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full hover:bg-red-600 transition duration-200 cursor-pointer"
          >
            Sign up
          </button>

          {/* Google Sign In */}
          {
            googleUrl && (
              <a href={googleUrl}>
                      <button
            type="button"
            className="w-full mt-4 flex items-center justify-center border-2 border-gray-400 py-2 cursor-pointer rounded-full hover:bg-gray-100 transition duration-200 text-sm"
          >
            <img src={googlelogo} alt="Google logo" className="mr-2 w-5 h-5" />
            Signin with Google
          </button>
              </a>
            )
          }
        </form>
      </div>
    </div>
  );
};
