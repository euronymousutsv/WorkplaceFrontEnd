import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  FlatList,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  PrimaryColor,
  AccentColor,
  BackgroundColor,
  TextColor,
  ButtonRed,
} from '../../../utils/color';

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = new Animated.Value(250);
  const mainContentPadding = new Animated.Value(250);
  const [isMobile, setIsMobile] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (screenWidth <= 768) {
      setIsMobile(true);
      setIsSidebarOpen(false);
    } else {
      setIsMobile(false);
      setIsSidebarOpen(true);
    }
  }, [screenWidth]);

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: isSidebarOpen ? 250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(mainContentPadding, {
      toValue: isSidebarOpen ? 250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSidebarOpen]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const alerts = [
    {
      text: 'Pranish was supposed to start working at 10. He has not clocked in yet.',
      time: '60 mins ago',
      type: 'alert',
    },
    {
      text: 'Pranish has requested for a leave this Saturday',
      time: '10 min ago',
      type: 'notification',
    },
    {
      text: 'Sabin mentioned you in #Channel1',
      time: '10 min ago',
      type: 'notification',
    },
  ];

  const toDos = [{ task: 'Place an order for tomorrow', due: 'Due today' }];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
      />

      {/* Main Content */}
      <Animated.View style={[styles.mainContent, { paddingLeft: isMobile ? 0 : mainContentPadding }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Welcome Banner */}
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeTitle}>Welcome, Admin 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Here's an overview of what’s happening today.
            </Text>
          </View>

          {/* Alert */}
          <View style={[styles.card, styles.alertCard]}>
            <Text style={styles.cardTitle}>Alert</Text>
            <Text style={styles.alertText}>{alerts[0].text}</Text>
            <Text style={styles.timestamp}>{alerts[0].time}</Text>
          </View>

          {/* Notifications */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications</Text>
            {alerts.slice(1).map((alert, index) => (
              <View key={index} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{alert.text}</Text>
                <Text style={styles.timestamp}>{alert.time}</Text>
              </View>
            ))}
          </View>

          {/* To-do’s */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>To-do’s</Text>
            <FlatList
              data={toDos}
              renderItem={({ item }) => (
                <View style={styles.todoItem}>
                  <Text style={styles.todoText}>{item.task}</Text>
                  <Text style={styles.timestamp}>{item.due}</Text>
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: BackgroundColor,
  },
  mainContent: {
    flex: 1,
    marginTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginLeft: 30,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  welcomeBanner: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: TextColor,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6C6C6C',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertCard: {
    borderLeftWidth: 5,
    borderLeftColor: ButtonRed,
    backgroundColor: '#FFEBEB',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TextColor,
    marginBottom: 10,
  },
  alertText: {
    fontSize: 16,
    color: ButtonRed,
  },
  notificationItem: {
    marginBottom: 15,
  },
  notificationText: {
    fontSize: 16,
    color: TextColor,
  },
  todoItem: {
    marginBottom: 15,
  },
  todoText: {
    fontSize: 16,
    color: TextColor,
  },
  timestamp: {
    fontSize: 12,
    color: '#6C6C6C',
  },
});

export default AdminDashboard;
