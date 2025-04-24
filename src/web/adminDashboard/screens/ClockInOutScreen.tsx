import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getTimeLogByDateRange, updateTimeLog } from "../../../api/auth/clockinApi";
import { ApiError } from "../../../api/utils/apiResponse";
import { Feather } from "@expo/vector-icons";
import { approveHours } from "../../../api/payroll/payrollApi";
import Toast from "react-native-toast-message";

const ClockInOutScreen = () => {
  const route = useRoute();
  const { officeId } = route.params as { officeId: string };

  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [clockData, setClockData] = useState<any[]>([]);
  const [editedLogs, setEditedLogs] = useState<{ [id: string]: any }>({});

  const isMobile = screenWidth <= 768;
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 14);

  const formatISODate = (date: Date) => date.toISOString().split("T")[0];
  const formatDate = (iso: string) => (iso ? new Date(iso).toISOString().split("T")[0] : "—");
  const formatTime = (iso: string) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

  useEffect(() => {
    const updateWidth = () => setScreenWidth(Dimensions.get("window").width);
    const subscription = Dimensions.addEventListener("change", updateWidth);
    return () => subscription.remove();
  }, []);

  // useEffect(() => {
    const fetchLogs = async () => {
      const from = `${formatISODate(startDate)}T00:00:00Z`;
      const to = `${formatISODate(today)}T23:59:59Z`;
      const res = await getTimeLogByDateRange(from, to, officeId);
      if (!(res instanceof ApiError)) setClockData(res);
    };
  //   fetchLogs();
  // }, [officeId]);
  useEffect(() => {
    fetchLogs();
  }, [officeId]);


  const handleApprove = async (id: string) => {
    const res = await approveHours(id);
    if (!(res instanceof ApiError)) {
      Toast.show({
        type: "success",
        text1: "Approved!",
        text2: "Hours have been approved successfully ",
      });
      await fetchLogs();
    } else {
      Toast.show({
        type: "error",
        text1: "Approval Failed",
        text2: res.message || "Something went wrong.",
      });
    }
  };
  

  const handleEditChange = (id: string, field: string, value: string) => {
    setEditedLogs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const log = editedLogs[id];
    if (!log) return;
  
    const payload = {
      timeLogId: id,
      clockIn: log.clockIn ? new Date(log.clockIn) : undefined,
      clockOut: log.clockOut ? new Date(log.clockOut) : undefined,
      hasShift: log.hasShift === "Yes",
      clockInStatus: log.clockInStatus,
      clockOutStatus: log.clockOutStatus,
      clockInDiffInMin: parseInt(log.clockInDiffInMin),
      clockOutDiffInMin: parseInt(log.clockOutDiffInMin),
    };
  
    const res = await updateTimeLog(payload);
    if (!(res instanceof ApiError)) {
      Toast.show({
        type: "success",
        text1: "Saved Successfully",
        text2: "Time log has been updated ",
      });
      setEditedLogs((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: res.message || "Something went wrong",
      });
    }
  };
  console.log("Sample time log:", clockData[0]);
  const filteredData = clockData.filter((entry) => {
    const matchesEmployee = `${entry.Employee?.firstName} ${entry.Employee?.lastName}`
      .toLowerCase()
      .includes(searchEmployee.toLowerCase());
    return matchesEmployee;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Clock In/Out Records (Past 14 Days)</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search employee..."
          value={searchEmployee}
          onChangeText={setSearchEmployee}
        />

        <ScrollView horizontal={!isMobile}>
          <View style={[styles.table, isMobile && styles.mobileTable]}>
            <View style={styles.tableHeader}>
              {[
                "Date", "Name", "Clock In", "Clock Out",
                "ClockIn Status", "ClockOut Status", "Diff In/Out", "Has Shift",
                "Role", "Status", "Actions"
              ].map((header) => (
                <Text key={header} style={styles.headerCell}>{header}</Text>
              ))}
            </View>

            {filteredData.map((entry, index) => {
              const id = entry.id;
              const isToday =
                entry.clockIn &&
                new Date(entry.clockIn).toISOString().split("T")[0] ===
                  today.toISOString().split("T")[0];
              const changes = editedLogs[id] || {};
              return (
                <View key={id} style={[styles.row, isToday && styles.todayRow]}>
                  <Text style={styles.cell}>{formatDate(entry.clockIn)}</Text>
                  <Text style={styles.cell}>
                    {entry.Employee?.firstName} {entry.Employee?.lastName}
                  </Text>
                  <TextInput
                    style={styles.cellInput}
                    defaultValue={entry.clockIn}
                    onChangeText={(text) => handleEditChange(id, "clockIn", text)}
                  />
                  <TextInput
                    style={styles.cellInput}
                    defaultValue={entry.clockOut}
                    onChangeText={(text) => handleEditChange(id, "clockOut", text)}
                  />
                  <TextInput
                    style={styles.cellInput}
                    defaultValue={entry.clockInStatus}
                    onChangeText={(text) => handleEditChange(id, "clockInStatus", text)}
                  />
                  <TextInput
                    style={styles.cellInput}
                    defaultValue={entry.clockOutStatus}
                    onChangeText={(text) => handleEditChange(id, "clockOutStatus", text)}
                  />
                  <TextInput
                    style={styles.cellInput}
                    defaultValue={`${entry.clockInDiffInMin}`}
                    onChangeText={(text) => handleEditChange(id, "clockInDiffInMin", text)}
                  />
                  <TextInput
                    style={styles.cellInput}
                    defaultValue={`${entry.clockOutDiffInMin}`}
                    onChangeText={(text) => handleEditChange(id, "clockOutDiffInMin", text)}
                  />
                  <TextInput
                    style={styles.cellInput}
                    defaultValue={entry.hasShift ? "Yes" : "No"}
                    onChangeText={(text) => handleEditChange(id, "hasShift", text)}
                  />
                  <Text style={styles.cell}>{entry.Employee?.role}</Text>
                  <Text style={styles.cell}>{entry.Employee?.employmentStatus}</Text>
                  <View style={styles.actionCell}>
                  <TouchableOpacity onPress={() => handleSave(id)} style={styles.saveButton}>
                      <Feather name="save" size={16} color="#fff" />
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <View style={styles.approveRow}>
                      {entry.approved ? (
                        <Text style={styles.approvedLabel}> Approved</Text>
                      ) : (
                        <TouchableOpacity onPress={() => handleApprove(id)} style={styles.approveButton}>
                          <Feather name="check" size={16} color="#fff" />
                          <Text style={styles.approveButtonText}>Approve</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  searchInput: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6,
    padding: 10, marginBottom: 12,
  },
  table: { minWidth: 1000 },
  mobileTable: { width: "100%" },
  tableHeader: {
    flexDirection: "row", backgroundColor: "#eee",
    paddingVertical: 10, borderBottomWidth: 1, borderColor: "#ccc",
  },
  row: {
    flexDirection: "row", paddingVertical: 12,
    borderBottomWidth: 1, borderColor: "#f0f0f0",
  },
  headerCell: { flex: 1, fontWeight: "bold", paddingHorizontal: 0, minWidth: 150 },
  cell: { flex: 1, paddingHorizontal: 6, minWidth: 100 },
  cellInput: {
    flex: 1, paddingHorizontal: 6,
    borderWidth: 1, borderColor: "#ccc", borderRadius: 4,
    fontSize: 12,
  },
  actionCell: {
    flex: 1, paddingHorizontal: 6,
    alignItems: "center", justifyContent: "center",
  },
  saveBtn: { color: "#4A90E2", fontWeight: "bold", marginBottom: 6 },
  approveRow: { flexDirection: "row", gap: 10 },
  approveBtn: { color: "green", fontWeight: "bold" },
  rejectBtn: { color: "red", fontWeight: "bold" },
  todayRow: {
    backgroundColor: "#e9f6ff",
  },
  //approve button styles
  approveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  
  approveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  approvedLabel: {
    color: "green",
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e6f5e9",
  },
  
  //save button styles
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2", // primary blue
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    marginBottom: 8,
  },
  
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  
  
});

export default ClockInOutScreen;
