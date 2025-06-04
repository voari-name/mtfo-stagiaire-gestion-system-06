
export const triggerNotification = (notification: { title: string; message: string; type: 'success' | 'info' | 'warning' }) => {
  const event = new CustomEvent('customNotification', { detail: notification });
  window.dispatchEvent(event);
};
