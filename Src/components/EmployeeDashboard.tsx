import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu';
import Notification from './Notification';
import ChatWindow from './ChatWindow';
import { mockShifts } from '../data/mockShifts';
import { Shift } from '.././types/Shift'; 
import ShiftCard from './ShiftCard';
import SchedulesScreen from './SchedulesScreen';
import IncomeScreen from './IncomeScreen';
import LeaveScreen from './LeaveScreen';


const PrimaryColor = '#4A90E2';
const AccentColor = '#2ECC71';
const BackgroundColor = '#FDFDFF';
const TextColor = '#393D3F';
const ButtonRed = '#D9534F';
const ActiveTabColor = '#88B6EC';

const EmployeeDashboard: React.FC = () => {
  const { firstName, lastName } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [contentTab, setContentTab] = useState<string>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Chat state
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null); // Default channel
  const [activeChannelName, setActiveChannelName] = useState(''); // Default channel name
  const [isChatView, setIsChatView] = useState(false);

  const handleClockInOut = () => {
    setClockedIn(!clockedIn);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setContentTab('dashboard');
      setIsChatView(false);
      setActiveChannelId(null);
      setActiveChannelName('');
    } else if (tab === 'chat') {
      setIsChatView(true);
    }
  };

  const handleContentTabChange = (tab: string) => {
    setContentTab(tab);
    setIsChatView(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleChannelSelect = (channelId: string, channelName: string) => {
    setActiveChannelId(channelId);
    setActiveChannelName(channelName);
    setIsChatView(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isChatView ? (
        // Chat View
        <View style={styles.chatViewContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>{activeChannelName}</Text>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                setIsChatView(false);
                setActiveChannelId(null);
                setActiveChannelName('');
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ChatWindow 
            activeChannelId={activeChannelId || ''} 
            activeChannelName={activeChannelName}
            hideBottomNav={() => setIsChatView(true)}
          />
        </View>
      ) : (
        // Regular Dashboard View
        <ScrollView style={styles.scrollContainer}>
          {activeTab === 'home' && (
            <>
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
          {contentTab === 'dashboard' && (
            <>
            <Text style={styles.sectionTitle}> -------- Your Shifts: -------- </Text>
            {mockShifts.length > 0 ? (
            mockShifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))
        ) : (
          <Text style={styles.noShiftsText}>No shifts available for you.</Text>
          )}
          </>
          )}
            {contentTab === 'schedules' && <SchedulesScreen />}
            {contentTab === 'income' && <IncomeScreen />}
          </View>

          {/* Action Buttons Section
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: clockedIn ? ButtonRed : AccentColor }]}
              onPress={handleClockInOut}
            >
              <Text style={styles.buttonText}>{clockedIn ? 'Clock Out' : 'Clock In'}</Text>
            </TouchableOpacity>
            
            
          </View> */}
          </>
          )}
          {activeTab === 'leave' && (
            <LeaveScreen 
              toggleMenu={toggleMenu} 
              toggleNotification={toggleNotification} 
            />
          )}

        </ScrollView>
      )}

      

       {/* Bottom Navigation */}
       {!isChatView && (
        <BottomNav activeTab={activeTab} handleTabChange={handleTabChange} />
      )}

      {/* Menu - Side Menu with slide-in animation */}
      <Menu 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        onChannelSelect={handleChannelSelect}
        activeChannel={activeChannelId || ''}
      />
      
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
  chatViewContainer: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: PrimaryColor,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    right: 10,
    top: 20,
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
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: 'light',
    color: '#393D3F',
    left: 120,
    marginBottom: 12,
    marginTop: -30,
  },
  
  noShiftsText: {
    fontSize: 16,
    color: '#8E9196',
    textAlign: 'center',
    marginVertical: 20,
  },
  
  // buttonContainer: {
  //   marginTop: 20,
  //   marginBottom: 20,
  //   flexDirection: 'row',
  //   justifyContent: 'space-evenly',
  //   alignItems: 'center',
  // },
  // button: {
  //   backgroundColor: AccentColor,
  //   padding: 15,
  //   borderRadius: 20,
  //   marginBottom: 15,
  //   width: '40%',
  //   alignItems: 'center',
  // },
  // buttonText: {
  //   color: 'white',
  //   fontSize: 16,
  // },
});

export default EmployeeDashboard;