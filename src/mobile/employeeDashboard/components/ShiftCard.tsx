import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Shifts } from "../../../api/auth/shiftApi";

interface Props {
  shift: Shifts;
}

const ShiftCard = ({ shift }: Props) => {
  const [canClockIn, setCanClockIn] = useState(false);
  const startTime = new Date(shift.startTime);
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

  
  return (
    <View style={styles.card}>
      {/* Office Name */}
      {/* <Text style={styles.location}>
        {shift.officeLocation?.name || "Office"}
      </Text> */}
      <View style={styles.headerRow}>
  <Feather name="briefcase" size={16} color="#4A90E2" style={{ marginRight: 6, marginBottom:5 }} />
  <Text style={styles.location}>Assigned Shift</Text>
</View>

      {/* Time */}
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={16} color="#4A90E2" />
        <Text style={styles.time}>
          {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
          -{" "}
          {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>

      {/* Notes/Description */}
      {shift.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={16} color="#6C757D" />
          <Text style={styles.notes}>{shift.notes}</Text>
        </View>
      )}

      {/* Status */}
      {/* status can go here in future */}


      {/* Clock In Button */}
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#393D3",
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  time: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
    marginLeft: 6,
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  notes: {
    fontSize: 14,
    color: "#6C757D",
    marginLeft: 6,
  },
  status: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
  },
  statusValue: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  clockInButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  clockInButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginTop: 8,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
});

export default ShiftCard;
