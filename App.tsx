import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./Src/screens/LoginScreen";
import WelcomeScreen from "./Src/screens/WelcomeScreen";
import SignupScreen from "./Src/screens/SignupScreen";
import AdminDashboard from "./Src/components/AdminDashboard";
import EmployeeDashboard from "./Src/components/EmployeeDashboard";
import ManagerDashboard from "./Src/components/ManagerDashboard";
import { AuthProvider, useAuth } from "./Src/context/AuthContext";
import ChatScreen from "./Src/screens/Chat";

// Create a stack navigator
const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//     </AuthProvider>
//   );
// };

const App = () => {
  return <ChatScreen />;
};

// Centralized AppNavigator for role-based navigation
const AppNavigator = () => {
  const { userRole, isAuthenticated } = useAuth(); // Access userRole and isAuthenticated from context

  return (
    <Stack.Navigator>
      {/* Public Routes */}
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      {/* Conditional Routes */}
      {isAuthenticated && (
        <>
          {userRole === "admin" && (
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboard}
              options={{ headerShown: false }}
            />
          )}
          {userRole === "manager" && (
            <Stack.Screen
              name="ManagerDashboard"
              component={ManagerDashboard}
              options={{ headerShown: false }}
            />
          )}
          {userRole === "employee" && (
            <Stack.Screen
              name="EmployeeDashboard"
              component={EmployeeDashboard}
              options={{ headerShown: false }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
