import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback: return a dummy object that won't crash
    return { showSuccess: () => {}, showError: () => {}, showInfo: () => {}, showWarning: () => {} };
  }
  return context;
};

let toastId = 0;

const TOAST_TYPES = {
  success: {
    icon: 'fa-circle-check',
    borderColor: 'border-l-[#00d4aa]',
    bgColor: 'bg-[#0a1f1a]',
    iconColor: 'text-[#00d4aa]',
  },
  error: {
    icon: 'fa-circle-xmark',
    borderColor: 'border-l-red-500',
    bgColor: 'bg-[#1f0a0a]',
    iconColor: 'text-red-400',
  },
  info: {
    icon: 'fa-circle-info',
    borderColor: 'border-l-blue-400',
    bgColor: 'bg-[#0a0f1f]',
    iconColor: 'text-blue-400',
  },
  warning: {
    icon: 'fa-triangle-exclamation',
    borderColor: 'border-l-yellow-400',
    bgColor: 'bg-[#1f1a0a]',
    iconColor: 'text-yellow-400',
  },
};

const Toast = ({ id, message, type, onClose }) => {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`animate-bounce-in flex items-start gap-3 p-4 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor} backdrop-blur-md shadow-lg max-w-sm w-full`}
      role="alert"
    >
      <i className={`fas ${config.icon} ${config.iconColor} text-lg mt-0.5 flex-shrink-0`}></i>
      <p className="text-sm text-[var(--text-primary)] font-body flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
      >
        <i className="fas fa-xmark text-sm"></i>
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const showError = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const showInfo = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const showWarning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);

  // Listen for custom events from useToast hook
  useEffect(() => {
    const handleCustomToast = (e) => {
      const { message, type } = e.detail;
      addToast(message, type);
    };
    window.addEventListener('toast', handleCustomToast);
    return () => window.removeEventListener('toast', handleCustomToast);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <div className="fixed top-4 right-4 z-[9998] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};