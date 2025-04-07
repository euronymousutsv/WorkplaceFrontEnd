import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import axios from "../config/axiosConfig"; // Import axios instance
import { registerUser } from "../api/auth/authApi";
import { ApiError } from "../api/utils/apiResponse";
import { AxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

const SignupFirstScreen = ({ navigation }: { navigation: any }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {/* Platform-specific Layout */}
      <View
        style={[
          styles.rowContainer,
          { flexDirection: Platform.OS === "web" ? "row" : "column" },
        ]}
      >
        {/* Left Side: Create Account Text */}
        <View style={styles.leftSide}>
          <Text style={styles.title}>Create Account</Text>
        </View>

        {/* Right Side: Signup Form */}
        <View style={styles.formContainer}>
          {/* First Name Input */}
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* First Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Signup Button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup2");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Navigate to Login */}
          <View style={styles.footer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FDFDFF", // Off-White background
    marginTop: -140,
  },
  rowContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: Platform.OS === "web" ? 30 : 24, // Larger font size for web
    // Additional flex properties for responsive layout
    maxWidth: 1200, // Max width for the content container
  },
  leftSide: {
    marginRight: Platform.OS === "web" ? 0 : 0, // Margin for spacing on the web version
    alignItems: "flex-start", // Align text to the left on web
    width: Platform.OS === "web" ? "30%" : "50%",
    marginBottom: 60,
  },
  backButton: {
    padding: 10,
    marginTop: 30, // Adjust for iOS devices
  },
  formContainer: {
    width: Platform.OS === "web" ? "60%" : "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#393D3F", // Charcoal Grey
    textAlign: Platform.OS === "web" ? "left" : "center", // Align to left for web
  },
  input: {
    width: "100%",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 25,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default SignupScreen;
