import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../features/auth/loginAuth/authThunks";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSuccess("");
    dispatch(forgetPassword(email))
      .unwrap()
      .then(() => {
        setLocalSuccess("Check your email for password reset instructions");
        setEmail("");
      })
      .catch(() => setLocalSuccess(""));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-200 bg-gray-100">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600 text-sm">
              No worries, we'll send you reset instructions
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !email.trim()}
                className="w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Success Message */}
            {localSuccess && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 text-sm font-medium">Success!</p>
                    <p className="text-green-700 text-sm">{localSuccess}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 text-sm font-medium">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline text-sm font-medium transition-colors duration-200"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-medium transition-colors duration-200 hover:underline"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
