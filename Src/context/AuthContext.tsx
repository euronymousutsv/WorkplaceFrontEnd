import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for mobile (React Native)
import { Platform } from 'react-native'; // To check platform (Web or Mobile)

interface AuthContextType {
  userRole: string;
  firstName: string;
  lastName: string;
  setUserRole: (role: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authStatus: boolean) => void;
  saveAuthData: (role: string, firstName: string, lastName: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
        if (Platform.OS === 'web') {
          // For Web: Use localStorage
          const token = localStorage.getItem('token');
          const savedRole = localStorage.getItem('role');
          const savedFirstName = localStorage.getItem('firstName');
          const savedLastName = localStorage.getItem('lastName');

          if (token && savedRole && savedFirstName && savedLastName) {
            setIsAuthenticated(true);
            setUserRole(savedRole);
            setFirstName(savedFirstName);
            setLastName(savedLastName);
          }
        } else {
          // For Mobile (React Native): Use AsyncStorage
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
        }
      } catch (error) {
        console.error('Failed to load auth data', error);
      }
    };

    loadAuthData();
  }, []);

  const saveAuthData = async (role: string, firstName: string, lastName: string, token: string) => {
    if (Platform.OS === 'web') {
      // For Web: Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
    } else {
      // For Mobile: Save to AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
    }
  };

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
        saveAuthData, // Function to save auth data for login
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
