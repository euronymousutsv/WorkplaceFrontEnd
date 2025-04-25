import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Correct import for Ionicons
import { useAuth } from "../../context/AuthContext"; // Assuming you have the AuthContext to manage role
import JWT from "expo-jwt"; // Correct import for jwt-decode

import { saveToken } from "../../api/auth/token";
import { ApiError, ApiResponse } from "../../api/utils/apiResponse";
import { loginUser } from "../../api/auth/authApi";
import { validateEmail } from "../Signup/SignupSecond";
import Toast from "react-native-toast-message";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { setUserRole, setIsAuthenticated } = useAuth(); // Get AuthContext functions
  const [Email, setEmail] = useState(
    Platform.OS === "web" ? "sabin@gmail.com" : "11111@gmail.com"
  );
  const [Password, setPassword] = useState("Abcde1@345");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  // activity indicator
  const [loading, setLoading] = useState(false);

  // handle all logic for login
  const handleLogin = async () => {
    try {
      if (!Email || !Password) {
        setError("Email and Password must be filled");
        return;
      }

      if (!validateEmail(Email)) {
        setError("Please enter a valid email.");
        return;
      }

      if (Password.length < 8) {
        setError("Password length should be at least 8 characters.");
        return;
      }

      setLoading(true);
      const response = await loginUser(Email, Password);

      if (response instanceof ApiError) {
        setLoading(false);

        // Specific case for partial registration
        if (response.statusCode === 409) {
          navigation.navigate("PartialRegesterScreen");
        }

        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Login Failed",
          text2: response.message || "Invalid credentials",
        });

        setError(response.message || "Invalid credentials");
        return;
      }

      if (!("statusCode" in response) || !("data" in response)) {
        setLoading(false);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Login Failed",
          text2: "Unexpected response from server",
        });
        setError("Unexpected server response");
        return;
      }

      const accessToken = response.data?.accessToken ?? "";
      const refreshToken = response.data?.refreshToken ?? "";

      if (!accessToken) {
        setLoading(false);
        setError("No access token received");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Login Failed",
          text2: "Access token missing",
        });
        return;
      }

      // Save tokens
      if (Platform.OS === "web") {
        saveToken("accessToken", accessToken);
        saveToken("refreshToken", refreshToken);
      } else {
        saveToken("accessToken", accessToken);
        saveToken("refreshToken", refreshToken);
      }

      const decodedToken = JWT.decode(accessToken, null);
      const role = decodedToken.role;

      // Platform-based login restriction
      if (Platform.OS === "web" && role === "employee") {
        setLoading(false);
        setError("Employees cannot log in from the web.");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Access Denied",
          text2: "Employees cannot log in from the web.",
        });
        return;
      }

      if (
        (Platform.OS === "android" || Platform.OS === "ios") &&
        (role === "admin" || role === "manager")
      ) {
        setLoading(false);
        setError("Admins and Managers can only log in from the web.");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Access Denied",
          text2: "Admins and Managers can only log in from the web.",
        });
        return;
      }

      // // Save to storage
      // if (Platform.OS === "web") {
      //   localStorage.setItem("token", accessToken);
      //   localStorage.setItem("role", role);
      // } else {
      //   await AsyncStorage.setItem("token", accessToken);
      //   await AsyncStorage.setItem("role", role);
      // }

      setUserRole(role);
      setIsAuthenticated(true);

      console.log("....");
      if (role === "admin") {
        navigation.navigate("AdminDashboard");
      } else if (role === "manager") {
        navigation.replace("ManagerDashboard");
      } else if (role === "employee") {
        console.log("Redirecting to mobile");

        navigation.reset({
          index: 0,
          routes: [{ name: "EmployeeDashboard" }],
        });
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);

      console.error("Error during login:", err);

      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Unexpected Error",
        text2: err?.message || "Please try again later.",
      });

      setError("Unexpected error. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {!loading && (
        <View>
          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.welcomeText2}>Sign in to your account</Text>
          </View>
          {/* Form (Email, Password) */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={Email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={Password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Or login with text */}
            {/* <Text style={styles.orLoginText}>or login with:</Text> */}

            {/* Social Media Logos (Apple and Google) */}
            {/* <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
            <Ionicons name="logo-apple" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <Ionicons name="logo-google" size={24} color="white" />
          </TouchableOpacity>
        </View> */}

            {/* Don't have an account */}
            <View style={styles.signupContainer}>
              <Text>Have a invite code? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("InviteCode")}
              >
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {loading && (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FDFDFF", // Off-White background
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,

    fontSize: Platform.OS === "web" ? 16 : 10,
    // flexDirection: Platform.OS === "web" ? "row" : "column", // Row for web, column for mobile
    flexDirection: "column", // Row for web, column for mobile
  },
  welcomeContainer: {
    width: Platform.OS === "web" ? "40%" : "100%", // Make "Welcome back" take up 40% width on web, full width on mobile
    marginBottom: 20,
    textAlign: Platform.OS === "web" ? "left" : "center", // Left aligned for web, center for mobile
  },
  welcomeText: {
    fontSize: Platform.OS === "web" ? 30 : 40,
    fontWeight: "bold",
    color: "#393D3F", // Charcoal Grey
    marginBottom: 0,
  },
  welcomeText2: {
    fontSize: Platform.OS === "web" ? 30 : 24,
    color: "#393D3F", // Charcoal Grey
    marginBottom: 0,
  },
  formContainer: {
    width: Platform.OS === "web" ? "100%" : "100%", // Form takes 60% width on web, full width on mobile
    alignItems: "center",

    marginTop: Platform.OS === "web" ? "5%" : "5%", // Add space on top for web
  },
  input: {
    width: "100%",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 5,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "web" ? 15 : 20, // Adjust position for web
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderRadius: 5, // Rounded corners
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  socialLoginContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  socialButton: {
    width: "15%",
    padding: Platform.OS === "web" ? 10 : 15, // Larger padding for mobile
    borderRadius: 5,
    backgroundColor: "#4A90E2", // Light Blue background for social buttons
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  appleButton: {
    backgroundColor: "#000000", // Black for Apple button
  },
  googleButton: {
    backgroundColor: "#DB4437", // Red for Google button
  },
  orLoginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#393D3F", // Charcoal Grey
    marginVertical: 10, // Space between the buttons and text
  },

  errorText: {
    color: "red",
    marginBottom: 10,
  },
  link: {
    color: "#007bff", // Blue
    textDecorationLine: "underline",
  },
  signupContainer: {
    flexDirection: "row",
    // marginTop: 100,
  },
});

export default LoginScreen;
