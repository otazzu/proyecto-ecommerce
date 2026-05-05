export const useToast = () => {
  // This hook is used in components that may not be inside ToastProvider.
  // It dispatches a custom event that ToastProvider listens to.
  const showSuccess = (message) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type: 'success' } }));
  };
  const showError = (message) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type: 'error' } }));
  };
  const showInfo = (message) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type: 'info' } }));
  };
  const showWarning = (message) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type: 'warning' } }));
  };

  return { showSuccess, showError, showInfo, showWarning };
};