import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import {
  fetchAllNotificationsPhone,
  NotificationsResponsePayload,
} from "../../../api/server/notification";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<
    NotificationsResponsePayload[]
  >([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    notificationHandler();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : notifications.length === 0 ? (
        <Text>No notifications available.</Text>
      ) : (
        notifications.map((notification, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.time}>
                {dayjs(notification.createdAt).fromNow()}
              </Text>
            </View>

            <Text style={styles.body}>{notification.body}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  body: {
    fontSize: 14,
    color: "#444",
  },
});
