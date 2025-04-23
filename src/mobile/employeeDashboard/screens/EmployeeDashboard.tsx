import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import { getToken, Plat, saveToken } from "../../../api/auth/token";
import { getShiftsByEmployee, Shifts } from "../../../api/auth/shiftApi";
import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";

const PrimaryColor = "#4A90E2";
const AccentColor = "#2ECC71";
const BackgroundColor = "#FDFDFF";
const TextColor = "#393D3F";
const ButtonRed = "#D9534F";
const ActiveTabColor = "#88B6EC";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";

type EmployeeDashboardProps = {
  navigation: DrawerNavigationProp<any, any>;
};

import { useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { registerForPushNotificationsAsync } from "../components/notifications";
import { RosterAttributes } from "../../../types/RosterAttributes"; // mock data
import { getUserIdFromToken } from "../../../utils/jwt";
import { getCurrentUserDetails } from "../../../api/auth/profileApi";

const EmployeeDashboard: React.FC = () => {
  const [name, setName] = useState({ firstName: "", lastName: "" });

  const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string>('');
  const [clockedIn, setClockedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [contentTab, setContentTab] = useState<string>("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [Shifts, setShifts] = useState<Shifts[]>([]);
  // Chat state
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null); // Default channel
  const [activeChannelName, setActiveChannelName] = useState(""); // Default channel name
  const [isChatView, setIsChatView] = useState(false);

  // notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      const res = await getCurrentUserDetails();
      if (res && res.data) {
        setName({ firstName: res.data.firstName, lastName: res.data.lastName });
      }
    };
  
    fetchName();
  }, []);
  

  // const handleGetServerDetail = async () => {
  //   const res = await getLoggedInUserServer(Plat.PHONE);
  //   if (res instanceof ApiError) {
  //     console.log(res.message);
  //   } else if ("statusCode" in res && "data" in res) {
  //     const serverId = res.data.serverId;
  //     saveToken("serverId", serverId);
  //   } else {
  //     console.log("Something went wrong");
  //   }
  // };

  useEffect(() => {
    const fetchShifts = async () => {
          setLoading(true);
      
          const employeeId = await getUserIdFromToken(); 
          if (!employeeId) {
            setError("Employee ID not found in token");
            setLoading(false);
            return;
          }
  
      const res = await getShiftsByEmployee(employeeId);

      if (res instanceof ApiError) {
        console.log("Shift API Error:", res.message);
      } else {
        const today = new Date().toISOString().split("T")[0];
  
        const todayShifts = res.data.filter((shift) => {
          return shift.startTime.split("T")[0] === today;
        });
  
        setShifts(todayShifts);
      }
    };
  
    fetchShifts();
  }, []);


  return (

    
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Welcome Header */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi {name.firstName} {name.lastName}</Text>
          <Text style={styles.welcomeSubtext}>
            Here’s what’s happening today
          </Text>
        </View>

        {/* Today’s Shift Card */}
        <View style={styles.shiftCard}>
          {/* <Ionicons name="calendar-outline" size={24} color={PrimaryColor} /> */}
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.shiftLabel}>Today's Shifts</Text>

            {Shifts.length > 0 ? (
              Shifts.map((shift) => (
                <View key={shift.id} style={styles.individualShiftCardRow}>
                  {/* Icon on the left */}
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={PrimaryColor}
                    style={{ marginRight: 14, marginTop: 19 }}
                  />

                  {/* Text content on the right */}
                  <View style={{ flex: 1 }}>
                    {/* Time */}
                    <View style={styles.iconRow}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={PrimaryColor}
                        style={styles.icon}
                      />
                      <Text style={styles.shiftLineText}>
                        {new Date(shift.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {new Date(shift.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>

                    {/* Location */}
                    {/* <View style={styles.iconRow}>
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color={PrimaryColor}
                        style={styles.icon}
                      />
                      <Text style={styles.shiftLineText}>
                        Office ID: {shift.officeId}
                      </Text>
                    </View> */}

                    {/* Description */}
                    <View style={styles.iconRow}>
                      <Ionicons
                        name="document-text-outline"
                        size={16}
                        color={PrimaryColor}
                        style={styles.icon}
                      />
                      <Text style={styles.shiftLineText}>
                        {shift.notes || "No description available"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noShiftText}>You have no shift today.</Text>
            )}
          </View>
        </View>

        {/* Clock In Shortcut */}
        <TouchableOpacity
          style={styles.clockButton}
          onPress={() => navigation.navigate("ClockInOutScreenPhone")}
        >
          <Ionicons
            name="time"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.clockButtonText}>Go to Clock In / Out</Text>
        </TouchableOpacity>

        {/* Quick Action Buttons */}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: PrimaryColor,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  chatViewContainer: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: PrimaryColor,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  menuButton: {
    position: "absolute",
    left: 10,
    top: 20,
  },
  notificationButton: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  tab: {
    backgroundColor: PrimaryColor,
    padding: 10,
    borderRadius: 10,
  },
  tabText: {
    backgroundColor: "#88B6EC",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 10,
    color: "white",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: BackgroundColor,
  },
  activeTabText: {
    backgroundColor: BackgroundColor,
    color: TextColor,
  },
  contentContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "light",
    color: "#393D3F",
    left: 120,
    marginBottom: 12,
    marginTop: -30,
  },

  noShiftsText: {
    fontSize: 16,
    color: "#8E9196",
    textAlign: "center",
    marginVertical: 20,
  },
  //main content
  welcomeContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: TextColor,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 4,
  },

  shiftCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },

  shiftLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: TextColor,
  },
  shiftTime: {
    fontSize: 14,
    marginTop: 4,
    color: "#4A90E2",
  },
  shiftLocation: {
    fontSize: 13,
    color: "#6C757D",
    marginTop: 2,
  },
  noShiftText: {
    color: "#D9534F",
    marginTop: 4,
  },

  clockButton: {
    backgroundColor: "#2ECC71",
    margin: 20,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  clockButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  quickActionScroll: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 90,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: TextColor,
    marginTop: 6,
  },
  individualShiftCardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  shiftDescription: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6C757D",
    marginTop: 2,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  shiftLineText: {
    fontSize: 14,
    color: TextColor,
    flexShrink: 1,
  },
  icon: {
    color: "gray",
    opacity: 0.6,
    marginRight: 8,
  },
});

export default EmployeeDashboard;
