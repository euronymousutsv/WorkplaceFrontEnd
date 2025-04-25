import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  FlatList,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
import {
  PrimaryColor,
  AccentColor,
  BackgroundColor,
  TextColor,
  ButtonRed,
} from "../../../utils/color";

import SendAnnouncementCard from "../components/SendAnnouncementCard";
import { getLoggedInUserServer } from "../../../api/server/serverApi";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import { saveToken } from "../../../api/auth/token";
import {
  clearAllNotifications,
  fetchAllNotificationsPhone,
  NotificationsResponsePayload,
} from "../../../api/server/notification";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = new Animated.Value(250);
  const mainContentPadding = new Animated.Value(250);
  const [isMobile, setIsMobile] = useState(false);

  const [notifications, setNotifications] = useState<
    NotificationsResponsePayload[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await notificationHandler(); // reuse your existing function
    setRefreshing(false);
  };
  async function notificationHandler() {
    try {
      const res = await fetchAllNotificationsPhone();
      if ("data" in res || res instanceof ApiResponse) {
        const notificationsLift = res.data;
        setNotifications(notificationsLift);
      } else if (res instanceof ApiError) {
        Toast.show({
          text1: res.message,
          position: "bottom",
          type: "error",
        });
      }
    } catch (error) {
      Toast.show({
        text1: "Something went wrong.",
        position: "bottom",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function notificationClearHandler() {
    try {
      const res = await clearAllNotifications();

      if (res instanceof ApiResponse) {
        const notificationsLift = res.data;
        setNotifications(null);
        fetchAllNotificationsPhone();
      } else if (res instanceof ApiError) {
        Toast.show({
          text1: res.message,
          position: "bottom",
          type: "error",
        });
      } else {
        // Fallback for unexpected response types
        Toast.show({
          text1: "Unexpected response from server.",
          position: "bottom",
          type: "error",
        });
      }
    } catch (error) {
      Toast.show({
        text1: "Something went wrong.",
        position: "bottom",
        type: "error",
      });
    }
  }

  const screenWidth = Dimensions.get("window").width;

  const handleGetServerDetail = async () => {
    try {
      const res = await getLoggedInUserServer();

      if (res instanceof ApiError) {
        console.log("Server fetch error:", res.message);
      } else if ("statusCode" in res && "data" in res) {
        const serverId = res.data.joinedServer.serverId;
        const officeId = res.data?.searchedOffice?.officeId || "";
        const serverName = res.data.joinedServer.name;

        console.log("Server ID -----------------:", serverId);

        await saveToken("serverId", serverId);
        await saveToken("officeId", officeId);
        await saveToken("serverName", serverName);
      } else {
        console.log("Unexpected response while fetching server.");
      }
    } catch (error) {
      console.error("Error in handleGetServerDetail:", error);
    }
  };

  useEffect(() => {
    handleGetServerDetail();
    notificationHandler();
  }, []);
  useEffect(() => {
    if (screenWidth <= 768) {
      setIsMobile(true);
      setIsSidebarOpen(false);
    } else {
      setIsMobile(false);
      setIsSidebarOpen(true);
    }
  }, [screenWidth]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const toDos = [{ task: "Place an order for tomorrow", due: "Due today" }];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Main Content */}

        <Animated.View style={[styles.mainContent]}>
          {/* Send Announcement Card */}

          {/* Welcome Banner */}
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeTitle}>Welcome, Admin 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Here's an overview of what’s happening today.
            </Text>
          </View>
          <SendAnnouncementCard />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Notifications */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>Notifications</Text>
                <TouchableOpacity
                  onPress={notificationClearHandler}
                  style={styles.notificationItem}
                >
                  <Text style={styles.alertText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {notifications?.length === 0 || !notifications ? (
                <View>No Notifications</View>
              ) : (
                notifications.map((alert) => (
                  <View key={alert.id} style={styles.alertCard}>
                    <Text style={styles.notificationText}>{alert.title}</Text>
                    <Text style={styles.notificationText}>{alert.body}</Text>
                    <Text style={styles.timestamp}>
                      {dayjs(alert.createdAt).fromNow()}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: BackgroundColor,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 60,
  },
  scrollContainer: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  welcomeBanner: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: TextColor,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6C6C6C",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertCard: {
    borderLeftWidth: 5,
    padding: 10,
    borderLeftColor: ButtonRed,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: TextColor,
    marginBottom: 10,
  },
  alertText: {
    fontSize: 16,
    color: ButtonRed,
  },
  notificationItem: {
    marginBottom: 15,
  },
  notificationText: {
    fontSize: 16,
    color: TextColor,
  },
  todoItem: {
    marginBottom: 15,
  },
  todoText: {
    fontSize: 16,
    color: TextColor,
  },
  timestamp: {
    fontSize: 12,
    color: "#6C6C6C",
  },
});

export default AdminDashboard;
