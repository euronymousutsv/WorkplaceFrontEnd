import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigationTypes'
import { StackNavigationProp } from '@react-navigation/stack';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  selectedTab: string; // Selected tab state
  handleTabChange: (tab: string) => void;
  
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, selectedTab, handleTabChange }) => {
  const sidebarWidth = new Animated.Value(250); // Animated width for the sidebar
  const sidebarPosition = new Animated.Value(0); // Animated position for the sidebar
  const [isMobile, setIsMobile] = useState(false); // Detect if the device is mobile
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const screenWidth = Dimensions.get('window').width; // Get current screen width

  useEffect(() => {
    console.log(navigation); // Log the navigation object to ensure it's available
  }, [navigation]);

  // Detect screen size
  useEffect(() => {
    if (screenWidth <= 768) {
      setIsMobile(true); // If the screen is mobile-sized
    } else {
      setIsMobile(false); // If it's desktop-sized
    }
  }, [screenWidth]);

  // When the sidebar's state changes (open/close), animate its width and position
  useEffect(() => {
    if (isMobile) {
      Animated.timing(sidebarPosition, {
        toValue: isOpen ? 0 : -250, // Collapse sidebar on mobile
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(sidebarWidth, {
        toValue: isOpen ? 250 : 0, // Expand or collapse the sidebar on desktop
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(sidebarPosition, {
        toValue: isOpen ? 0 : -250, // Keep sidebar in place on desktop
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isOpen, isMobile]);

  // Handle tab click and navigate
  const handleMenuItemClick = (tab: string) => {
    console.log(`${tab} item clicked`);
    handleTabChange(tab); // Update the selected tab
    if (tab === 'Schedules') {
        navigation.navigate('SchedulesScreen');  // Navigate to SchedulesScreen
      } else if (tab === 'Dashboard') {
        navigation.navigate('AdminDashboard');  // Navigate to AdminDashboard
      } else if  (tab === 'ClockInOut') {
        navigation.navigate('ClockInOutScreen');  // Navigate to ClockInOutScreen
      } else if (tab ==="EmployeeManagement") {
        navigation.navigate('EmployeeManagementScreen'); // Navigate to EmployeeManagementScreen
      }else if (tab === "Settings") {
        navigation.navigate('SettingsScreen');
      }
  };

  return (
    <View style={styles.sidebarContainer}>
      <Animated.View style={[styles.sidebar, { width: sidebarWidth, left: sidebarPosition }]}>
        <ScrollView style={styles.menuItems}>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'Dashboard' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('Dashboard')}
          >
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'Schedules' && styles.activeMenuItem]}
            onPress={() => {
                handleMenuItemClick('Schedules')} }
          >
            <Text style={styles.menuText}>Schedules</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'ClockInOut' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('ClockInOut')}
          >
            <Text style={styles.menuText}>Clock In/Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'Payments' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('Payments')}
          >
            <Text style={styles.menuText}>Gross Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'LeaveRequest' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('LeaveRequest', )}
          >
            <Text style={styles.menuText}>Leave Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'ToDo' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('ToDo')}
          >
            <Text style={styles.menuText}>To Do</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'EmployeeManagement' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('EmployeeManagement')}
          >
            <Text style={styles.menuText}>Employee Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'PerformanceManagement' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('PerformanceManagement')}
          >
            <Text style={styles.menuText}>Performance Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedTab === 'Settings' && styles.activeMenuItem]}
            onPress={() => handleMenuItemClick('Settings')}
          >
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 100,
  },
  sidebar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderBottomEndRadius: 20,
    borderTopEndRadius: 20,
    paddingTop: 30,
    paddingLeft: 25,
    boxShadow: '4px 0px 15px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    position: 'absolute',
  },
  menuItems: {
    marginTop: 60,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    width: '90%',
    marginBottom: 20,
    paddingVertical: 14,
    paddingLeft: 18,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: '#88B6EC',
    color: '#fff',
  },
  menuText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Sidebar;
