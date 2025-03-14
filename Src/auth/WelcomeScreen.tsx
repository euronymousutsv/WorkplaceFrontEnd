// src/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Platform } from 'react-native';

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Platform-specific Layout */}
      {Platform.OS === 'web' ? (
        // Web Layout (Logo on Left, Buttons on Right)
        <View style={styles.rowContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/wpslogo.png')} style={styles.logo} />
          </View>

          <View style={styles.buttonsContainer}>
            <Text style={styles.welcomeText}>Welcome to WorkHive</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={[styles.button, { backgroundColor: '#4A90E2' }]} // Light Blue for login
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              style={[styles.button, { backgroundColor: '#D5B942' }]} // Gold for Sign Up
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Mobile Layout (Logo on Top, Buttons Below)
        <View style={styles.mobileContainer}>
          <Image source={require('../../assets/wpslogo.png')} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to WorkHive</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[styles.button, { backgroundColor: '#4A90E2' }]} // Light Blue for login
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={[styles.button, { backgroundColor: '#D5B942' }]} // Gold for Sign Up
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFF', // Off-White background
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the items horizontally
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row', // For Web: Logo on the left and buttons on the right
    justifyContent: 'space-between',
    width: '100%', // Make sure this takes up the full width
  },
  logoContainer: {
    backgroundColor: '#FDFDFF', // Off-White background to blend with Welcome Screen
    padding: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 500, // Larger logo for web
    height: 400,
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 40, // Space between logo and buttons
    width: '50%', // Limit the width for the buttons container on web
  },
  mobileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Make sure this takes up the full width
  },
  welcomeText: {
    fontSize: Platform.OS === 'web' ? 28 : 22, // Larger text for web
    fontWeight: 'bold',
    color: '#393D3F', // Charcoal Grey
    marginBottom: 40,
    textAlign: 'center',
    marginTop: Platform.OS === 'web' ? '10%' : '20%', // Add space on top for mobile
  },
  button: {
    width: '65%', // Make sure button takes up full width in its container
    padding: 15,
    borderRadius: 20,     // Rounded corners for the buttons
    marginBottom: 20,
    alignItems: 'center',
   
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default WelcomeScreen;
