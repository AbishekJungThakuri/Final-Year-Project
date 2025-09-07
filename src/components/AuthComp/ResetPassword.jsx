import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { resetPassword } from "../../features/auth/loginAuth/authThunks";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    dispatch(resetPassword({ token, newPassword: password }))
      .unwrap()
      .then(() => {
        alert("Password reset successfully!");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Reset failed:", err);
      });
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-200 bg-gray-100">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600 text-sm">
              Create a new, secure password for your account
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* New Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 ${
                      confirmPassword && !passwordsMatch
                        ? "border-red-300 focus:ring-red-500"
                        : confirmPassword && passwordsMatch
                        ? "border-green-300 focus:ring-green-500"
                        : "border-gray-300 focus:ring-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-600 text-xs mt-1">
                    Passwords don't match
                  </p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="text-green-600 text-xs mt-1">
                    ✓ Passwords match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !passwordsMatch}
                className="w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

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
      </div>
    </div>
  );
};

export default ResetPassword;
