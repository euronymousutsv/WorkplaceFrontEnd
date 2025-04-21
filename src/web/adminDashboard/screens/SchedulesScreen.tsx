// SchedulesScreen.tsx (Pro Version)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
import GridCalendarView from "../components/schedule/GridCalendarView";
import WebScheduleModal from "../components/schedule/WebScheduleModal";
import { fetchAllUsers } from "../../../api/server/serverApi";
import { EmployeeDetails } from "../../../api/server/server";
import { ApiError } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";
import { createShift, getShiftsByOffice, ShiftPayload, updateShift } from "../../../api/auth/shiftApi";
// import FilterControls from '../components/FilterControls';
import { RouteProp, useRoute } from "@react-navigation/native";
import { getShiftsByDateRangeForOffice } from "../../../api/auth/shiftApi";
import { RootStackParamList } from "../../../types/navigationTypes";
import { getAllEmployeeInOffice } from "../../../api/office/officeApi";




const SchedulesScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "SchedulesScreen">>();
  const { officeId } = route.params;
 
 
  const [activeTab, setActiveTab] = useState<"calendar" | "list" | "auto">(
    "calendar"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeNames, setEmployeeNames] = useState<
    { id: string; name: string }[]
  >([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [editingShift, setEditingShift] = useState<any | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);

  const isMobile = Dimensions.get("window").width <= 768;

  useEffect(() => {
    const fetchOfficeEmployees = async () => {
      try {
        const joinedRes = await getAllEmployeeInOffice({ officeId });
        const joinedEmployeeIds = Array.isArray((joinedRes as any)?.data)
          ? (joinedRes as any).data.map((entry: any) => entry.id)
          : [];
  
        const allUsersRes = await fetchAllUsers();
  
        if (!(allUsersRes instanceof ApiError)) {
          const matchedEmployees = allUsersRes.data
            .map((empWrapper: any) => empWrapper.Employee)
            .filter((emp: any) => joinedEmployeeIds.includes(emp.id))
            .map((emp: any) => ({
              id: emp.id,
              name: `${emp.firstName} ${emp.lastName}`,
            }));
  
          setEmployeeNames(matchedEmployees);
        }
      } catch (err) {
        console.error("Failed to load employees for this office", err);
      }
    };
  
    fetchOfficeEmployees();
  }, [officeId]);
  

  // Fetch shifts 
  useEffect(() => {
    const fetchShifts = async () => {
      const res = await getShiftsByOffice(officeId);
      console.log("🔍 Raw shift response for office:", res); 
      if (!(res instanceof ApiError)) {
        const mapped = res.data.map((shift) => {
          const fullName =
            employeeNames.find((emp) => emp.id === shift.employeeId)?.name || "Unknown";
        
          return {
            id: shift.id,
            employeeId: shift.employeeId,
            employeeName: fullName,
            start: shift.startTime,
            end: shift.endTime,
            notes: shift.notes || "",
          };
        });
        
        console.log("📦 Mapped Shifts:", mapped);
        setSchedules(mapped);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to fetch shifts",
          text2: res.message,
        });
      }
    };
  
    if (employeeNames.length > 0) {
      fetchShifts();
    }
  }, [officeId, employeeNames]);
  

  //todo (error: backend missing/incomplete)
  const handleSaveSchedule = async (
    newSchedule: ShiftPayload,
    isEditing = false,
    shiftId?: string
  ) => {
    const parsedStart = new Date(newSchedule.startTime);
    const parsedEnd = new Date(newSchedule.endTime);
  
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      Toast.show({
        type: "error",
        text1: "Invalid Time Format",
        text2: "Start or End time is invalid. Use YYYY-MM-DDTHH:mm format.",
      });
      return;
    }
    const employeeId = newSchedule.employeeId; // this will always be UUID
