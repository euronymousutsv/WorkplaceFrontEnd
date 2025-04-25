import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from "react-native";

import {
  editUserDetail,
  partialregisterComplete,
  registerUser,
} from "../../../api/auth/authApi";
import { RegisterRequest } from "../../../api/auth/auth";
import { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

export const ParitalRegestrationPasswordScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSignup = async () => {
    // update the password
    try {
      if (password !== confirmPassword) {
        Toast.show({
          text1: "Both passwod must be same",
          type: "error",
          position: "bottom",
        });
        return;
      }
      const phoneNumber = "+61412524317";
      const response = await partialregisterComplete(phoneNumber, password);

      if (response instanceof ApiError) {
        navigation.navigate("Login");
        Toast.show({
          text1: response.message,
          type: "error",
          position: "bottom",
        });
      } else {
        Toast.show({
          text1: response.message,
          type: "success",
          position: "bottom",
        });
        if (response.statusCode === 409) {
          navigation.navigate("Login");
        }
      }
      // Redirect user after successful signup (you can adjust the flow)
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView>
        <View
          style={[
            styles.rowContainer,
            { flexDirection: Platform.OS === "web" ? "row" : "column" },
          ]}
        >
          {/* Right Side: Signup Form */}
          <View style={styles.formContainer}>
            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Confirm Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            {/* Next Button */}
            <TouchableOpacity onPress={handleSignup} style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>

            {/* back to previous screen */}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    width: Platform.OS === "web" ? "30%" : "100%",
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

  input: {
    width: "100%",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
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
    fontSize: 20,
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

export default ParitalRegestrationPasswordScreen;
