import React from "react";

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="text-xl mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
