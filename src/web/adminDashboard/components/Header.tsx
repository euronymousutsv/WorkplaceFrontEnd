import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Button to toggle the sidebar */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
        <Feather name={isSidebarOpen ? 'sidebar' : 'sidebar'} size={15} color="#fff" />
      </TouchableOpacity>

      {/* App Name on the Left */}
      <Text style={styles.appName}>RosterMate</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'transparent', // Soft white
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 101,
        
        elevation: 3, // for Android
      
  },
  appName: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,

    

  },
  toggleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Semi-transparent background for the button
    padding: 12,
    borderRadius: 50,

  },
});

export default Header;
