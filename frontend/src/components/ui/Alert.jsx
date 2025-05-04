import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  
  const alertTypes = {
    success: 'bg-green-800/70 text-green-200 border-green-600',
    error: 'bg-red-900/70 text-red-200 border-red-600',
    warning: 'bg-yellow-900/70 text-yellow-200 border-yellow-600',
    info: 'bg-blue-900/70 text-blue-200 border-blue-600',
  };
  
  return (
    <div className={`${alertTypes[type]} border backdrop-blur-sm rounded-md p-4 my-4 relative`} role="alert">
      <div className="flex">
        <div className="flex-grow">{message}</div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-current hover:text-white transition-colors"
            aria-label="Close"
          >
            <span aria-hidden="true" className="text-xl">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;