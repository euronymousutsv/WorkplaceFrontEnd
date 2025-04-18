// GrossPaymentScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

interface GrossPayment {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payFrequency: "Weekly" | "Fortnightly" | "Monthly";
  hoursWorked: number;
  hourlyRate: number;
  bonuses?: number;
  deductions?: number;
  grossPay: number;
  netPay: number;
  status: "Pending" | "Approved" | "Paid";
}

const calculateTax = (gross: number): number => {
  if (gross <= 300) return 0;
  if (gross <= 500) return gross * 0.1;
  if (gross <= 800) return gross * 0.15;
  if (gross <= 1200) return gross * 0.2;
  return gross * 0.25;
};

const DEFAULT_PAY_FREQUENCY: GrossPayment["payFrequency"] = "Fortnightly";

const initialPayments: GrossPayment[] = [
  {
    id: "PAY001",
    employeeId: "EMP001",
    employeeName: "Sabin",
    payPeriodStart: "2024-04-01",
    payPeriodEnd: "2024-04-07",
    payFrequency: DEFAULT_PAY_FREQUENCY,
    hoursWorked: 38,
    hourlyRate: 30,
    bonuses: 100,
    deductions: 50,
    grossPay: 1190,
    netPay: 1140,
    status: "Pending",
  },
  {
    id: "PAY002",
    employeeId: "EMP002",
    employeeName: "Pranish",
    payPeriodStart: "2024-04-01",
    payPeriodEnd: "2024-04-07",
    payFrequency: DEFAULT_PAY_FREQUENCY,
    hoursWorked: 40,
    hourlyRate: 28,
    bonuses: 0,
    deductions: 30,
    grossPay: 1150,
    netPay: 1120,
    status: "Approved",
  },
];

const GrossPaymentScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("GrossPaymentScreen");
  const [payments, setPayments] = useState<GrossPayment[]>(initialPayments);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<GrossPayment | null>(null);
  const [globalPayFrequency, setGlobalPayFrequency] = useState<
    GrossPayment["payFrequency"]
  >(DEFAULT_PAY_FREQUENCY);
  const [search, setSearch] = useState("");

  const handleEdit = (payment: GrossPayment) => {
    setFormData(payment);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Delete this payment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setPayments((prev) => prev.filter((p) => p.id !== id));
        },
      },
    ]);
  };

  const handleInputChange = (
    key: keyof GrossPayment,
    value: string | number
  ) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSave = () => {
    if (!formData) return;
    const updatedGrossPay =
      formData.hoursWorked * formData.hourlyRate + (formData.bonuses || 0);
    const updatedDeductions = calculateTax(updatedGrossPay);
    const updatedNetPay = updatedGrossPay - updatedDeductions;
    const newData = {
      ...formData,
      payFrequency: globalPayFrequency,
      grossPay: updatedGrossPay,
      deductions: updatedDeductions,
      netPay: updatedNetPay,
    };

    setPayments((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === newData.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newData;
        return updated;
      }
      return [...prev, newData];
    });
    setModalVisible(false);
    setFormData(null);
  };

  const getStatusBadgeStyle = (status: GrossPayment["status"]) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: "#27ae60",
          color: "white",
          padding: 4,
          borderRadius: 4,
        };
      case "Paid":
        return {
          backgroundColor: "#2980b9",
          color: "white",
          padding: 4,
          borderRadius: 4,
        };
      default:
        return {
          backgroundColor: "#f39c12",
          color: "white",
          padding: 4,
          borderRadius: 4,
        };
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedTab={selectedTab}
        handleTabChange={setSelectedTab}
      /> */}
      <View
        style={[
          styles.mainContent,
          // { marginLeft: isSidebarOpen ? 250 : 0 }
        ]}
      >
        <Text style={styles.title}>Gross Payments</Text>

        <TextInput
          style={styles.input}
          placeholder="Search by Employee Name or ID"
          value={search}
          onChangeText={setSearch}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ marginRight: 10 }}>Pay Frequency:</Text>
          <Picker
            selectedValue={globalPayFrequency}
            onValueChange={(value) =>
              setGlobalPayFrequency(value as GrossPayment["payFrequency"])
            }
            style={{ flex: 1 }}
          >
            {["Weekly", "Fortnightly", "Monthly"].map((freq) => (
              <Picker.Item label={freq} value={freq} key={freq} />
            ))}
          </Picker>
        </View>

        <ScrollView horizontal>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {[
                "ID",
                "Name",
                "Pay Period",
                "Freq",
                "Hours",
                "Rate",
                "Bonus",
                "Tax",
                "Gross",
                "Net",
                "Status",
                "Actions",
              ].map((h) => (
                <Text style={styles.headerCell} key={h}>
                  {h}
                </Text>
              ))}
            </View>
            {filteredPayments.map((p) => (
              <View key={p.id} style={styles.row}>
                <Text style={styles.cell}>{p.id}</Text>
                <Text style={styles.cell}>{p.employeeName}</Text>
                <Text
                  style={styles.cell}
                >{`${p.payPeriodStart} - ${p.payPeriodEnd}`}</Text>
                <Text style={styles.cell}>{p.payFrequency}</Text>
                <Text style={styles.cell}>{p.hoursWorked}</Text>
                <Text style={styles.cell}>${p.hourlyRate}</Text>
                <Text style={styles.cell}>${p.bonuses ?? 0}</Text>
                <Text style={styles.cell}>${p.deductions ?? 0}</Text>
                <Text style={styles.cell}>${p.grossPay}</Text>
                <Text style={styles.cell}>${p.netPay}</Text>
                <Text style={[styles.cell, getStatusBadgeStyle(p.status)]}>
                  {p.status}
                </Text>
                <View style={styles.cell}>
                  <TouchableOpacity onPress={() => handleEdit(p)}>
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(p.id)}>
                    <Text style={{ color: "red" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <Text
          style={{
            marginTop: 10,
            fontStyle: "italic",
            fontSize: 12,
            color: "gray",
          }}
        >
          *Note: Tax calculations are approximate and for demonstration purposes
          only.
        </Text>

        <Text style={styles.chartTitle}>Salary Insights</Text>
        <BarChart
          data={{
            labels: filteredPayments.map((p) => p.employeeName),
            datasets: [{ data: filteredPayments.map((p) => p.netPay) }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#f7f7f7",
            backgroundGradientFrom: "#f7f7f7",
            backgroundGradientTo: "#f7f7f7",
            decimalPlaces: 2,
            color: () => "#4A90E2",
            labelColor: () => "#333",
          }}
          style={{ marginTop: 20, borderRadius: 10 }}
        />

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000099",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
              >
                Edit Hourly Rate
              </Text>
              {formData && (
                <>
                  <Text style={styles.inputLabel}>
                    Employee: {formData.employeeName}
                  </Text>
                  <Text style={styles.inputLabel}>
                    Hours Worked: {formData.hoursWorked}
                  </Text>
                  <Text style={styles.inputLabel}>
                    Bonuses: ${formData.bonuses ?? 0}
                  </Text>
                  <Text style={styles.inputLabel}>
                    Tax Deduction: ${formData.deductions ?? 0}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Hourly Rate"
                    keyboardType="numeric"
                    value={formData.hourlyRate.toString()}
                    onChangeText={(text) =>
                      handleInputChange("hourlyRate", parseFloat(text) || 0)
                    }
                  />
                  <Picker
                    selectedValue={formData.status}
                    onValueChange={(value) =>
                      handleInputChange(
                        "status",
                        value as GrossPayment["status"]
                      )
                    }
                  >
                    {["Pending", "Approved", "Paid"].map((status) => (
                      <Picker.Item label={status} value={status} key={status} />
                    ))}
                  </Picker>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={[
                        styles.addButton,
                        { backgroundColor: "#aaa", marginRight: 10 },
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSave}
                      style={styles.addButton}
                    >
                      <Text style={{ color: "#fff" }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  mainContent: {
    flex: 1,
    padding: 20,
    // marginTop: 60
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  chartTitle: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  addButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: { minWidth: 1100 },
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
    borderColor: "#eee",
  },
  headerCell: { flex: 1, fontWeight: "bold", textAlign: "center" },
  cell: { flex: 1, textAlign: "center" },
});

export default GrossPaymentScreen;
