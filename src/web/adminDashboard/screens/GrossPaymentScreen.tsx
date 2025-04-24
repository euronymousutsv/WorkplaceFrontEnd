import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchApprovedHoursByOffice, sendApprovedHoursToPayroll } from "../../../api/payroll/payrollApi";
import { fetchAllUsers } from "../../../api/server/serverApi";
import { ApiError } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";

const hourlyRate = 30;

const GrossPaymentScreen = () => {
  const route = useRoute();
  const { officeId } = route.params as { officeId: string };

  const [approvedHours, setApprovedHours] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [payFrequency, setPayFrequency] = useState<"Weekly" | "Fortnightly" | "Monthly">("Weekly");
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });

  const getDateRange = (frequency: "Weekly" | "Fortnightly" | "Monthly") => {
    const today = new Date();
    const endDate = today.toISOString().split("T")[0];
    const start = new Date(today);
    if (frequency === "Weekly") start.setDate(start.getDate() - 7);
    else if (frequency === "Fortnightly") start.setDate(start.getDate() - 14);
    else start.setDate(1);
    const startDate = start.toISOString().split("T")[0];
    return { startDate, endDate };
  };

  const fetchData = async () => {
    const { startDate, endDate } = getDateRange(payFrequency);
    setDateRange({ startDate, endDate });

    const approvedRes = await fetchApprovedHoursByOffice(startDate, endDate, officeId);
    const usersRes = await fetchAllUsers();

    if (approvedRes instanceof ApiError || usersRes instanceof ApiError) return;

    const employeeMap: Record<string, { name: string; email: string }> = {};
    usersRes.data.forEach((user) => {
      employeeMap[user.id] = {
        name: `${user.Employee.firstName} ${user.Employee.lastName}`,
        email: user.Employee.email,
      };
    });

    const approved = approvedRes.data
      .filter((a) => !a.payrollId)
      .map((entry) => ({
        ...entry,
        name: employeeMap[entry.employeeId]?.name ?? "Unknown",
        email: employeeMap[entry.employeeId]?.email ?? "—",
        gross: entry.totalHours * hourlyRate,
      }));

    const paid = approvedRes.data
      .filter((a) => a.payrollId)
      .map((entry) => ({
        ...entry,
        name: employeeMap[entry.employeeId]?.name ?? "Unknown",
        email: employeeMap[entry.employeeId]?.email ?? "—",
        gross: entry.totalHours * hourlyRate,
      }));

    setApprovedHours(approved);
    setPayrolls(paid);
  };

  const handleGeneratePayroll = async () => {
    const { startDate, endDate } = dateRange;
    const res = await sendApprovedHoursToPayroll(startDate, endDate, officeId);
    if (!(res instanceof ApiError)) {
      Toast.show({
        type: "success",
        text1: "Payroll generated successfully 🎉",
      });
      fetchData();
    } else {
      Toast.show({
        type: "error",
        text1: "Failed to generate payroll",
        text2: res.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [officeId, payFrequency]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payroll Management</Text>

      {/* Pay Frequency Selector */}
      <View style={styles.frequencyRow}>
        {["Weekly", "Fortnightly", "Monthly"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.frequencyBtn,
              payFrequency === f && { backgroundColor: "#4A90E2" },
            ]}
            onPress={() => setPayFrequency(f as any)}
          >
            <Text style={{ color: payFrequency === f ? "#fff" : "#4A90E2" }}>{f}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.generateBtn} onPress={handleGeneratePayroll}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Generate Payroll</Text>
        </TouchableOpacity>
      </View>

      {/* Approved Hours Table */}
      <Text style={styles.subtitle}>Approved Hours (Pending Payroll)</Text>
      {approvedHours.length === 0 ? (
        <Text style={{ fontStyle: "italic", color: "gray" }}>No approved hours to process.</Text>
      ) : (
        <ScrollView horizontal>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {["Emp ID", "Name", "Email", "Date", "Start", "End", "Hours", "Bonus", "Deduct", "Gross"].map((h) => (
                <Text key={h} style={styles.headerCell}>{h}</Text>
              ))}
            </View>
            {approvedHours.map((row) => (
              <View style={styles.row} key={row.id}>
                <Text style={styles.cell}>{row.employeeId.slice(0, 8)}...</Text>
                <Text style={styles.cell}>{row.name}</Text>
                <Text style={styles.cell}>{row.email}</Text>
                <Text style={styles.cell}>{row.date}</Text>
                <Text style={styles.cell}>{row.startTime}</Text>
                <Text style={styles.cell}>{row.endTime}</Text>
                <Text style={styles.cell}>{row.totalHours.toFixed(2)}</Text>
                <Text style={styles.cell}>${row.bonus ?? 0}</Text>
                <Text style={styles.cell}>${row.deductions ?? 0}</Text>
                <Text style={styles.cell}>${row.gross.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Payroll Table */}
      <Text style={styles.subtitle}>Payroll Processed</Text>
      {payrolls.length === 0 ? (
        <Text style={{ fontStyle: "italic", color: "gray" }}>No payrolls found.</Text>
      ) : (
        <ScrollView horizontal>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {["Emp ID", "Name", "Email", "Date", "Hours", "Bonus", "Deduct", "Gross"].map((h) => (
                <Text key={h} style={styles.headerCell}>{h}</Text>
              ))}
            </View>
            {payrolls.map((row) => (
              <View style={styles.row} key={row.id}>
                <Text style={styles.cell}>{row.employeeId.slice(0, 8)}...</Text>
                <Text style={styles.cell}>{row.name}</Text>
                <Text style={styles.cell}>{row.email}</Text>
                <Text style={styles.cell}>{row.date}</Text>
                <Text style={styles.cell}>{row.totalHours.toFixed(2)}</Text>
                <Text style={styles.cell}>${row.bonus ?? 0}</Text>
                <Text style={styles.cell}>${row.deductions ?? 0}</Text>
                <Text style={styles.cell}>${row.gross.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 14 },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  frequencyRow: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 10 },
  frequencyBtn: {
    borderWidth: 1,
    borderColor: "#4A90E2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  generateBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: "auto",
  },
  table: { minWidth: 1100 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerCell: { flex: 1, fontWeight: "bold", textAlign: "center", fontSize: 13 },
  cell: { flex: 1, textAlign: "center", fontSize: 12 },
});

export default GrossPaymentScreen;
