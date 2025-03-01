import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for persistence

// Define the context data type
interface AuthContextType {
  userRole: string;
  firstName: string;
  lastName: string;
  setUserRole: (role: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authStatus: boolean) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app and provide the context
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string>('employee'); // Default role
  const [firstName, setFirstName] = useState<string>(''); 
  const [lastName, setLastName] = useState<string>(''); 
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const savedRole = await AsyncStorage.getItem('role');
        const savedFirstName = await AsyncStorage.getItem('firstName');
        const savedLastName = await AsyncStorage.getItem('lastName');

        if (token && savedRole && savedFirstName && savedLastName) {
          setIsAuthenticated(true);
          setUserRole(savedRole);
          setFirstName(savedFirstName);
          setLastName(savedLastName);
        }
      } catch (error) {
        console.error('Failed to load auth data', error);
      }
    };
    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userRole,
        firstName,
        lastName,
        setUserRole,
        setFirstName,
        setLastName,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
