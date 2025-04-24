import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  createALeaveRequest,
  deleteLeaveRequest,
  fetchLeaveRequestForLoggedInEmployee,
} from "../../../api/leave/leaveApi";
import { LeaveTypeAttributes } from "../../../api/leave/leaveResponse";
import { Picker } from "@react-native-picker/picker";
import { Leave } from "../../../api/leave/leaveRequest";
import { ApiError } from "../../../api/utils/apiResponse";
import { Swipeable } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

// Mock data (Replace with backend integration later)
const mockLeaveHistory = [
  {
    id: "1",
    type: "Sick Leave",
    startDate: "2024-03-05",
    endDate: "2024-03-07",
    status: "Approved",
  },
  {
    id: "2",
    type: "Vacation",
    startDate: "2024-04-15",
    endDate: "2024-04-20",
    status: "Pending",
  },
];
const SCREEN_WIDTH = Dimensions.get("window").width;

// const LeaveScreen: React.FC<{ toggleMenu: () => void; toggleNotification: () => void }> = ({ toggleMenu, toggleNotification }) => {
const LeaveScreen = () => {
  const navigation = useNavigation();
  const [leaveType, setLeaveType] = useState<LeaveTypeAttributes>(
    LeaveTypeAttributes.PAID_LEAVE
  );
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [previousLeaves, setPreviousLeaves] = useState<Leave[] | null>(null);

  const handleApplyLeave = async () => {
    try {
      if (!startDate || !endDate || !leaveType || !reason) {
        Toast.show({
          type: "error",
          text1: "Please fill in all fields",
          position: "bottom",
        });
        return;
      }

      const res = await createALeaveRequest({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        reason,
        leaveType,
      });

      if (res instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: res.message,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Leave request submitted successfully",
          position: "bottom",
        });
        setLeaveType(LeaveTypeAttributes.PAID_LEAVE);
        setStartDate(new Date());
        setEndDate(new Date());
        setReason("");
      }

      fetchAllLeaveRequests();
    } catch (error) {
      if (error instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: error.message,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unexpected error occurred",
          position: "bottom",
        });
      }
    }
  };

  const fetchAllLeaveRequests = async () => {
    try {
      const res = await fetchLeaveRequestForLoggedInEmployee();
      if (res instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: res.message,
          position: "bottom",
        });
      } else {
        setPreviousLeaves(res);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleDeleteLeaveRequest = async (id: string) => {
    try {
      const res = await deleteLeaveRequest(id);
      if (res.statusCode === 200) {
        Toast.show({
          type: "success",
          text1: "Leave request deleted successfully",
          position: "bottom",
        });
        fetchAllLeaveRequests();
      } else {
        Toast.show({
          type: "error",
          text1: res.message,
          position: "bottom",
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: error.message,
          position: "bottom",
        });
      }
    }
  };

  React.useEffect(() => {
    fetchAllLeaveRequests();
  }, []);

  return (
    <ScrollView style={styles.contentContainer}>
      {openPicker && (
        <Modal
          visible={openPicker}
          animationType="slide"
          transparent
          onRequestClose={() => setOpenPicker(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setOpenPicker(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Select Leave Type</Text>

              <Picker
                selectedValue={leaveType}
                onValueChange={(itemValue) => setLeaveType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label="Paid Leave"
                  value={LeaveTypeAttributes.PAID_LEAVE}
                />
                <Picker.Item
                  label="Sick Leave"
                  value={LeaveTypeAttributes.SICK_LEAVE}
                />
                <Picker.Item
                  label="Vacation"
                  value={LeaveTypeAttributes.VACATION_LEAVE}
                />
                <Picker.Item
                  label="Unpaid Leave"
                  value={LeaveTypeAttributes.UNPAID_LEAVE}
                />
                <Picker.Item
                  label="Parental Leave"
                  value={LeaveTypeAttributes.PARANTIAL_LEAVE}
                />
              </Picker>
            </View>
          </View>
        </Modal>
      )}

      <SafeAreaView>
        <Text style={styles.sectionTitle}>Apply for Leave</Text>

        <TouchableOpacity>
          <Text style={styles.input} onPress={() => setOpenPicker(true)}>
            {leaveType}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color="#4A90E2"
            style={{ position: "absolute", right: 10, top: 15 }}
          />
        </TouchableOpacity>

        {/* Date Pickers */}

        <View style={styles.datePicker}>
          <Text>Start Date</Text>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            style={{ width: "100%" }} // Full width
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        </View>
        <View style={styles.datePicker}>
          <Text>End Date</Text>
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        </View>

        {/* Reason Input */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter Reason"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyLeave}>
          <Text style={styles.applyButtonText}>Apply Leave</Text>
        </TouchableOpacity>

        {/* ✅ Leave History Section */}
        <Text style={styles.sectionTitle}>Leave History</Text>

        {previousLeaves && previousLeaves.length > 0 ? (
          previousLeaves.map((leave) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("LeaveDetail");
              }}
              style={{ marginBottom: 10 }}
              key={leave.id}
            >
              <Swipeable
                key={leave.id}
                renderRightActions={() => (
                  <TouchableOpacity
                    onPress={() => handleDeleteLeaveRequest(leave.id!)}
                    style={{
                      backgroundColor: "#E74C3C",
                      width: 100,
                      height: "100%", // Ensure it stretches to full height of the row
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{ color: "white", padding: 5, fontWeight: "bold" }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}
              >
                <View style={styles.leaveCard}>
                  <Text style={styles.leaveType}>{leave.leaveType}</Text>
                  <Text style={styles.leaveDate}>Start: {leave.startDate}</Text>
                  <Text style={styles.leaveDate}>End: {leave.endDate}</Text>
                  <Text
                    style={[
                      styles.status,
                      leave.isApproved === true
                        ? styles.approved
                        : leave.isApproved === false
                        ? styles.rejected
                        : styles.pending,
                    ]}
                  >
                    {leave.isApproved === true
                      ? "Approved"
                      : leave.isApproved === false
                      ? "Rejected"
                      : "Pending"}
                  </Text>
                </View>
              </Swipeable>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noLeaveText}>No leave history available.</Text>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFF",
  },
  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    left: 10,
  },
  notificationButton: {
    position: "absolute",
    right: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  datePicker: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    height: 50,
    marginBottom: 10,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  applyButton: {
    backgroundColor: "#2ECC71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  leaveCard: {
    backgroundColor: "#F7F7F7",
    padding: 15,
    borderRadius: 10,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  leaveDate: {
    fontSize: 14,
    color: "#393D3F",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  approved: {
    color: "#2ECC71",
  },
  pending: {
    color: "#F39C12",
  },
  rejected: {
    color: "#D32F2F",
  },
  noLeaveText: {
    textAlign: "center",
    fontSize: 16,
    color: "#8E9196",
    marginTop: 20,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#000",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    height: 300,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  picker: {
    width: SCREEN_WIDTH - 32,
    alignSelf: "center",
    height: 200, // controlled height
  },
});

export default LeaveScreen;
