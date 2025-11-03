import React, { useEffect } from 'react';
import { Toast as ToastType } from '../services/types';
import { XCircleIcon } from './icons/XCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ToastProps {
  toast: ToastType;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    // A duration of 0 means the toast is persistent and must be manually closed.
    if (toast.duration === 0) return;

    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000); // Default to 5 seconds if no duration is provided

    return () => {
      clearTimeout(timer);
    };
  }, [toast, onClose]);
  
  const baseClasses = "flex items-center w-full max-w-xs p-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg shadow-lg border animate-fade-in-right";
  const typeClasses = {
    error: 'border-red-500/50',
    success: 'border-green-500/50',
    info: 'border-cyan-500/50',
  };
  
  const Icon = {
    error: <XCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />,
    success: <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />,
    info: <svg className="w-6 h-6 text-cyan-500 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>,
  };

  return (
    <div className={`${baseClasses} ${typeClasses[toast.type]}`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {Icon[toast.type]}
      </div>
      <div className="ml-3 text-sm font-normal">{toast.message}</div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 p-1.5 inline-flex h-8 w-8" 
        aria-label="Close"
        onClick={() => onClose(toast.id)}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
    toasts: ToastType[];
    onClose: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className="fixed top-5 right-5 z-50 space-y-4">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
};