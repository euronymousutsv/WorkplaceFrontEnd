import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext'; // Import the AuthContext to get role and auth state
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import AdminDashboard from './src/components/AdminDashboard';
import EmployeeDashboard from './src/components/EmployeeDashboard';
import ManagerDashboard from './src/components/ManagerDashboard';
import LeaveScreen from './src/components/LeaveScreen';
import { RootStackParamList } from './src/types/navigationTypes';

// Create a stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

// Centralized AppNavigator for role-based navigation
const AppNavigator = () => {
  const { userRole, isAuthenticated } = useAuth();  // Access userRole and isAuthenticated from context

  return (
    <Stack.Navigator>
      {/* Public Routes */}
      <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} options={{ headerShown: false }} />
      
      
      {/* <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }} /> */}

      {/* Conditional Routes */}
      {/* {isAuthenticated && (
        <>
          {userRole === 'admin' && (
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
          )}
          {userRole === 'manager' && (
            <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ headerShown: false }} />
          )}
          {userRole === 'employee' && (
            <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} options={{ headerShown: false }} />
          )}
        </>
      )} */}
    </Stack.Navigator>
  );
};

export default App;
