// LeaveRequestScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import {
  fetchAllLeaveRequestInAnOffice,
  updateLeaveRequestDetails,
} from "../../../api/leave/leaveApi";
import { ApiError } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";
import { Leave } from "../../../api/leave/leaveRequest";
import { all } from "axios";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  balance: number;
  totalDays: number;
  history?: LeaveRequest[];
  adminComment?: string;
}

const LeaveRequestScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "SchedulesScreen">>();
    const { officeId } = route.params;
  //const officeId = "51ffaeb3-e550-4659-b1dd-708f2d9a84f9";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("LeaveRequestScreen");
  const [allRequest, setAllRequest] = useState<Leave[] | null>(null);
  const [search, setSearch] = useState("");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [adminComment, setAdminComment] = useState("");
  const [selectedAction, setSelectedAction] = useState<
    "Approved" | "Rejected" | null
  >(null);

  const handleFetchGetAllSchedulesForOffice = async () => {
    try {
      const res = await fetchAllLeaveRequestInAnOffice({ officeId });
      if (res instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: res.message,
          position: "bottom",
        });
      } else {
        setAllRequest(res.data);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrReject = async (
    id: string,
    action: "Approved" | "Rejected"
  ) => {
    try {
      const res = await updateLeaveRequestDetails({
        officeId,
        id,
        isApproved: action === "Approved",
      });
      if (res instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: res.message,
          position: "bottom",
        });
      } else {
        if (res.statusCode === 200) {
          Toast.show({
            type: "success",
            text1: `Leave request ${action} successfully`,
            position: "bottom",
          });
          handleFetchGetAllSchedulesForOffice();
        }
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchGetAllSchedulesForOffice();
  }, []);

  const filtered = allRequest?.filter(
    (r) =>
      r.Employee?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      r.Employee?.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.colName]}>Employee</Text>
          <Text style={[styles.cell, styles.colType]}>Type</Text>
          <Text style={[styles.cell, styles.colRange]}>Date Range</Text>
          <Text style={[styles.cell, styles.colDays]}>Days</Text>
          <Text style={[styles.cell, styles.colReason]}>Reason</Text>

          <Text style={[styles.cell, styles.colStatus]}>Status</Text>
          <Text style={[styles.cell, styles.colActions]}>Actions</Text>
        </View>

        {filtered &&
          filtered.map((r) => (
            <View key={r.id} style={styles.row}>
              <Text style={[styles.cell, styles.colName]} numberOfLines={1}>
                {r.Employee?.firstName ?? "N/A"} {r.Employee?.lastName ?? ""}
              </Text>
              <Text style={[styles.cell, styles.colType]}>
                {r.leaveType ?? "N/A"}
              </Text>
              <Text style={[styles.cell, styles.colRange]}>
                {r.startDate ?? "N/A"} - {r.endDate ?? "N/A"}
              </Text>
              <Text style={[styles.cell, styles.colDays]}>1</Text>
              <Text style={[styles.cell, styles.colReason]}>
                {r.reason ?? "N/A"}
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.colStatus,
                  styles.status,
                  r.isApproved === true
                    ? styles.approved
                    : r.isApproved === false
                    ? styles.rejected
                    : styles.pending,
                ]}
              >
                {r.isApproved === true
                  ? "Approved"
                  : r.isApproved === false
                  ? "Rejected"
                  : "Pending"}
              </Text>
              <View style={[styles.cell, styles.colActions]}>
                <TouchableOpacity
                  onPress={() => handleAcceptOrReject(r.id!, "Approved")}
                  style={[styles.button, styles.approveBtn]}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAcceptOrReject(r.id!, "Rejected")}
                  style={[styles.button, styles.rejectBtn]}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    minHeight: 40,
  },
  headerRow: {
    backgroundColor: "#eaeaea",
  },
  cell: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    overflow: "hidden",
  },

  colName: { width: 250 },
  colType: { width: 120 },
  colRange: { width: 150 },
  colDays: { width: 60 },
  colReason: { width: 250 },

  colStatus: { width: 80 },
  colActions: {
    width: 160,
    flexDirection: "row",

    gap: 6,
  },

  status: {
    fontWeight: "bold",
  },
  approved: { color: "green" },
  rejected: { color: "red" },
  pending: { color: "orange" },

  button: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  approveBtn: {
    backgroundColor: "#2ECC71",
  },
  rejectBtn: {
    backgroundColor: "#E74C3C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default LeaveRequestScreen;
