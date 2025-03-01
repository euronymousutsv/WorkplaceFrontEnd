import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu'; // Import the Menu component
import Notification from './Notification';

const PrimaryColor = '#4A90E2';
const AccentColor = '#2ECC71';
const BackgroundColor = '#FDFDFF';
const TextColor = '#393D3F';
const ButtonRed = '#D9534F';
const ActiveTabColor = '#88B6EC';

const EmployeeDashboard: React.FC = ({ }) => {
  const { firstName, lastName } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('shifts');
  const [contentTab, setContentTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State to handle notification open/close

  const handleClockInOut = () => {
    setClockedIn(!clockedIn);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'shifts') {
      setContentTab('dashboard');
    }
  };

  const handleContentTabChange = (tab: string) => {
    setContentTab(tab);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen); // Toggle the notification state
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Welcome, {firstName} {lastName}!</Text>
          <TouchableOpacity style={styles.notificationButton} onPress={toggleNotification}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>

          {/* Tabs Section inside the header */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, contentTab === 'dashboard' && styles.activeTab]}
              onPress={() => handleContentTabChange('dashboard')}
            >
              <Text style={[styles.tabText, contentTab === 'dashboard' && styles.activeTabText]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, contentTab === 'schedules' && styles.activeTab]}
              onPress={() => handleContentTabChange('schedules')}
            >
              <Text style={[styles.tabText, contentTab === 'schedules' && styles.activeTabText]}>
                Schedules
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, contentTab === 'income' && styles.activeTab]}
              onPress={() => handleContentTabChange('income')}
            >
              <Text style={[styles.tabText, contentTab === 'income' && styles.activeTabText]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Rendering Based on Active Tab */}
        <View style={styles.contentContainer}>
          {contentTab === 'dashboard' && <Text>Dashboard Content</Text>}
          {contentTab === 'schedules' && <Text>Schedules Content</Text>}
          {contentTab === 'income' && <Text>Income Content</Text>}
        </View>

        {/* Action Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: clockedIn ? ButtonRed : AccentColor }]}
            onPress={handleClockInOut}
          >
            <Text style={styles.buttonText}>{clockedIn ? 'Clock Out' : 'Clock In'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} handleTabChange={handleTabChange} />

      {/* Menu - Side Menu with slide-in animation */}
      <Menu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      {/* Show Notifications if it's open */}
      <Notification isNotificationOpen={isNotificationOpen} toggleNotification={toggleNotification} />

    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 30,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: PrimaryColor,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  menuButton: {
    position: 'absolute',
    left: 10,
    top: 20,
  },
  notificationButton: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  tab: {
    backgroundColor: PrimaryColor,
    padding: 10,
    borderRadius: 10,
  },
  tabText: {
    backgroundColor: '#88B6EC',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    fontSize: 10,
    color: 'white',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: BackgroundColor,
  },
  activeTabText: {
    backgroundColor: BackgroundColor,
    color: TextColor,
  },
  contentContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    backgroundColor: AccentColor,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EmployeeDashboard;
