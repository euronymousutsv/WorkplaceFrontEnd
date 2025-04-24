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
import { getTimeLogByDateRange } from "../../../api/auth/clockinApi";
import { ApiError } from "../../../api/utils/apiResponse";

const ClockInOutScreen = () => {
  const route = useRoute();
  const { officeId } = route.params as { officeId: string };

  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [clockData, setClockData] = useState<any[]>([]);

  const isMobile = screenWidth <= 768;
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(Dimensions.get("window").width);
    const subscription = Dimensions.addEventListener("change", updateWidth);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      const startDate = searchDate || today;
      const endDate = searchDate || today;

      const res = await getTimeLogByDateRange(startDate, endDate, officeId);

      if (!(res instanceof ApiError)) {
        setClockData(res.data || []);
      }
    };

    fetchLogs();
  }, [officeId, searchDate]);

  const formatTime = (iso: string) =>
    iso
      ? new Date(iso).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const formatDate = (iso: string) =>
    iso ? new Date(iso).toISOString().slice(0, 10) : "—";

  const openMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url);
  };

  const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

  const handleDateChange = (text: string) => {
    setSearchDate(text);
    setDateError(
      isValidDate(text) || text === "" ? "" : "Invalid format. Use YYYY-MM-DD"
    );
  };

  const filteredData = clockData.filter((entry) => {
    const matchesEmployee = `${entry.Employee?.firstName ?? ""} ${entry.Employee?.lastName ?? ""}`
      .toLowerCase()
      .includes(searchEmployee.toLowerCase());
    return matchesEmployee;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Clock In/Out Records</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search employee..."
          value={searchEmployee}
          onChangeText={setSearchEmployee}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Filter by date (YYYY-MM-DD)"
          value={searchDate}
          onChangeText={handleDateChange}
        />
        {dateError !== "" && <Text style={styles.errorText}>{dateError}</Text>}

        <ScrollView horizontal={!isMobile}>
          <View style={[styles.table, isMobile && styles.mobileTable]}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Employee</Text>
              <Text style={styles.headerCell}>Clock In</Text>
              <Text style={styles.headerCell}>Clock Out</Text>
              <Text style={styles.headerCell}>Status</Text>
              <Text style={styles.headerCell}>Map</Text>
            </View>

            {filteredData.map((entry, index) => {
              const isToday = formatDate(entry.clockIn) === today;
              const status = entry.clockOut
                ? "✅ Clocked Out"
                : "🟢 Working";

              return (
                <View
                  key={index}
                  style={[styles.row, isToday && styles.todayRow]}
                >
                  <Text style={styles.cell}>{formatDate(entry.clockIn)}</Text>
                  <Text style={styles.cell}>
                    {entry.Employee?.firstName} {entry.Employee?.lastName}
                  </Text>
                  <Text style={styles.cell}>{formatTime(entry.clockIn)}</Text>
                  <Text style={styles.cell}>{formatTime(entry.clockOut)}</Text>
                  <Text style={styles.cell}>{status}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      openMap(entry.latitude ?? 0, entry.longitude ?? 0)
                    }
                  >
                    <Text style={[styles.cell, styles.mapLink]}>🗺️ View</Text>
                  </TouchableOpacity>
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
  container: { flex: 1, flexDirection: "row" },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#D9534F",
    marginBottom: 10,
    fontWeight: "bold",
  },
  table: { minWidth: 800 },
  mobileTable: { width: "100%" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  todayRow: {
    backgroundColor: "#e9f6ff",
  },
  headerCell: { flex: 1, fontWeight: "bold", paddingHorizontal: 8 },
  cell: { flex: 1, paddingHorizontal: 8 },
  mapLink: { color: "#4A90E2", textDecorationLine: "underline" },
});

export default ClockInOutScreen;
