// src/pages/GoogleCallbackPage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { googleCallback } from "../../features/auth/loginAuth/authThunks";

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=oauth_failed");
      return;
    }

    if (code) {
      dispatch(googleCallback(code))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    } else {
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Logging in with Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Authentication failed. Please try again.</p>
          </div>
          <button 
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Processing login...</p>
    </div>
  );
};

export default GoogleCallbackPage;