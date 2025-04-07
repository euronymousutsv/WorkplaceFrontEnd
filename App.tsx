import React from "react";

import AdminDashboard from "./src/web/adminDashboard/screens/AdminDashboard";
import EmployeeDashboard from "./src/mobile/employeeDashboard/screens/EmployeeDashboard";
import ManagerDashboard from "./src/web/managerDashboard/screens/ManagerDashboard";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";
import WelcomeScreen from "./src/auth/WelcomeScreen";
import LoginScreen from "./src/auth/LoginScreen";
import InviteCodeScreen from "./src/auth/InviteCodeScreen";
import SignupScreen from "./src/auth/SignupScreen";
import { SearchedServerScreen } from "./src/auth/SearchedServerScreen";
import { searchServer } from "./src/api/server/serverApi";

// Create a stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
};

// Centralized AppNavigator for role-based navigation
const AppNavigator = () => {
  const { userRole, isAuthenticated } = useAuth(); // Access userRole and isAuthenticated from context

  return (
    <Stack.Navigator>
      {/* Public Routes */}
      {/* <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerShown: false }}
      />  */}

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
        name="InviteCode"
        component={InviteCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      {/* Conditional Routes
      // {isAuthenticated && (
      //   <>
      //     {userRole === "admin" && (
      //       <Stack.Screen
      //         name="AdminDashboard"
      //         component={AdminDashboard}
      //         options={{ headerShown: false }}
      //       />
      //     )}
      //     {userRole === "manager" && (
      //       <Stack.Screen
      //         name="ManagerDashboard"
      //         component={ManagerDashboard}
      //         options={{ headerShown: false }}
      //       />
      //     )}
      //     {userRole === "employee" && (
      //       <Stack.Screen
      //         name="EmployeeDashboard"
      //         component={EmployeeDashboard}
      //         options={{ headerShown: false }}
      //       />
      //     )}
      //   </>
      // )} */}

      <Stack.Screen
        name="EmployeeDashboard"
        component={EmployeeDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchedServer"
        component={SearchedServerScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ManagerDashboard"
        component={ManagerDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App;
