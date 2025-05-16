import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ErrorDisplay = ({ title, message, linkTo, linkText }) => {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <Link to={linkTo} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaArrowLeft className="mr-2" /> {linkText}
        </Link>
      </div>
    </div>
  );
};

export default ErrorDisplay;