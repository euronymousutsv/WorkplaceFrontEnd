import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const alerts = [
    { text: "Pranish was supposed to start working at 10. He has not clocked in yet.", time: "60 mins ago", type: "alert" },
    { text: "Pranish has requested for a leave this saturday", time: "10 min ago", type: "notification" },
    { text: "Sabin mentioned you in #Channel1", time: "10 min ago", type: "notification" }
  ];
  const toDos = [
    { task: "Place an order for tomorrow", due: "Due today" }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboardContainer}>
        {/* Sidebar (Left Section) */}
        <View style={styles.sidebar}>
          <Text style={styles.logo}>WorkHive</Text>
          <View style={styles.navLinks}>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Schedules</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Clock in/out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Gross Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>To do</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Leave Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Employee Manage..</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Performance Manage.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Setting</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Dashboard Content (Right Section) */}
        <View style={styles.mainContent}>
          {/* Alert Section */}
          <View style={styles.alertSection}>
            <Text style={styles.sectionTitle}>Alert</Text>
            <Text style={styles.alertText}>Pranish was supposed to start working at 10. He has not clocked in yet.</Text>
            <Text style={styles.time}>60 mins ago</Text>
          </View>

          {/* Notifications */}
          <View style={styles.notificationsSection}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {alerts.map((alert, index) => (
              <View key={index} style={[styles.notification, alert.type === "alert" && styles.alertNotification]}>
                <Text>{alert.text}</Text>
                <Text style={styles.time}>{alert.time}</Text>
              </View>
            ))}
          </View>

          {/* To-Do Section */}
          <View style={styles.toDoSection}>
            <Text style={styles.sectionTitle}>To-do’s</Text>
            <FlatList
              data={toDos}
              renderItem={({ item }) => (
                <View style={styles.toDoItem}>
                  <Text>{item.task}</Text>
                  <Text style={styles.dueText}>{item.due}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dashboardContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#F2F2F2',
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  navLinks: {
    marginTop: 20,
  },
  navLink: {
    marginBottom: 15,
  },
  navLinkText: {
    fontSize: 16,
    color: '#393D3F',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertSection: {
    backgroundColor: '#FFEBEB',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 16,
    color: '#FF0000',
  },
  time: {
    fontSize: 12,
    color: '#6C6C6C',
  },
  notificationsSection: {
    marginBottom: 20,
  },
  notification: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  alertNotification: {
    backgroundColor: '#FFD2D2',
  },
  toDoSection: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
  },
  toDoItem: {
    marginBottom: 15,
  },
  dueText: {
    fontSize: 12,
    color: '#6C6C6C',
  },
});

export default AdminDashboard;
