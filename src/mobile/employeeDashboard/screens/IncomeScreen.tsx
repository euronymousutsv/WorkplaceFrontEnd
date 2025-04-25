import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getPayrollForLoggedInUser,
  Payroll,
} from "../../../api/income/incomeApi";
import { ApiError } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

const IncomeScreen: React.FC = () => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [incomeData, setIncomeData] = useState<Payroll[] | null>(null);

  const handleFetchIncomes = async () => {
    try {
      const res = await getPayrollForLoggedInUser();
      if (res instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: res.message,
        });
      } else {
        setIncomeData(res);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An error occurred while fetching income data.",
      });
    }
  };

  useEffect(() => {
    handleFetchIncomes();
  }, []);

  const navigation = useNavigation();
  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {incomeData && incomeData.length > 0 ? (
          incomeData.map((item) => (
            <View key={item.id} style={styles.incomeCard}>
              <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                style={styles.cardHeader}
              >
                <View>
                  <Text style={styles.title}>Payroll Details</Text>

                  <Text style={styles.periodText}>
                    {dayjs(item.payPeriodStart).format("MM/DD/YYYY")} -{" "}
                    {dayjs(item.payPeriodEnd).format("MM/DD/YYYY")}
                  </Text>
                </View>

                <Ionicons
                  name={
                    expandedCardId === item.id ? "chevron-up" : "chevron-down"
                  }
                  size={24}
                  color="#4A90E2"
                />
              </TouchableOpacity>

              <Text style={styles.summaryText}>
                Total Earnings: ${item.netPay}
              </Text>

              {expandedCardId === item.id &&
                item.ApprovedHours &&
                item.ApprovedHours?.length > 0 && (
                  <View style={styles.detailsContainer}>
                    {item.ApprovedHours.map((shift) => (
                      <View key={shift.id} style={styles.shiftDetails}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.detailTitleText}>
                            Date: {shift.date}
                          </Text>
                          <Text>{dayjs(shift.date).fromNow(true)} ago</Text>
                        </View>
                        <Text style={styles.detailText}>
                          Hours Worked: {shift.totalHours} hrs
                        </Text>
                        <Text style={styles.detailText}>
                          Deductions: ${shift.deductions ? shift.deductions : 0}
                        </Text>
                        <Text style={styles.detailText}>
                          Bonus: ${shift.bonus ? shift.bonus : 0}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
            </View>
          ))
        ) : (
          <Text style={styles.noIncomeText}>No income records available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFF",
    padding: 10,
  },
  incomeCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  periodText: {
    fontSize: 14,
    color: "#666666",
  },
  summaryText: {
    fontSize: 14,
    color: "#393D3F",
    marginTop: 5,
  },
  detailsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 10,
  },
  shiftDetails: {
    backgroundColor: "#F7F7F7",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#393D3F",
  },
  downloadButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  detailTitleText: {
    fontSize: 16,
    color: "#393D3F",
    fontWeight: "bold",
    paddingBottom: 5,
    marginBottom: 5,
  },
  noIncomeText: {
    textAlign: "center",
    fontSize: 16,
    color: "#8E9196",
    marginTop: 20,
  },
});

export default IncomeScreen;
