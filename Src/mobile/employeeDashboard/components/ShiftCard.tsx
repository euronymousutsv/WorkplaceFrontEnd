import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Shifts } from "../../../api/auth/shiftApi";

interface Shift {
  id: string;
  // location: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

const ShiftCard = ({ shift }: { shift: Shifts }) => {
  const [canClockIn, setCanClockIn] = useState(false);
  const startTime = new Date(shift.startTime); // Convert string to Date
  const endTime = new Date(shift.endTime);

  useEffect(() => {
    const checkClockIn = () => {
      const now = new Date();
      const diff = (startTime.getTime() - now.getTime()) / (1000 * 60);
      setCanClockIn(diff <= 15 && diff >= 0);
    };

    const timer = setInterval(checkClockIn, 60000);
    checkClockIn();

    return () => clearInterval(timer);
  }, [shift.startTime]);

  // //for testing clock in button
  // useEffect(() => {
  //     setCanClockIn(true);  // Always show the button for testing purposes
  //   }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.location}>{"Kathmandu"}</Text>
      <Text style={styles.description}>{"shift.description"}</Text>

      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={16} color="#4A90E2" />
        <Text style={styles.time}>
          {startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {endTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {canClockIn && (
        <TouchableOpacity style={styles.clockInButton}>
          <Text style={styles.clockInButtonText}>Clock In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  location: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#393D3F",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  clockInButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  clockInButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ShiftCard;
