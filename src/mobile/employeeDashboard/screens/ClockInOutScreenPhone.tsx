import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockShifts } from "../../../mockData/mockShifts"; // mock part
import { RosterAttributes } from "../../../types/RosterAttributes"; // mock part

const PrimaryColor = "#4A90E2";
const AccentColor = "#2ECC71";
const BackgroundColor = "#FDFDFF";
const TextColor = "#393D3F";

const ClockInOutScreenPhone: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftEndTime, setShiftEndTime] = useState<Date | null>(null);
  const [insideGeoFence, setInsideGeoFence] = useState(true);
  const [todaysShifts, setTodaysShifts] = useState<RosterAttributes[]>([]); // mock part
  const [activeShift, setActiveShift] = useState<RosterAttributes | null>(null); // mock part

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const shiftsToday = mockShifts.filter(
      (shift) => shift.date.toISOString().split("T")[0] === today
    );

    const current = shiftsToday.find(
      (shift) =>
        new Date(shift.startTime) <= now && new Date(shift.endTime) >= now
    );

    setTodaysShifts(shiftsToday);
    setActiveShift(current ?? null);
    if (current) setShiftEndTime(new Date(current.endTime));
  }, [currentTime]);

  const handleClockInOut = () => {
    if (!activeShift) return;
    if (!isClockedIn) {
      setShiftEndTime(new Date(activeShift.endTime));
    } else {
      setShiftEndTime(null);
    }
    setIsClockedIn((prev) => !prev);
  };

  const getCountdown = () => {
    if (!shiftEndTime) return "--:--:--";
    const diff = shiftEndTime.getTime() - currentTime.getTime();
    if (diff <= 0) return "00:00:00";
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </Text>

      <Text style={styles.statusText}>
        {isClockedIn ? "✅ You are clocked in" : "⏱️ You are not clocked in"}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          isClockedIn ? styles.clockOut : styles.clockIn,
          !activeShift && !isClockedIn ? { opacity: 0.5 } : {},
        ]}
        disabled={!activeShift && !isClockedIn}
        onPress={handleClockInOut}
      >
        <Ionicons
          name={isClockedIn ? "log-out-outline" : "log-in-outline"}
          size={22}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>
          {isClockedIn ? "Clock Out" : "Clock In"}
        </Text>
      </TouchableOpacity>

      {/* mock part - list all today's shifts */}
      {todaysShifts.length > 0 ? (
  <View style={styles.shiftList}>
    {todaysShifts.map((shift) => (
      <View key={shift.id} style={styles.shiftCard}>
        {/* Time Row */}
        <View style={styles.iconRow}>
          <Ionicons name="time-outline" size={18} color={PrimaryColor} style={styles.icon} />
          <Text style={styles.shiftText}>
            {new Date(shift.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(shift.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Office Row */}
        <View style={styles.iconRow}>
          <Ionicons name="location-outline" size={18} color={PrimaryColor} style={styles.icon} />
          <Text style={styles.shiftText}>Office ID: {shift.officeId}</Text>
        </View>

        {/* Description Row */}
        <View style={styles.iconRow}>
          <Ionicons name="document-text-outline" size={18} color={PrimaryColor} style={styles.icon} />
          <Text style={styles.shiftText}>{shift.description}</Text>
        </View>
      </View>
    ))}
  </View>
) : (
  <Text style={styles.statusText}>You have no shifts today.</Text>
)}


      <View style={styles.infoCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.infoText}>📍 Location Status:</Text>
          <Text style={styles.infoText}>
            {insideGeoFence ? "Inside Zone" : "Outside Zone"}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.infoText}>⏳ Shift ends in:</Text>
          <Text style={styles.infoText}>{getCountdown()}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.infoText}>Mock Geofence Toggle:</Text>
          <Switch
            value={insideGeoFence}
            onValueChange={() => setInsideGeoFence((prev) => !prev)}
          />
        </View>
      </View>
    </View>
  );
};

export default ClockInOutScreenPhone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    color: PrimaryColor,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    color: TextColor,
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginBottom: 20,
  },
  clockIn: {
    backgroundColor: AccentColor,
  },
  clockOut: {
    backgroundColor: "#D9534F",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  infoCard: {
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: TextColor,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shiftList: {
    width: "100%",
  },
  shiftCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  
  icon: {
    color:'gray',
    opacity: 0.6,
    marginRight: 8,
  },
  
  shiftText: {
    fontSize: 14,
    color: TextColor,
    flexShrink: 1,
  },
  
});
