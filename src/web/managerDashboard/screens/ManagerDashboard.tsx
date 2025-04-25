import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  BackgroundColor,
  TextColor,
} from "../../../utils/color";
import { getToken } from "../../../api/auth/token";
import { getShiftsByOffice } from "../../../api/auth/shiftApi";

import { getAllEmployeeInOffice } from "../../../api/office/officeApi";
import { ApiError } from "../../../api/utils/apiResponse";
import { fetchAllLeaveRequestInAnOffice } from "../../../api/leave/leaveApi";

const ManagerDashboard: React.FC = () => {
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth <= 768;

  const [shiftsToday, setShiftsToday] = useState<{ name: string; time: string }[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<{ name: string; date: string; reason: string }[]>([]);
  const [notifications, setNotifications] = useState<{ text: string; time: string }[]>([]);
  const [teamStats, setTeamStats] = useState({ total: 0, onShift: 0, onLeave: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const officeId = await getToken("officeId");
        if (!officeId) return;

        // Fetch Employees
        const officeRes = await getAllEmployeeInOffice({ officeId });
        if (!(officeRes instanceof ApiError)) {
          const employees = officeRes.data;
          setTeamStats((prev) => ({ ...prev, total: employees.length }));
        }

        // Fetch Shifts Today
        const shiftRes = await getShiftsByOffice(officeId);
        if (!(shiftRes instanceof ApiError)) {
          const todayStr = new Date().toISOString().split("T")[0];
          const todayShifts = shiftRes.data.filter((shift: any) =>
            shift.date === todayStr
          ).map((shift: any) => ({
            name: shift.employeeName || "Unknown",
            time: `${new Date(shift.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(shift.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          }));

          setShiftsToday(todayShifts);
          setTeamStats((prev) => ({ ...prev, onShift: todayShifts.length }));
        }

        // Fetch Leave Requests
        const leaveRes = await fetchAllLeaveRequestInAnOffice({ officeId });

if (!(leaveRes instanceof ApiError)) {
  const pendingLeaves = leaveRes.data.filter((req) => req.isApproved === false);
  setLeaveRequests(
    pendingLeaves.map((req) => ({
      name: req.Employee?.firstName + " " + req.Employee?.lastName || "Unknown",
      date: req.startDate?.split("T")[0] ?? "N/A",
      reason: req.reason ?? "N/A",
    }))
  );
  setTeamStats((prev) => ({ ...prev, onLeave: pendingLeaves.length }));
}

        // Sample notifications (you can replace this)
        setNotifications([
          { text: "Admin has updated your office location", time: "1 hour ago" },
        ]);
      } catch (err) {
        console.log("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Welcome */}
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeTitle}>Welcome, Manager 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Here’s your team’s activity today.
            </Text>
          </View>

          {/* Shifts Today */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Shifts Today</Text>
            {shiftsToday.length === 0 ? (
              <Text style={styles.itemMeta}>No shifts today</Text>
            ) : (
              shiftsToday.map((emp, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>{emp.name}</Text>
                  <Text style={styles.itemMeta}>{emp.time}</Text>
                </View>
              ))
            )}
          </View>

          {/* Leave Requests */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pending Leave Requests</Text>
            {leaveRequests.length === 0 ? (
              <Text style={styles.itemMeta}>No leave requests</Text>
            ) : (
              leaveRequests.map((req, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>{req.name}</Text>
                  <Text style={styles.itemMeta}>
                    {req.date} – {req.reason}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Notifications */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications</Text>
            {notifications.map((note, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{note.text}</Text>
                <Text style={styles.timestamp}>{note.time}</Text>
              </View>
            ))}
          </View>

          {/* Team Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Team Summary</Text>
            <Text style={styles.statText}>👥 Total Employees: {teamStats.total}</Text>
            <Text style={styles.statText}>🟢 On Shift: {teamStats.onShift}</Text>
            <Text style={styles.statText}>🛌 On Leave: {teamStats.onLeave}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: TextColor,
    marginBottom: 10,
  },
  itemRow: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    color: TextColor,
  },
  itemMeta: {
    fontSize: 14,
    color: "#6C6C6C",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  statText: {
    fontSize: 16,
    marginBottom: 6,
    color: TextColor,
  },
});

export default ManagerDashboard;
