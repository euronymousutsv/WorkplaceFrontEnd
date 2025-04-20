import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  getAllOffices,
  updateOffice,
  getAllEmployeeInOffice,
  joinEmployeeToOffice,
} from "../../../api/office/officeApi";
import { fetchAllUsers } from "../../../api/server/serverApi";
import { Plat, getToken } from "../../../api/auth/token";
import { ApiError } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";
import axios, { AxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import { StackNavigationProp} from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigationTypes";
type NavigationProp = StackNavigationProp<RootStackParamList, 'SchedulesScreen'>;

const OfficeDetailAdmin = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { officeId, officeName } = route.params as {
    officeId: string;
    officeName: string;
  };

  const [officeDetail, setOfficeDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addEmployeeModalVisible, setAddEmployeeModalVisible] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [resolvedAddress, setResolvedAddress] = useState<string>("");

  const fetchOfficeInfo = async () => {
    try {
      const serverId = await getToken("serverId", Plat.WEB);
      if (!serverId) {
        Toast.show({ type: "error", text1: "Server ID is missing" });
        return;
      }
  
      const res = await getAllOffices({ serverId });
      if (!(res instanceof ApiError) && Array.isArray(res.data)) {
        const office = res.data.find((o) => o.id === officeId);
        if (!office) return;
  
        setOfficeDetail(office);
  
        const lat = Number(office.latitude);
        const lon = Number(office.longitude);
  
        if (!isNaN(lat) && !isNaN(lon)) {
          const address = await reverseGeocode(lat, lon);
          setResolvedAddress(address);
        }
      }
    } catch (err) {
      console.error("Failed to fetch office info", err);
    }
  };

  const fetchOfficeEmployees = async () => {
    try {
      console.log("Fetching employees linked to office:", officeId);
  
      const joinedRes = await getAllEmployeeInOffice({ officeId });
      console.log("Raw joinedRes:", joinedRes);
  
      const joinedEmployeeIds = Array.isArray((joinedRes as any)?.data)
        ? (joinedRes as any).data.map((entry: any) => entry.id)
        : [];
  
      console.log("Joined employee IDs:", joinedEmployeeIds);
  
      // Fetch all users from the server
      const allUsersRes = await fetchAllUsers();
  
      if (!(allUsersRes instanceof ApiError)) {
        const matchedEmployees = allUsersRes.data
          .map((empWrapper: any) => empWrapper.Employee)
          .filter((emp: any) => joinedEmployeeIds.includes(emp.id))
          .map((emp: any) => ({
            id: emp.id,
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phoneNumber: emp.phoneNumber,
            role: emp.role,
            profileImage: emp.profileImage,
            status: emp.employmentStatus,
          }));
  
        console.log("Final employee details:", matchedEmployees);
        setEmployees(matchedEmployees);
      }
    } catch (err) {
      console.error("Unexpected error in fetchOfficeEmployees()", err);
    }
  };
  
  
  

  const fetchAvailableEmployees = async () => {
    try {
      const res = await fetchAllUsers();
  
      if (res instanceof ApiError || res instanceof AxiosError) {
        console.log(res.message);
        Toast.show({
          text1: "Error",
          text2: res.message,
          type: "error",
          position: "bottom",
        });
        return;
      }
  
      const mapped = res.data.map((emp: any) => {
        return {
          id: emp.Employee.id,
          firstName: emp.Employee.firstName,
          lastName: emp.Employee.lastName,
          email: emp.Employee.email,
          phone: emp.Employee.phoneNumber,
          role:
            emp.Employee.role.charAt(0).toUpperCase() +
            emp.Employee.role.slice(1),
          status: emp.Employee.employmentStatus,
          profileImage: emp.Employee.profileImage ?? undefined,
        };
      });
  
      const filtered = mapped.filter(
        (emp: any) => !employees.find((e) => e.id === emp.id)
      );
  
      setAvailableEmployees(filtered);
    } catch (err) {
      console.error("Unexpected error in fetchAvailableEmployees()", err);
    }
  };
  
  

  const handleAddEmployee = async (employeeId: string) => {
    try {
      const res = await joinEmployeeToOffice({ officeId, employeeId });
      if (res instanceof ApiError) throw res;
  
      Toast.show({ type: "success", text1: "Employee added successfully" });
      setAddEmployeeModalVisible(false);
  
      // Refresh both lists
      fetchOfficeEmployees();
      fetchAvailableEmployees();
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to add employee" });
    }
  };
  

  useEffect(() => {
    fetchOfficeInfo();
    fetchOfficeEmployees();
    setLoading(false);
  }, []);

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
    return null;
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return "Unknown address";
    }
  };
  
  const handleSave = async () => {
    try {
      const updates = [
        { editField: "name", newValue: officeDetail.name },
        { editField: "radius", newValue: String(officeDetail.radius) },
      ];
  
      //  Geocode address to get lat/lon
      if (officeDetail.address) {
        const coords = await geocodeAddress(officeDetail.address);
        if (coords) {
          updates.push(
            { editField: "latitude", newValue: coords.lat },
            { editField: "longitude", newValue: coords.lon }
          );
        }
      }
  
      // Loop through all updates
      for (const update of updates) {
        const res = await updateOffice({
          officeId,
          editField: update.editField as "name" | "radius" | "latitude" | "longitude",
          newValue: update.newValue,
        });
  
        if (res instanceof ApiError) {
          Toast.show({ type: "error", text1: res.message });
          return;
        }
      }
  
      Toast.show({ type: "success", text1: "Office updated successfully" });
      setEditModalVisible(false);
      fetchOfficeInfo();
    } catch (err) {
      console.error("Update failed:", err);
      Toast.show({ type: "error", text1: "Failed to update office" });
    }
  };
  
  
  if (loading || !officeDetail)
    return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{officeDetail.name}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={() => {
            fetchAvailableEmployees();
            setAddEmployeeModalVisible(true);
          }} style={styles.addBtn}>
            <Text style={styles.buttonText}>+ Add Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            style={styles.editIconBtn}
          >
            <Text style={styles.editIconText}><Feather name="edit" size={18} color="#4A90E2" /></Text>
          </TouchableOpacity>
        </View>
      </View>
      

      <View style={styles.card}>
        <Text style={styles.label}>Address</Text>
        {/* <Text style={styles.staticText}>{officeDetail.address}</Text> */}
        <Text style={styles.staticText}>{resolvedAddress || "Loading address..."}</Text>

        <Text style={styles.label}>Radius (meters)</Text>
        <Text style={styles.staticText}>{officeDetail.radius}</Text>
      </View>

      <TouchableOpacity
  style={styles.scheduleButton}
  onPress={() => navigation.navigate("SchedulesScreen", { officeId })}