const name =
  employeeNames.find((e) => e.id === employeeId)?.name || "Unnamed Employee";
  
    const payload = {
      ...newSchedule,
      employeeId,
      startTime: parsedStart.toISOString(),
      endTime: parsedEnd.toISOString(),
    };
    const hasOverlap = schedules.some((shift) => {
      if (isEditing && shift.id === shiftId) return false; // Skip the current shift being edited

      const sameEmployee = shift.employeeId === employeeId;
      const newStart = parsedStart.getTime();
      const newEnd = parsedEnd.getTime();
      const existingStart = new Date(shift.start).getTime();
      const existingEnd = new Date(shift.end).getTime();
      return (
        sameEmployee &&
        ((newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd))
      );
    }
    );
    if (hasOverlap) {
      Toast.show({
        type: "error",
        text1: "Schedule Conflict",
        text2: `Shift for ${name} overlaps with an existing shift.`,
      });
      return;
    }
    if (parsedStart >= parsedEnd) {
      Toast.show({
        type: "error",
        text1: "Invalid Time Range",
        text2: "Start time must be before end time.",
      });
      return;
    }
    if (parsedStart < new Date()) {
      Toast.show({
        type: "error",
        text1: "Invalid Start Time",
        text2: "Start time cannot be in the past.",
      });
      return;
    }
    if (parsedEnd < new Date()) {
      Toast.show({
        type: "error",
        text1: "Invalid End Time",
        text2: "End time cannot be in the past.",
      });
      return;
    }
    if (parsedStart.getTime() === parsedEnd.getTime()) {
      Toast.show({
        type: "error",
        text1: "Invalid Time Range",
        text2: "Start time and end time cannot be the same.",
      });
      return;
    }
   
  
    try {
      let res;
  
      if (isEditing && shiftId) {
        res = await updateShift(shiftId, payload);
        Toast.show({
          type: "success",
          text1: "Shift updated successfully",
        });
      } else {
        res = await createShift(payload);
        Toast.show({
          type: "success",
          text1: "Shift created!",
          text2: "The shift has been added successfully.",
        });
      }
  
      // Refresh schedule list
      const name =
        employeeNames.find((e) => e.id === newSchedule.employeeId)?.name ||
        newSchedule.employeeId;
  
      const updatedShift = {
        id: shiftId ?? Date.now(), 
        employee: name,
        notes: newSchedule.notes,
        start: parsedStart.toISOString(),
        end: parsedEnd.toISOString(),
      };
  
      setSchedules((prev) =>
        isEditing
          ? prev.map((s) => (s.id === shiftId ? updatedShift : s))
          : [...prev, updatedShift]
      );
  
    } catch (err) {
      console.error("Unexpected error while saving shift:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong while saving the shift.",
      });
    }
  
    setModalVisible(false);
    setEditingShift(null);
  };
  
  
  

  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((shift) => shift.id !== id));
  };

  const filteredSchedules = schedules.filter((s) => {
    const matchEmployee = employeeFilter ? s.employee === employeeFilter : true;
    const matchLocation = locationFilter ? s.location === locationFilter : true;
    return matchEmployee && matchLocation;
  });

  const handleEditSchedule = (shift: any) => {
    setEditingShift(shift);
    setModalVisible(true);
  };

  const handleUpdateSchedule = (updatedShift: any) => {
    setSchedules((prev) =>
      prev.map((shift) => (shift.id === updatedShift.id ? updatedShift : shift))
    );
    setModalVisible(false);
    setEditingShift(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      /> */}
      {/* <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedTab="Schedules"
        handleTabChange={() => setActiveTab("calendar")}
      /> */}

      <View
        style={[
          styles.mainContent,
          // { marginLeft: isMobile ? 0 : isSidebarOpen ? 250 : 0 },
        ]}
      >
        {/* Tabs */}
        <View style={styles.tabBar}>
          {["calendar", "list", "auto"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={styles.tabText}>
                {tab === "calendar"
                  ? "Calendar View"
                  : tab === "list"
                  ? "List View"
                  : "Auto-Assign"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters
        <FilterControls
          employees={employees}
          locations={locations}
          employeeFilter={employeeFilter}
          locationFilter={locationFilter}
          setEmployeeFilter={setEmployeeFilter}
          setLocationFilter={setLocationFilter}
        /> */}

        {/* Content Views */}
        {activeTab === "calendar" && (
          <GridCalendarView
            schedules={filteredSchedules}
            onCellPress={(emp, date) => {
              setSelectedEmployee(emp);
              setSelectedDate(date);
              setModalVisible(true);
            }}
            onShiftPress={(shift) => {
              setEditingShift(shift); // Pass the selected shift
              setModalVisible(true);
            }}
          />
        )}

        {/* List View */}
        {activeTab === "list" && (
          <FlatList
            data={filteredSchedules}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.employee}</Text>
                <Text>
                  {new Date(item.start).toLocaleString()} -{" "}
                  {new Date(item.end).toLocaleString()}
                </Text>
                <Text>{item.location}</Text>
                <Text>{item.notes}</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditSchedule(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSchedule(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {activeTab === "auto" && (
          <View>
            <Text style={styles.autoAssignTitle}>
              Auto-Assign coming soon...
            </Text>
          </View>
        )}

        <WebScheduleModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingShift(null);
          }}
          onSave={(payload, isEditing, shiftId) =>
            handleSaveSchedule(payload, isEditing, shiftId)}
          onDelete={() => {
            if (editingShift) {
              handleDeleteSchedule(editingShift.id);
              setEditingShift(null);
              setModalVisible(false);
            }
          }}
          employees={employeeNames}
          officeId={officeId}
          selectedEmployee={selectedEmployee}
          selectedDate={selectedDate}
          editingShift={editingShift}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: {
    flex: 1,
    padding: 20,

    marginTop: 60
  },
  tabBar: { flexDirection: "row", gap: 10, marginBottom: 20 },
  tabButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  tabText: { fontSize: 16, fontWeight: "500" },
  listItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  bold: { fontWeight: "bold", fontSize: 16 },
  autoAssignTitle: { fontSize: 18, fontWeight: "bold", padding: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4A90E2",
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "#D9534F",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: { color: "#fff" },
});
export default SchedulesScreen;
