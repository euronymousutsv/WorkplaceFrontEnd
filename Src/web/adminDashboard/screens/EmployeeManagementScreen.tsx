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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { fetchAllUsers } from "../../../api/server/serverApi";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { EmployeeDetails } from "../../../api/server/server";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  status: string;
}

const initialEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Sabin",
    email: "sabin@example.com",
    phone: "0412345678",
    role: "Employee",
    location: "Melbourne",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Pranish",
    email: "pranish@example.com",
    phone: "0423456789",
    role: "Manager",
    location: "Sydney",
    status: "On Leave",
  },
  {
    id: "EMP003",
    name: "Aashish",
    email: "aashish@example.com",
    phone: "0434567890",
    role: "Employee",
    location: "Geelong",
    status: "Active",
  },
];

const formFields: (keyof Employee)[] = [
  "id",
  "name",
  "email",
  "phone",
  "role",
  "location",
  "status",
];
const roles = ["Choose Role", "Admin", "Manager", "Employee"];
const statuses = [
  "Choose Employment Status",
  "Active",
  "On Leave",
  "Terminated",
];

const EmployeeManagementScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("EmployeeManagement");
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Employee>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    location: "",
    status: "",
  });
  const [errors, setErrors] = useState<{ [K in keyof Employee]?: string }>({});
  const [sortBy, setSortBy] = useState<keyof Employee | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const isMobile = screenWidth <= 768;
  const [employeesArr, setEmployeesArr] = useState<EmployeeDetails[]>([]);
  const handleFetchUsers = async () => {
    try {
      const res = await fetchAllUsers();
      setEmployees([]);

      if (res instanceof ApiError || res instanceof AxiosError) {
        console.log(res.message);
        Toast.show({
          text1: "Error",
          text2: res.message,
          type: "error",
          position: "bottom",
        });
      } else {
        setEmployeesArr(res.data);
        Toast.show({
          text1: "Successfully fetched all employees",
          type: "success",
          position: "bottom",
          autoHide: true,
          swipeable: true,
        });
      }
    } catch (error) {
      console.log("?....");
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

  const handleSort = (field: keyof Employee) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortBy) return 0;
    const fieldA = a[sortBy].toString().toLowerCase();
    const fieldB = b[sortBy].toString().toLowerCase();
    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter(
    (emp: Employee) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
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
    setFormData(emp);
    setModalVisible(true);
    setErrors({});
  };

  const handleDelete = (empId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmed) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
    }
  };

  //validation
  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

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

  const handleSave = () => {
    if (!validateForm()) return;
    const roleNormalized = formData.role.trim();
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === formData.id ? { ...formData, role: roleNormalized } : emp
        )
      );
    } else {
      setEmployees((prev) => [...prev, { ...formData, role: roleNormalized }]);
    }
    setModalVisible(false);
    setEditingEmployee(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      location: "",
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
        <Text style={styles.title}>Employee Management</Text>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Employee Status Summary
          </Text>
          <View style={{ flexDirection: "row", gap: 20, marginBottom: 20 }}>
            <Text>✅ Active: {activeCount}</Text>
            <Text>🟡 On Leave: {onLeaveCount}</Text>
            <Text>❌ Terminated: {terminatedCount}</Text>
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
                name: "",
                email: "",
                phone: "",
                role: "",
                location: "",
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
              {formFields.map((field) => (
                <TouchableOpacity
                  key={field}
                  style={styles.headerCell}
                  onPress={() => handleSort(field)}
                >
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {field.toUpperCase()}{" "}
                    {sortBy === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.headerCell}>Actions</Text>
            </View>

            {filteredEmployees.map((emp, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{emp.id}</Text>
                <Text style={styles.cell}>{emp.name}</Text>
                <Text style={styles.cell}>{emp.email}</Text>
                <Text style={styles.cell}>{emp.phone}</Text>
                <View style={[styles.cell, styles.roleBadgeWrapper]}>
                  <Text style={[styles.roleBadge, getRoleBadgeStyle(emp.role)]}>
                    {emp.role}
                  </Text>
                </View>
                <Text style={styles.cell}>{emp.location}</Text>
                <Text style={styles.cell}>{emp.status}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => handleEdit(emp)}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(emp.id)}>
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
    paddingHorizontal: 8,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
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
});

export default EmployeeManagementScreen;
