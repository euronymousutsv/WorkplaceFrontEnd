import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../../../api/auth/token";
import { getShiftsByEmployee } from "../../../api/auth/shiftApi";
import { ApiError } from "../../../api/utils/apiResponse";
import { getUserIdFromToken } from "../../../utils/jwt";
import { clockIn, clockOut, getTodaysTimeLog } from "../../../api/auth/clockinApi";
import * as Location from "expo-location";


const PrimaryColor = "#4A90E2";
const AccentColor = "#2ECC71";
const BackgroundColor = "#FDFDFF";
const TextColor = "#393D3F";

const ClockInOutScreenPhone: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftEndTime, setShiftEndTime] = useState<Date | null>(null);
  const [insideGeoFence, setInsideGeoFence] = useState(true);
  const [todaysShifts, setTodaysShifts] = useState<any[]>([]);
  const [activeShift, setActiveShift] = useState<any | null>(null);
  const [workDuration, setWorkDuration] = useState<number>(0); 
const [totalShiftDuration, setTotalShiftDuration] = useState<number>(1); 

const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // useEffect(() => {
  //   let interval: NodeJS.Timer;
  //   if (isClockedIn) {
  //     interval = setInterval(() => {
  //       setWorkDuration((prev) => prev + 1);
  //     }, 60000); // update every 1 minute
  //   }
  //   return () => clearInterval(interval);
  // }, [isClockedIn]);
  

  useEffect(() => {
    const fetchRelevantShifts = async () => {
       const employeeId = await getUserIdFromToken(); 
            if (!employeeId) {
              setError("Employee ID not found in token");
              setLoading(false);
              return;
            }
      const res = await getShiftsByEmployee(employeeId);
  
      if (res instanceof ApiError) {
        console.error("Failed to fetch shifts:", res.message);
        return;
      }
  
      const now = new Date();
      const oneHour = 60 * 60 * 1000;
  
      const filteredShifts = res.data.filter((shift) => {
        const shiftStart = new Date(shift.startTime);
        return new Date(shift.endTime) >= now && new Date(shift.startTime) <= new Date(now.getTime() + 15 * 60 * 1000);

      });
  
      setTodaysShifts(filteredShifts);
      if (filteredShifts.length > 0) {
        const current = filteredShifts.find((s) => {
          const start = new Date(s.startTime).getTime();
          const end = new Date(s.endTime).getTime();
          const nowTime = now.getTime();
        
          return nowTime >= start - 15 * 60 * 1000 && nowTime <= end;
        });
        
        setActiveShift(current ?? null);
        if (current) {setShiftEndTime(new Date(current.endTime));
      }else{
        setShiftEndTime(null);
      }
    }else{
      setActiveShift(null);
      setShiftEndTime(null);
    }
      }
    
  
    fetchRelevantShifts();
  }, []);
  

  // useEffect(() => {
  //   const today = new Date().toISOString().split("T")[0];
  //   const now = new Date();

  //   const shiftsToday = mockShifts.filter(
  //     (shift) => shift.date.toISOString().split("T")[0] === today
  //   );

  //   const current = shiftsToday.find(
  //     (shift) =>
  //       new Date(shift.startTime) <= now && new Date(shift.endTime) >= now
  //   );

  //   setTodaysShifts(shiftsToday);
  //   setActiveShift(current ?? null);
  //   if (current) setShiftEndTime(new Date(current.endTime));
  // }, [currentTime]);

  const handleClockInOut = async () => {
    if (!activeShift) return;
    const employeeId = await getUserIdFromToken();
    if (!employeeId) {
      setError("Employee ID not found in token");
      setLoading(false);
      return;
    }
  
    try {

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }
  

      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude.toString();
      const longitude = location.coords.longitude.toString();
  
  
   
      if (!isClockedIn) {

        const res = await clockIn({

          clockInTime: new Date(),
          lat: parseFloat(latitude),
          long: parseFloat(longitude),
  
        });

        if (res instanceof ApiError) {
          console.log("Clock-in Error:", res.message);
        
          let alertMessage = res.message;
          if (res.message === "Please clock in within the office area.") {
            alertMessage = "You are outside the allowed office zone. Please move closer and try again.";
          }
        
          Alert.alert("Clock-In Failed", alertMessage, [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ]);
        
          return;
        }
  
        if (!(res instanceof ApiError)) {
          setShiftEndTime(new Date(activeShift.endTime));
          setIsClockedIn(true);
          setCurrentTime(new Date());
        }
      } else {
        //  First, you need the timeLog ID to clock out
        const todayRes = await getTodaysTimeLog();
        if (todayRes instanceof ApiError || !todayRes.data || todayRes.data.length === 0) {
          console.warn("No active time log found for clock out.");
          return;
        }
  
        const latestTimeLog = todayRes.data[0]; // Assuming latest is first
        const timeLogId = latestTimeLog.id;
  
        const res = await clockOut({
          timeLogId,
          clockOutTime: new Date(),
          lat: parseFloat(latitude),
          long: parseFloat(longitude),
  
        });
  
        if (!(res instanceof ApiError)) {
          setShiftEndTime(null);
          setIsClockedIn(false);
        }
      }
    } catch (err) {
      console.error("Clock-in/out failed", err);
    }
  };
  
  

  const getCountdown = () => {
    if (!isClockedIn) return "Not clocked in";
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
    styles.bigButton,
    isClockedIn ? styles.finishWork : styles.startWork,
    !activeShift && !isClockedIn ? { opacity: 0.5 } : {},
  ]}
  disabled={!activeShift}
  onPress={handleClockInOut}
>
  <Ionicons
    name={isClockedIn ? "stop" : "play"}
    size={42}
    color="#000"
    style={styles.iconInside}
  />
  <Text style={styles.bigButtonText}>
    {isClockedIn ? "FINISH WORK" : "START WORK"}
  </Text>
</TouchableOpacity>


      {!isClockedIn ? (
  <Text style={styles.shiftMessage}>
    {activeShift
      ? `Your next shift starts in ${Math.round(
          (new Date(activeShift.startTime).getTime() - currentTime.getTime()) /
            (1000 * 60 * 60)
        )}h`
      : "No upcoming shifts"}
  </Text>
) : (
  <Text style={styles.shiftMessage}>
    You are currently working!!
  </Text>
)}

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
        {/* <View style={styles.iconRow}>
          <Ionicons name="location-outline" size={18} color={PrimaryColor} style={styles.icon} />
          <Text style={styles.shiftText}>Office ID: {shift.officeId}</Text>
        </View> */}

        {/* Description Row */}
        <View style={styles.iconRow}>
          <Ionicons name="document-text-outline" size={18} color={PrimaryColor} style={styles.icon} />
          <Text style={styles.shiftText}>{shift.notes}</Text>
        </View>
      </View>
    ))}
  </View>
) : (
  <Text style={styles.statusText}>You have no shifts today.</Text>
)}
      {/* Info Card */}

      <View style={styles.infoCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.infoText}>Location Status:</Text>
          <Text style={styles.infoText}>
            {insideGeoFence ? "Inside Zone" : "Outside Zone"}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.infoText}>Shift ends in:</Text>
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
  shiftMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginBottom: 30,
    paddingHorizontal: 10,
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
  //new
  bigButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 20,
  },
  
  startWork: {
    backgroundColor: "#f7f7f7",
  },
  
  finishWork: {
    backgroundColor: "#f7f7f7",
  },
  
  bigButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 8,
  },
  
  iconInside: {
    marginBottom: 8,
  }
  
  
});
