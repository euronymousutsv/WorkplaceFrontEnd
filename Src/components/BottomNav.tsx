// src/components/BottomNav.tsx

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, handleTabChange }) => {
  return (
    <View style={styles.bottomNavContainer}>
      <TouchableOpacity
        style={[styles.navButton, activeTab === 'home' && styles.activeNavButton]}
        onPress={() => handleTabChange('home')}
      >
        <Ionicons name="home-outline" size={24} color="gray" />
        <Text style={styles.navButtonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, activeTab === 'leave' && styles.activeNavButton]}
        onPress={() => handleTabChange('leave')}
      >
        <Ionicons name="airplane-outline" size={24} color="gray" />
        <Text style={styles.navButtonText}>Leave</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, activeTab === 'profile' && styles.activeNavButton]}
        onPress={() => handleTabChange('profile')}
      >
        <Ionicons name="person-outline" size={24} color="gray" />
        <Text style={styles.navButtonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navButton: {
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#88B6EC', // Active tab color
    borderRadius: 10,
    padding: 10,
  },
  navButtonText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default BottomNav;
