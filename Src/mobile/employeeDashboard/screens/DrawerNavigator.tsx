import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import EmployeeDashboard from "./EmployeeDashboard"; // Adjust the import path accordingly
import SchedulesScreen from "./SchedulesScreen"; // Assuming this is already implemented
import IncomeScreen from "./IncomeScreen"; // Assuming this is already implemented
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LeaveScreen from "./LeaveScreen";
import ProfileScreen from "./ProfileScreen";
import CustomDrawerContent from "./ChannelsDrawerView";
import { Dimensions } from "react-native";
import NotificationScreen from "./NotificationScreen";
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
    </Drawer.Navigator>
  );
};

export default AppNavigatorDrawer;