>
  <Text style={styles.scheduleButtonText}>View Schedules for this Office</Text>
</TouchableOpacity>

      <Text style={styles.employeeHeader}>Employees ({employees.length})</Text>

      {employees.length === 0 ? (
        <Text style={styles.emptyText}>
          No employees assigned to this office yet.
          {"\n"}You can add employees using the "+ Add Employee" button.
        </Text>
      ) : (
        <View>
          <View style={styles.employeeTableHeader}>
            <Text style={styles.tableHeaderText}>Photo</Text>
            <Text style={styles.tableHeaderText}>Name</Text>
            <Text style={styles.tableHeaderText}>Email</Text>
            <Text style={styles.tableHeaderText}>Phone</Text>
            <Text style={styles.tableHeaderText}>Role</Text>
          </View>
          <FlatList
            data={employees}
            renderItem={({ item }) => (
              <View style={styles.employeeRow}>
                <Image
                  source={{ uri: item.profileImage || "https://via.placeholder.com/40" }}
                  style={styles.profileImg}
                />
                <Text style={styles.employeeText}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.employeeText}>{item.email}</Text>
                <Text style={styles.employeeText}>{item.phoneNumber}</Text>
                <Text style={styles.employeeText}>{item.role}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ minWidth: 800 }}
          />
        </View>
      )}

      {/* Edit Office Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Office</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={officeDetail.name || ""}
              onChangeText={(text) => setOfficeDetail({ ...officeDetail, name: text })}
            />
            <Text style={styles.label}>Radius (meters)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(officeDetail.radius || 100)}
              onChangeText={(text) =>
                setOfficeDetail({ ...officeDetail, radius: parseFloat(text) })
              }
            />
            <Text style={styles.label}>Address</Text>
<TextInput
  style={styles.input}
  value={officeDetail.address || ""}
  onChangeText={(text) => setOfficeDetail({ ...officeDetail, address: text })}
/>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Add Employee Modal */}
      <Modal visible={addEmployeeModalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Add Employee to Office</Text>

      <FlatList
        data={availableEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.employeeRow}
            onPress={() => handleAddEmployee(item.id)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: item.profileImage || "https://via.placeholder.com/32" }}
                style={styles.profileImg}
              />
              <Text style={styles.employeeText}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No available employees to add.</Text>
        }
      />

      <TouchableOpacity
        onPress={() => setAddEmployeeModalVisible(false)}
        style={[styles.button, styles.cancelButton, { marginTop: 10 }]}
      >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#F5F7FA", flex: 1 },
  scrollContent: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  title: { fontSize: 26, fontWeight: "700", color: "#1F2D3D" },
  addBtn: {
    padding: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 6,
    marginRight: 8,
  },
  editIconBtn: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
  },
  editIconText: { fontSize: 18 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 6,
  },
  staticText: {
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 12,
    color: "#333",
  },
  employeeHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  employeeTableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "600",
    fontSize: 14,
    color: "#555",
  },
  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "black",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  employeeText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  profileImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    paddingVertical: 12,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  employeeOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalActions: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: "center",
  },
  saveButton: { backgroundColor: "#28A745" },
  cancelButton: { backgroundColor: "#FFC107" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  scheduleButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  }
  
});

export default OfficeDetailAdmin;
