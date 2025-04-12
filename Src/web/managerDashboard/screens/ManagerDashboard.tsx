// src/components/ManagerDashboard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// Color variables from the palette
const PrimaryColor = '#4A90E2'; // Light Blue (Primary)
const AccentColor = '#2ECC71'; // Mint Green (Accent)
const BackgroundColor = '#FDFDFF'; // Off-White (Background)
const TextColor = '#393D3F'; // Charcoal Grey (Text)

const ManagerDashboard: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, Manager!</Text>
      </View>

      {/* Dashboard Actions Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Team Performance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Team Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.notificationsContainer}>
        <Text style={styles.notificationsTitle}>Notifications</Text>
        <Text style={styles.notificationsText}>You have 3 new updates</Text>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
    padding: 20,
  },
  header: {
    backgroundColor: PrimaryColor,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: AccentColor,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  notificationsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TextColor,
  },
  notificationsText: {
    fontSize: 14,
    color: TextColor,
  },
});

export default ManagerDashboard;
