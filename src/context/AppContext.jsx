import { createContext, useContext, useState } from 'react';
import { initializeMealStatus } from '../data/data';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mealStatus, setMealStatus] = useState({});
  const [notifications, setNotifications] = useState({});

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateMealStatus = (email, mealType, status) => {
    setMealStatus(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        [mealType]: status
      }
    }));

    // Add notification for the student
    if (status) {
      setNotifications(prev => ({
        ...prev,
        [email]: {
          ...prev[email],
          [mealType]: {
            message: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} has been served!`,
            timestamp: new Date().toISOString(),
            read: false
          }
        }
      }));
    }
  };

  const markNotificationAsRead = (email, mealType) => {
    setNotifications(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        [mealType]: {
          ...prev[email]?.[mealType],
          read: true
        }
      }
    }));
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      mealStatus,
      updateMealStatus,
      notifications,
      markNotificationAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 