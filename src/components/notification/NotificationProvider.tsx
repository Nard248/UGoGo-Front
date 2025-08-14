import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide, AlertColor } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

interface Notification {
  id: string;
  message: string;
  severity: AlertColor;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    message: string, 
    severity: AlertColor = 'info', 
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, severity, duration };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showNotification(message, 'success', 4000);
  }, [showNotification]);

  const showError = useCallback((message: string) => {
    showNotification(message, 'error', 6000);
  }, [showNotification]);

  const showInfo = useCallback((message: string) => {
    showNotification(message, 'info', 5000);
  }, [showNotification]);

  const showWarning = useCallback((message: string) => {
    showNotification(message, 'warning', 5000);
  }, [showNotification]);

  const handleClose = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const iconMapping = {
    success: <CheckCircleIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />
  };

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      showSuccess, 
      showError, 
      showInfo, 
      showWarning 
    }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <Snackbar
            key={notification.id}
            open={true}
            autoHideDuration={notification.duration}
            onClose={() => handleClose(notification.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            TransitionComponent={Slide}
            sx={{ 
              position: 'fixed',
              top: `${20 + index * 70}px`,
              zIndex: 9999 - index 
            }}
          >
            <Alert
              onClose={() => handleClose(notification.id)}
              severity={notification.severity}
              iconMapping={iconMapping}
              sx={{
                minWidth: '350px',
                backgroundColor: notification.severity === 'success' ? '#DFF5F5' : undefined,
                color: notification.severity === 'success' ? '#1B3A4B' : undefined,
                border: notification.severity === 'success' ? '1px solid #73B2B2' : undefined,
                '& .MuiAlert-icon': {
                  color: notification.severity === 'success' ? '#73B2B2' : undefined
                },
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};