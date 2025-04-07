// src/screens/WelcomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from "react-native";

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Platform-specific Layout */}
      {Platform.OS === "web" ? (
        // Web Layout (Logo on Left, Buttons on Right)
        <View style={styles.rowContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/wpslogo.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <Text style={styles.welcomeText}>WorkHive</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={[styles.button, { backgroundColor: "#4A90E2" }]} // Light Blue for login
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              style={[styles.button, { backgroundColor: "#D5B942" }]} // Gold for Sign Up
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Mobile Layout (Logo on Top, Buttons Below)
        <View style={styles.mobileContainer}>
          <Image
            source={require("../../assets/wpslogo.png")}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>WorkHive</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={[styles.button, { backgroundColor: "#4A90E2" }]} // Light Blue for login
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("InviteCode")}
            style={styles.secondaryButton} // Gold for Sign Up
          >
            <Text style={styles.secondaryButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFF", // Off-White background
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the items horizontally
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row", // For Web: Logo on the left and buttons on the right
    justifyContent: "space-between",
    width: "100%", // Make sure this takes up the full width
  },
  logoContainer: {
    backgroundColor: "#FDFDFF", // Off-White background to blend with Welcome Screen
    padding: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250, // Larger logo for web
    height: 250,
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 40, // Space between logo and buttons
    width: "50%", // Limit the width for the buttons container on web
  },
  secondaryButton: {
    // Larger padding for mobile
    borderRadius: 5,
    padding: Platform.OS === "web" ? 15 : 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: "#4A90E2",
    fontSize: 18,
  },
  mobileContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Make sure this takes up the full width
  },
  welcomeText: {
    fontSize: Platform.OS === "web" ? 28 : 40, // Larger text for web
    fontWeight: "bold",
    color: "#393D3F", // Charcoal Grey
    marginBottom: 50,
    textAlign: "center",
    marginTop: Platform.OS === "web" ? "10%" : "0%", // Add space on top for mobile
  },
  button: {
    width: "100%", // Make sure button takes up full width in its container
    padding: 15,
    borderRadius: 5, // Rounded corners for the buttons
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonText1: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
