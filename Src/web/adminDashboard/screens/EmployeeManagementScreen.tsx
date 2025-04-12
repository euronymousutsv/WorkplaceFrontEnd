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
  Modal,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { fetchAllUsers } from "../../../api/server/serverApi";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import { AxiosError } from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { EmployeeDetails } from "../../../api/server/server";
import { kickEmployee } from "../../../api/server/serverApi";
import {
  partialregisterEmployee,
  updateEmployeeDetails,
} from "../../../api/server/serverApi";
import { getLoggedInUserServer } from "../../../api/server/serverApi";
import { Role, EmployeeStatus } from "../../../api/server/server";
import { getToken, Plat, saveToken } from "../../../api/auth/token";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;

  status: string;
  profileImage?: string;
  joinedDate?: string;
  updatedDate?: string;
}

const formFields: (keyof Employee)[] = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phone",
  "role",

  "status",
];

const roles = ["Choose Role", "Admin", "Manager", "Employee"];
const statuses = ["Choose Employment Status", "Active", "Inactive"];

// Role mapper (string → Role enum)
const roleMapper: Record<"Admin" | "Manager" | "Employee", Role> = {
  Admin: Role.ADMIN,
  Manager: Role.MANAGER,
  Employee: Role.EMPLOYEE,
};

// Status mapper (string → EmployeeStatus type)
const statusMapper: Record<"Active" | "Inactive", EmployeeStatus> = {
  Active: {
    Active: "Active",
    Inactive: "Inactive",
  },
  Inactive: {
    Inactive: "Inactive",
    Active: "Active",
  },
};

const EmployeeManagementScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("EmployeeManagement");
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Employee>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",

    status: "",
  });
  const [errors, setErrors] = useState<{ [K in keyof Employee]?: string }>({});
  const [sortBy, setSortBy] = useState<keyof Employee | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const isMobile = screenWidth <= 768;
  const [employeesArr, setEmployeesArr] = useState<EmployeeDetails[]>([]);
  const [serverId, setServerId] = useState<string | null>(null);

  const handleFetchUsers = async () => {
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
      } else {
        const employeeList: Employee[] = res.data.map(
          (emp: EmployeeDetails) => {
            return {
              id: emp.Employee.id,
              //   firstNamename: `${emp.Employee.firstName} ${emp.Employee.lastName}`,
              firstName: emp.Employee.firstName,
              lastName: emp.Employee.lastName,
              email: emp.Employee.email,
              phone: emp.Employee.phoneNumber,
              role:
                emp.Employee.role.charAt(0).toUpperCase() +
                emp.Employee.role.slice(1),

              status:
                typeof emp.Employee.employmentStatus === "string"
                  ? emp.Employee.employmentStatus
                  : Object.keys(emp.Employee.employmentStatus)[0],
              profileImage: emp.Employee.profileImage ?? undefined,
              joinedDate: emp.createdAt
                ? new Date(emp.createdAt).toLocaleDateString()
                : "Unknown",
              updatedDate: emp.updatedAt
                ? new Date(emp.updatedAt).toLocaleDateString()
                : "Unknown",
            };
          }
        );

        //   console.log("✅ Mapped Employees:", employeeList);
        setEmployees(employeeList);

        Toast.show({
          text1: "Successfully fetched all employees",
          type: "success",
          position: "bottom",
          autoHide: true,
          swipeable: true,
        });
      }
    } catch (error) {
      console.log("Unexpected error during fetchAllUsers()");
    }
  };

  const fetchServerId = async () => {
    const token = await getToken("accessToken", Plat.WEB);

    console.log("Acess token:", token);
    console.log("--------------------------------------------------:", token);
    try {
      const res = await getLoggedInUserServer(Plat.WEB);
      console.log("🧪 getLoggedInUserServer response:", res);

      if (res instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: "Server ID Error",
          text2: res.message,
        });
      } else if ("statusCode" in res && "data" in res && res.data.serverId) {
        console.log("✅ Server ID found:", res.data.serverId);
        setServerId(res.data.serverId);
        saveToken("serverId", res.data.serverId, Plat.WEB);
      } else {
        console.warn("⚠️ Server ID not found in response data");
      }
    } catch (err) {
      console.error("❌ Unexpected error in fetchServerId:", err);
    }
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(Dimensions.get("window").width);
    const subscription = Dimensions.addEventListener("change", updateWidth);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    fetchServerId();
  }, []);

  const handleSort = (field: keyof Employee) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!formFields.includes(sortBy as keyof Employee)) return 0;
    const fieldA = a[sortBy as keyof Employee]?.toString().toLowerCase() || "";
    const fieldB = b[sortBy as keyof Employee]?.toString().toLowerCase() || "";
    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter(
    (emp: Employee) =>
      //   emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter((emp) => emp.status === "Active").length;
  const onLeaveCount = employees.filter(
    (emp) => emp.status === "On Leave"
  ).length;
  const terminatedCount = employees.filter(
    (emp) => emp.status === "Terminated"
  ).length;

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      status: emp.status,
      joinedDate: emp.joinedDate,
      updatedDate: emp.updatedDate,
      profileImage: emp.profileImage,
    });
    setModalVisible(true);
    setErrors({});
  };

  const handleKickEmployee = async (userId: string) => {
    try {
      const res = await kickEmployee(userId);
      if (res instanceof ApiError || res instanceof AxiosError) {
        Toast.show({
          text1: "Error",
          text2: res.message,
          type: "error",
          position: "bottom",
        });
      } else {
        Toast.show({
          text1: "Employee removed successfully",
          type: "success",
          position: "bottom",
        });

        // remove employee from local state
        setEmployees((prev) => prev.filter((emp) => emp.id !== userId));
      }
    } catch (error) {
      console.error("Unexpected error while kicking employee:", error);
    }
  };

  //validation
  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  const validatePhone = (phone: string) => /^(\+614|614|04)\d{8}$/.test(phone);

  const validateForm = () => {
    const newErrors: { [K in keyof Employee]?: string } = {};
    formFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });
    if (formData.role === "" || formData.role === "Choose Role")
      newErrors.role = "Role is required";
    if (
      formData.status === "" ||
      formData.status === "Choose Employment Status"
    )
      newErrors.status = "Employment status is required";
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!validatePhone(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!editingEmployee && employees.find((emp) => emp.id === formData.id))
      newErrors.id = "Employee ID must be unique";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    //todo : cors error
    if (!validateForm()) return;

    const roleNormalized = formData.role.trim();

    if (editingEmployee) {
      try {
        const payload = {
          id: formData.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          role: roleMapper[formData.role as "Admin" | "Manager" | "Employee"],
          employmentStatus:
            statusMapper[formData.status as "Active" | "Inactive"],
        };

        const res = await updateEmployeeDetails(payload);

        if (res instanceof ApiError || res instanceof AxiosError) {
          Toast.show({
            text1: "Error",
            text2: res.message,
            type: "error",
            position: "bottom",
          });
          return;
        }

        await handleFetchUsers(); // refresh list after update

        Toast.show({
          text1: "Employee updated successfully!",
          type: "success",
          position: "bottom",
        });
      } catch (error) {
        console.error("Unexpected error while updating employee:", error);
      }
    } else {
      if (!serverId) {
        Toast.show({
          text1: "Error",
          text2: "Server ID not found. Please refresh the page.",
          type: "error",
          position: "bottom",
        });
        return;
      }

      try {
        const payload = {
          serverId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          //   role: Role[roleNormalized.toUpperCase() as keyof typeof Role],
          role: roleNormalized as any, // adjust if Role enum
        };

        const res = await partialregisterEmployee(payload);

        if (res instanceof ApiError || res instanceof AxiosError) {
          Toast.show({
            text1: "Error",
            text2: res.message,
            type: "error",
            position: "bottom",
          });
          return;
        }

        // Refresh list after successful registration
        await handleFetchUsers();

        Toast.show({
          text1: "Employee created successfully!",
          type: "success",
          position: "bottom",
        });
      } catch (error) {
        console.error("Unexpected error while creating employee:", error);
      }
    }

    // Reset modal
    setModalVisible(false);
    setEditingEmployee(null);
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      status: "",
    });
    setErrors({});
  };

  const handleInputChange = <K extends keyof Employee>(
    key: K,
    value: Employee[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.trim().toLowerCase()) {
      case "admin":
        return styles.adminBadge;
      case "manager":
        return styles.managerBadge;
      case "employee":
        return styles.employeeBadge;
      default:
        return { backgroundColor: "#999" };
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedTab={selectedTab}
        handleTabChange={setSelectedTab}
      />

      <View
        style={[
          styles.mainContent,
          { marginLeft: isMobile ? 0 : isSidebarOpen ? 250 : 0 },
        ]}
      >
        <Text style={styles.title}>
          Employee Management
          <TouchableOpacity
            onPress={handleFetchUsers}
            style={styles.reloadIcon}
          >
            <MaterialIcons name="refresh" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </Text>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Employee Status Summary
          </Text>
          <View style={{ flexDirection: "row", gap: 20, marginBottom: 20 }}>
            <Text>✅ Active: {activeCount}</Text>
            <Text>🟡 Inactive: {onLeaveCount}</Text>
            {/* <Text>❌ Terminated: {terminatedCount}</Text> */}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, ID, or email"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingEmployee(null);
              setFormData({
                id: "",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: "",

                status: "",
              });
              setModalVisible(true);
              setErrors({});
            }}
          >
            <Text style={{ color: "#fff" }}>+ Add Employee</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal={!isMobile}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>ID</Text>
              <Text style={styles.headerCell}>NAME</Text>
              <Text style={styles.headerCell}>EMAIL</Text>
              <Text style={styles.headerCell}>PHONE</Text>
              <Text style={styles.headerCell}>ROLE</Text>

              <Text style={styles.headerCell}>STATUS</Text>
              <Text style={styles.headerCell}>JOINED DATE</Text>
              <Text style={styles.headerCell}>UPDATED DATE</Text>
              <Text style={styles.headerCell}>ACTIONS</Text>
            </View>

            {filteredEmployees.map((emp, index) => (
              <View key={index} style={styles.row}>
                {formFields.map((field) => {
                  if (field === "firstName") {
                    return (
                      <View key="name" style={[styles.cell, styles.nameCell]}>
                        {emp.profileImage ? (
                          <Image
                            source={{ uri: emp.profileImage }}
                            style={styles.avatar}
                          />
                        ) : (
                          <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>
                              {getInitials(emp.firstName + " " + emp.lastName)}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.nameText}>
                          {emp.firstName} {emp.lastName}
                        </Text>
                      </View>
                    );
                  } else if (field === "lastName") {
                    return null;
                  } else if (field === "role") {
                    return (
                      <View
                        key={field}
                        style={[styles.cell, styles.roleBadgeWrapper]}
                      >
                        <Text
                          style={[
                            styles.roleBadge,
                            getRoleBadgeStyle(emp.role),
                          ]}
                        >
                          {emp.role}
                        </Text>
                      </View>
                    );
                  }
                  return (
                    <Text key={field} style={styles.cell}>
                      {emp[field] || "-"}
                    </Text>
                  );
                })}
                {/* Show these two fields separately */}
                <Text style={styles.cell}>{emp.joinedDate || "-"}</Text>
                <Text style={styles.cell}>{emp.updatedDate || "-"}</Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => handleEdit(emp)}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleKickEmployee(emp.id)}>
                    <Text style={[styles.actionText, { color: "red" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingEmployee ? "Edit" : "Add"} Employee
              </Text>
              {formFields.map((field) =>
                field === "role" ? (
                  <Picker
                    key={field}
                    selectedValue={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                    style={styles.input}
                  >
                    {roles.map((role) => (
                      <Picker.Item
                        key={role}
                        label={role}
                        value={role === "Choose Role" ? "" : role}
                      />
                    ))}
                  </Picker>
                ) : field === "status" ? (
                  <Picker
                    key={field}
                    selectedValue={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                    style={styles.input}
                  >
                    {statuses.map((status) => (
                      <Picker.Item
                        key={status}
                        label={status}
                        value={
                          status === "Choose Employment Status" ? "" : status
                        }
                      />
                    ))}
                  </Picker>
                ) : (
                  <View key={field}>
                    <TextInput
                      style={styles.input}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={formData[field]}
                      onChangeText={(text) =>
                        handleInputChange(field as keyof Employee, text)
                      }
                    />
                    {errors[field] && (
                      <Text style={{ color: "red", marginBottom: 6 }}>
                        {errors[field]}
                      </Text>
                    )}
                  </View>
                )
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={{ color: "#fff" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                  <Text style={{ color: "#fff" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  roleBadgeWrapper: { alignItems: "center" },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    overflow: "hidden",
    fontSize: 13,
  },
  adminBadge: { backgroundColor: "#8e44ad" },
  managerBadge: { backgroundColor: "#27ae60" },
  employeeBadge: { backgroundColor: "#2980b9" },
  container: { flex: 1, flexDirection: "row" },
  mainContent: { flex: 1, padding: 20, marginTop: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginRight: 10,
  },
  actionsRow: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
  addButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  table: { minWidth: 1000 },
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
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    paddingHorizontal: 68,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    // paddingHorizontal: 20,
    textAlign: "center",
  },
  actionButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  actionText: { color: "#4A90E2", textDecorationLine: "underline" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#888",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  reloadIcon: {
    marginLeft: 10,

    // padding: 4,
  },
  avatarCell: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  initialsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nameText: {
    fontWeight: "500",
  },
  nameCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 8,
  },
});

export default EmployeeManagementScreen;
