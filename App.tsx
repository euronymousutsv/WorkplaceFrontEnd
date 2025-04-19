import React from "react";
import { View } from "react-native";
import ClockInOutScreenPhone from "./src/mobile/employeeDashboard/screens/ClockInOutScreenPhone";

// Commented out navigation imports
/*
import AdminDashboard from "./src/web/adminDashboard/screens/AdminDashboard";
import ManagerDashboard from "./src/web/managerDashboard/screens/ManagerDashboard";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";
import WelcomeScreen from "./src/auth/welcome/WelcomeScreen";
import LoginScreen from "./src/auth/Login/LoginScreen";
import InviteCodeScreen from "./src/auth/welcome/InviteCodeScreen";
import { SearchedServerScreen } from "./src/auth/welcome/SearchedServerScreen";
import SignupFirstScreen from "./src/auth/Signup/SignupFirst";
import SignupSecondScreen from "./src/auth/Signup/SignupSecond";
import SignupPhoneScreen from "./src/auth/Signup/SignupPhone";
import SignupPasswordScreen from "./src/auth/Signup/SignupPassword";
import { SignupProvider } from "./src/auth/Signup/SignUpContext";
import EmployeeManagementScreen from "./src/web/adminDashboard/screens/EmployeeManagementScreen";
import ClockInOutScreen from "./src/web/adminDashboard/screens/ClockInOutScreen";
import SettingsScreen from "./src/web/adminDashboard/screens/SettingsScreen";
import GrossPaymentScreen from "./src/web/adminDashboard/screens/GrossPaymentScreen";
import LeaveRequestScreen from "./src/web/adminDashboard/screens/LeaveRequestScreen";
import SchedulesScreen from "./src/web/adminDashboard/screens/SchedulesScreen";
import EditUserDetailScreens from "./src/mobile/employeeDashboard/screens/EditUserDetailScreens";
import EditDetailScreens from "./src/mobile/employeeDashboard/screens/EditDetailsScreen";
import PartialRegesterScreen from "./src/mobile/employeeDashboard/screens/ParitalRegestrationScreen";
import ParitalRegestrationPasswordScreen from "./src/mobile/employeeDashboard/screens/PartialRegisterPasswordScreen";
import ChatScreen from "./src/web/adminDashboard/screens/ChatScreen";
import {
  MyTabs,
  WebNavigatorDrawer,
} from "./src/mobile/employeeDashboard/screens/DrawerNavigator";
import ChatScreenPhone from "./src/mobile/employeeDashboard/screens/ChatScreen";
*/

// const Stack = createStackNavigator();

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <ClockInOutScreenPhone />
    </View>
  );
};

/*
// Original navigation setup - commented out for now
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

const AppNavigator = () => {
  const { userRole, isAuthenticated } = useAuth();

  return (
    <Stack.Navigator>
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
        name="SchedulesScreen"
        component={SchedulesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClockInOutScreen"
        component={ClockInOutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployeeManagementScreen"
        component={EmployeeManagementScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GrossPaymentScreen"
        component={GrossPaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LeaveRequestScreen"
        component={LeaveRequestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditUserDetailScreens"
        component={EditUserDetailScreens}
        options={{
          headerShown: true,
          title: "Password",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="EditDetailScreens"
        component={EditDetailScreens}
        options={{
          headerShown: true,
          title: "Password",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="PartialRegesterScreen"
        component={PartialRegesterScreen}
        options={{
          headerShown: true,
          title: "Password",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ParitalRegestrationPasswordScreen"
        component={ParitalRegestrationPasswordScreen}
        options={{
          headerShown: true,
          title: "Password",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ChatScreenPhone"
        component={ChatScreenPhone}
        options={({ route }) => ({
          headerBackTitle: "back",
          title: route.params?.channelName || "Chat",
        })}
      />
      <Stack.Screen
        name="ClockInOutScreenPhone"
        component={ClockInOutScreenPhone}
        options={{
          headerShown: true,
          title: "Clock In/Out",
          headerShadowVisible: false,
        }}
      />
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
      <Stack.Screen
        name="EmployeeDashboard"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={WebNavigatorDrawer}
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
        component={AdminDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
*/

export default App;
