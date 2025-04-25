import { createDrawerNavigator } from "@react-navigation/drawer";
import EmployeeDashboard from "./EmployeeDashboard";
import SchedulesScreen from "./SchedulesScreen";
import { NavigationContainer } from "@react-navigation/native";
import IncomeScreen from "./IncomeScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LeaveScreen from "./LeaveScreen";
import ProfileScreen from "./ProfileScreen";
import CustomDrawerContent from "./ChannelsDrawerView";
import { Dimensions, View } from "react-native";
import NotificationScreen from "./NotificationScreen";
import EmployeeManagementScreen from "../../../web/adminDashboard/screens/EmployeeManagementScreen";
// import ClockInOutScreen from "../../../web/adminDashboard/screens/ClockInOutScreen";
import LeaveRequestScreen from "../../../web/adminDashboard/screens/LeaveRequestScreen";
import GrossPaymentScreen from "../../../web/adminDashboard/screens/GrossPaymentScreen";
import SettingsScreen from "../../../web/adminDashboard/screens/SettingsScreen";
import { useEffect, useState } from "react";

import AdminDashboard from "../../../web/adminDashboard/screens/AdminDashboard";
import Header from "../../../web/adminDashboard/components/Header";
import { SafeAreaView } from "react-native-web";
import DocumentUpload from "./DocumentUpload";
import ManagerDashboard from "../../../web/managerDashboard/screens/ManagerDashboard";
import ManagerEmployeeScreen from "../../../web/managerDashboard/screens/ManagerEmployeeScreen";

const Drawer = createDrawerNavigator();

const Tab = createBottomTabNavigator();

export function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingTop: 10,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12, // optional: adjust label styling
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={AppNavigatorDrawer}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppNavigatorDrawer = () => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: screenWidth * 0.7, // 50% of screen width
        },
        headerShown: true,
        drawerActiveBackgroundColor: "#e6f0ff", // background when selected
        drawerActiveTintColor: "#1e90ff", // text/icon color when selected
        drawerInactiveTintColor: "#333",
        drawerItemStyle: {
          borderRadius: 12, // 🎯 Rounded corners
          marginHorizontal: 10,
          marginVertical: 4,
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={EmployeeDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Schedules"
        component={SchedulesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Income"
        component={IncomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Leave"
        component={LeaveScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="airplane-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Document"
        component={DocumentUpload}
        options={{
          drawerIcon: ({ color, size }) => (
             <Ionicons name="document-outline" size={size} color={color} />
           ),
        }}
      />
    </Drawer.Navigator>
  );
};

export const WebNavigatorDrawer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={(props) => (
          <CustomDrawerContent {...props} isSidebarOpen={isSidebarOpen} />
        )}
        screenOptions={{
          drawerType: "permanent",

          drawerStyle: {
            width: isSidebarOpen ? 260 : 0, // 20% of screen width
          },
          headerShown: false,
          drawerActiveBackgroundColor: "#e6f0ff", // background when selected
          drawerActiveTintColor: "#1e90ff", // text/icon color when selected
          drawerInactiveTintColor: "#333",
          drawerItemStyle: {
            borderRadius: 12,
            marginHorizontal: 10,
            marginVertical: 4,
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={AdminDashboard}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        {/* <Drawer.Screen
          name="Leave Request"
          component={LeaveRequestScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="airplane" size={size} color={color} />
            ),
          }}
        /> */}

        {/* <Drawer.Screen
          name="Clock In/Out"
          component={ClockInOutScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        /> */}

        <Drawer.Screen
          name="Employee Management"
          component={EmployeeManagementScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        {/* <Drawer.Screen
          name="Gross Payment"
          component={GrossPaymentScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="cash" size={size} color={color} />
            ),
          }}
        /> */}

        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};
export const ManagerNavigatorDrawer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={(props) => (
          <CustomDrawerContent {...props} isSidebarOpen={isSidebarOpen} userRole="manager" />
        )}
        screenOptions={{
          drawerType: "permanent",
          drawerStyle: {
            width: isSidebarOpen ? 260 : 0,
          },
          headerShown: false,
          drawerActiveBackgroundColor: "#e6f0ff",
          drawerActiveTintColor: "#1e90ff",
          drawerInactiveTintColor: "#333",
          drawerItemStyle: {
            borderRadius: 12,
            marginHorizontal: 10,
            marginVertical: 4,
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={ManagerDashboard}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Employee Management"
          component={ManagerEmployeeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />

        {/* <Drawer.Screen
          name="Office"
          component={ManagerOfficeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="business" size={size} color={color} />
            ),
          }}
        /> */}

        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};



export default AppNavigatorDrawer;
