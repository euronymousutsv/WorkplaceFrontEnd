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
import { SearchedServerScreen } from "./src/auth/SearchedServerScreen";
import { searchServer } from "./src/api/server/serverApi";
import SignupFirstScreen from "./src/auth/SignupFirst";
import SignupSecondScreen from "./src/auth/SignupSecond";
import SignupPhoneScreen from "./src/auth/SignupPhone";
import SignupPasswordScreen from "./src/auth/SignupPassword";
import { SignupProvider } from "./src/auth/SignUpContext";

// Create a stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <SignupProvider>
          <AppNavigator />
        </SignupProvider>
      </NavigationContainer>
      <Toast />
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

      {/* All Signup Screens */}
      <Stack.Screen
        name="Signup1"
        component={SignupFirstScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup2"
        component={SignupSecondScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerBackTitle: "back",
          title: "",
        }}
      />
      <Stack.Screen
        name="SignupPhone"
        component={SignupPhoneScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerBackTitle: "back",
          title: "",
        }}
      />
      <Stack.Screen
        name="SignupPassword"
        component={SignupPasswordScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerBackTitle: "back",
          title: "",
        }}
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
