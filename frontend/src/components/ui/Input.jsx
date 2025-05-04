import React from 'react';

// Add labelClass prop and className prop to your existing Input component

const Input = ({ 
  id, 
  type, 
  label, 
  value, 
  onChange, 
  error, 
  required, 
  autoComplete,
  labelClass = "text-gray-700", // Default label class
  className = "", // Additional classes for the input
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={`block mb-2 text-sm font-medium ${labelClass}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;