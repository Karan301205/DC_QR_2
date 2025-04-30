import { createContext, useContext, useState } from 'react';
import { initializeMealStatus } from '../data/data';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mealStatus, setMealStatus] = useState(initializeMealStatus());

  const updateMealStatus = (email, mealType, status) => {
    setMealStatus(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        [mealType]: status
      }
    }));
  };

  return (
    <AppContext.Provider value={{ user, setUser, mealStatus, updateMealStatus }}>
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