import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Menu = ({ isMenuOpen, toggleMenu }: { isMenuOpen: boolean, toggleMenu: () => void }) => {
  const slideAnimation = new Animated.Value(-width); // Start off-screen to the left

  React.useEffect(() => {
    if (isMenuOpen) {
      Animated.spring(slideAnimation, {
        toValue: 0, // Slide in
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnimation, {
        toValue: -width, // Slide out
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuOpen]);

  return (
    <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnimation }] }]}>
      <View style={styles.menuContent}>
        {/* Header with Close Button */}
        <View style={styles.headerContainer}>
          <Text style={styles.menuHeader}>Channels</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Ionicons style={styles.closeButtonIcon} name="close-outline" size={34} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <Text style={styles.menuItem}># Welcome</Text>
        <Text style={styles.menuItem}># Main Chat</Text>
        <Text style={styles.menuItem}># Private Channel #1</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 75,
    left: 0,
    bottom: 0,
    backgroundColor: '#FDFDFF',
    height: '88.6%', // Make sure it's covering most of the screen
    width: '60%',   // Half width of the screen
    borderRadius: 20,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    zIndex: 10, // Make sure it appears above other components
  },
  menuContent: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',  // Align elements side by side
    justifyContent: 'space-between',  // Space them out
    alignItems: 'center',  // Vertically align items in the header
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',  // Position close button to the top-right
  },
  closeButtonIcon: {
    color: '#4A90E2',
  },
  menuItem: {
    fontSize: 18,
    marginBottom: 15,
    color: '#393D3F',
  },
  menuHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#393D3F', // Set text color for header
  },
});

export default Menu;
