import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../features/auth/loginAuth/authThunks";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [localSuccess, setLocalSuccess] = useState(""); // ✅ local success message
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSuccess(""); // reset message
    dispatch(forgetPassword(email))
      .unwrap()
      .then((res) => {
        // only when API really succeeds
        setLocalSuccess("Check your email for password reset instructions");
        setEmail("");
      })
      .catch(() => {
        setLocalSuccess(""); // do nothing on error
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-blue-100 text-sm">
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {/* Success Message */}
            {localSuccess && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 text-sm font-medium">Success!</p>
                    <p className="text-green-700 text-sm">{localSuccess}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 text-sm font-medium">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <button onClick={()=>navigate('/login')} className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 hover:underline cursor-pointer">
                ← Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Remember your password?{" "}
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;