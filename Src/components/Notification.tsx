import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Notification = ({ isNotificationOpen, toggleNotification }: { isNotificationOpen: boolean, toggleNotification: () => void }) => {
  const slideAnimation = new Animated.Value(width); // Start off-screen to the right

  React.useEffect(() => {
    if (isNotificationOpen) {
      Animated.spring(slideAnimation, {
        toValue: 0, // Slide in
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnimation, {
        toValue: width, // Slide out
        useNativeDriver: true,
      }).start();
    }
  }, [isNotificationOpen]);

  return (
    <Animated.View style={[styles.notification, { transform: [{ translateX: slideAnimation }] }]}>
      <View style={styles.notificationContent}>
        {/* Notification Header with Close Button */}
        <View style={styles.headerContainer}>
          <Text style={styles.notificationHeader}>Notifications</Text>
          <TouchableOpacity onPress={toggleNotification} style={styles.closeButton}>
            <Ionicons style={styles.closeButtonIcon} name="close-outline" size={34} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Notification Items */}
        <Text style={styles.notificationItem}>New message in # Main Chat</Text>
        <Text style={styles.notificationItem}>New event scheduled for tomorrow</Text>
        <Text style={styles.notificationItem}>You have a new task assigned</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 75,
    right: 0,
    bottom: 0,
    backgroundColor: '#FDFDFF',
    height: '88.6%',
    width: '60%',  // Half width of the screen
    borderRadius: 20,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    zIndex: 10,  // Ensures the notification is above other content
  },
  notificationContent: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',  // Align header elements side by side
    justifyContent: 'space-between',  // Place them on opposite sides
    alignItems: 'center',  // Vertically align them
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',  // Positioning close button to the right side
  },
  closeButtonIcon: {
    color: '#4A90E2',
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderBottomEndRadius: 10,
    fontSize: 18,
    marginBottom: 15,
    color: '#393D3F',
  },
  notificationHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#393D3F',
  },
});

export default Notification;
