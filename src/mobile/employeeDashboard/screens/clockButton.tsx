// ClockInOutButton.tsx
import React, { useState } from "react";
import { View, Button, Alert, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

const VALIDATE_URL = "https://localhost:3000/validate-location";
const CLOCK_URL = "https://localhost:3000/clock-in-out";

type ClockStatus = "clockin" | "clockout" | "breakin" | "breakout";

export default function ClockInOutButton() {
  const [status, setStatus] = useState<ClockStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClockStatus = async (newStatus: ClockStatus) => {
    setLoading(true);

    try {
      // Step 1: Request permission & get location
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Step 2: Validate Location
      const validationRes = await fetch(VALIDATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      const validationData = await validationRes.json();
      if (!validationRes.ok || !validationData.valid) {
        Alert.alert("Invalid Location", validationData.message || "You are not in a valid location.");
        setLoading(false);
        return;
      }

      // Step 3: Send Clock-In/Out Status
      const res = await fetch(CLOCK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStatus(newStatus);
      Alert.alert("Success", `Status set to: ${newStatus}`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <>
          {status !== "clockin" && (
            <Button title="Clock In" onPress={() => handleClockStatus("clockin")} />
          )}
          {status === "clockin" && (
            <>
              <Button title="Break In" onPress={() => handleClockStatus("breakin")} />
              <Button title="Clock Out" onPress={() => handleClockStatus("clockout")} />
            </>
          )}
          {status === "breakin" && (
            <Button title="Break Out" onPress={() => handleClockStatus("breakout")} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
