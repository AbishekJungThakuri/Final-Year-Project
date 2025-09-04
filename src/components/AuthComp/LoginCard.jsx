import React from 'react';
import { Link } from 'react-router-dom';

const LoginCard = ({ onClose, showCloseButton = false }) => {
  // Prevent event bubbling when clicking inside the card
  const handleCardClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-sm relative transform transition-all duration-300 animate-in slide-in-from-right-4"
      onClick={handleCardClick}
    >
      {/* Close Button */}
      {showCloseButton && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-gray-800 rounded-full p-1"
          aria-label="Close login modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Please Login First Message */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-yellow-400 text-lg font-medium">Please login first</p>
        <p className="text-gray-400 text-sm mt-2">Access your plans and create new ones</p>
      </div>

      {/* OR Divider */}
      <div className="flex items-center mb-6">
        <div className="flex-1 h-px bg-gray-600"></div>
        <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>

      {/* Continue with Google Button */}
      <button className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center mb-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="font-medium">Continue with Google</span>
      </button>

      {/* Sign Up / Login with E-mail Button */}
      <Link 
        to="/login" 
        onClick={onClose}
        className="w-full border border-gray-600 text-gray-300 py-3 px-4 rounded-lg mb-8 hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 block text-center transform hover:scale-[1.02] font-medium"
      >
        Sign Up / Login with E-mail
      </Link>

      {/* Terms and Privacy */}
      <div className="text-center text-xs text-gray-500">
        <p>
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-300 transition-colors duration-200">
            terms and conditions
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-gray-300 transition-colors duration-200">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;