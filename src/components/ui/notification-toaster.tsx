import React from 'react';
import { Toaster } from 'sonner';

export const NotificationToaster = () => {
  return (
    <Toaster
      position="bottom-center"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        className: 'notification-toast',
        duration: 4000,
      }}
    />
  );
};