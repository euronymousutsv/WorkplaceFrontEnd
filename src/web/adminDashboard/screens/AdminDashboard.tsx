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
import { ApiError } from "../../../api/utils/apiResponse";
import { saveToken } from "../../../api/auth/token";

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = new Animated.Value(250);
  const mainContentPadding = new Animated.Value(250);
  const [isMobile, setIsMobile] = useState(false);

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

  // useEffect(() => {
  //   Animated.timing(sidebarWidth, {
  //     toValue: isSidebarOpen ? 250 : 0,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();

  //   Animated.timing(mainContentPadding, {
  //     toValue: isSidebarOpen ? 250 : 0,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();
  // }, [isSidebarOpen]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const alerts = [
    {
      text: "Pranish was supposed to start working at 10. He has not clocked in yet.",
      time: "60 mins ago",
      type: "alert",
    },
    {
      text: "Pranish has requested for a leave this Saturday",
      time: "10 min ago",
      type: "notification",
    },
    {
      text: "Sabin mentioned you in #Channel1",
      time: "10 min ago",
      type: "notification",
    },
  ];

  const toDos = [{ task: "Place an order for tomorrow", due: "Due today" }];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Main Content */}
        <Animated.View style={[styles.mainContent]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Welcome Banner */}
            <View style={styles.welcomeBanner}>
              <Text style={styles.welcomeTitle}>Welcome, Admin 👋</Text>
              <Text style={styles.welcomeSubtitle}>
                Here's an overview of what’s happening today.
              </Text>
            </View>

            {/* Alert */}
            <View style={[styles.card, styles.alertCard]}>
              <Text style={styles.cardTitle}>Alert</Text>
              <Text style={styles.alertText}>{alerts[0].text}</Text>
              <Text style={styles.timestamp}>{alerts[0].time}</Text>
            </View>

            {/* Notifications */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Notifications</Text>
              {alerts.slice(1).map((alert, index) => (
                <View key={index} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>{alert.text}</Text>
                  <Text style={styles.timestamp}>{alert.time}</Text>
                </View>
              ))}
            </View>

            {/* To-do’s */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>To-do’s</Text>
              <FlatList
                data={toDos}
                renderItem={({ item }) => (
                  <View style={styles.todoItem}>
                    <Text style={styles.todoText}>{item.task}</Text>
                    <Text style={styles.timestamp}>{item.due}</Text>
                  </View>
                )}
                keyExtractor={(_, index) => index.toString()}
              />
            </View>
            {/* Send Announcement Card */}
            <SendAnnouncementCard />
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
    borderLeftColor: ButtonRed,
    backgroundColor: "#FFEBEB",
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
