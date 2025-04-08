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

import { Plat, saveToken } from "../../api/auth/token";
import { ApiError, ApiResponse } from "../../api/utils/apiResponse";
import { loginUser } from "../../api/auth/authApi";
import { validateEmail } from "../Signup/SignupSecond";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { setUserRole, setIsAuthenticated } = useAuth(); // Get AuthContext functions
  const [Email, setEmail] = useState("11111@gmail.com");
  const [Password, setPassword] = useState("Abcde1@345");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  // activity indicator
  const [loading, setLoading] = useState(false);

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

      if ("statusCode" in response && "data" in response) {
        setLoading(false);
        const accessToken = response.data?.accessToken ?? "";
        const refreshToken = response.data?.refreshToken ?? "";

        if (accessToken) {
          // these token will be able to access the application
          // An access token will give access to the application wheras, an refresh token will beuised to generate a new accesstoken.
          // accessToken will be valid for short amount of time while the refresh tokenw ill be valid for longer duration.
          // This makes it easir for user to not ogin time and again.
          if (Platform.OS === "web") {
            // Logic for web
            saveToken("accessToken", accessToken, Plat.WEB);
            saveToken("refreshToken", refreshToken, Plat.WEB);
          } else {
            // Logic for mobile (Android or iOS)
            saveToken("accessToken", accessToken);
            saveToken("refreshToken", refreshToken);
          }

          // Decode the JWT token to extract role and other details
          const decodedToken = JWT.decode(accessToken, null); // Use default() if you're importing with * as
          console.log("Decoded Token:", decodedToken); // Log the entire decoded token
          // var role = "employee";
          // if (decodedToken.role) role = decodedToken.role;

          // // const role = decodedToken.Role; // Assuming role is stored as "RoleID" in the token payload
          // // console.log("Decoded role:", role); // Log the decoded role

          // // // // Map RoleID to a string role
          // // // const roleMap = {
          // // //   1: "manger",
          // // //   2: "admin",
          // // //   3: "employee",
          // // // };

          const role = decodedToken.role; // Assuming role is stored as "RoleID" in the token payload
          console.log("Decoded role:", role); // Log the decoded role

          // Map RoleID to a string role
          // const roleMap = {
          //   1: "manger",
          //   2: "admin",
          //   3: "employee",
          // };
          // const role = roleMap[roleID as keyof typeof roleMap] || "employee"; // Default to 'employee' if RoleID is unknown
          console.log("Decoded role:", role); // Log the mapped role

          // Platform-based login restrictions
          if (Platform.OS === "web") {
            if (role === "employee") {
              setError("Employees cannot log in from the web.");
              return;
            }
          } else if (Platform.OS === "ios" || Platform.OS === "android") {
            if (role === "admin" || role === "manager") {
              setError("Admins and Managers can only log in from the web.");
              return;
            }
          }

          // Ensure role exists before continuing
          if (role) {
            // Store the token in AsyncStorage (for mobile) or localStorage (for web)
            if (Platform.OS === "web") {
              localStorage.setItem("token", accessToken); // For Web, use localStorage
              localStorage.setItem("role", role); // Store role in localStorage
            } else {
              await AsyncStorage.setItem("token", accessToken); // For Mobile, use AsyncStorage
              await AsyncStorage.setItem("role", role.toString()); // Store role in AsyncStorage
            }

            // Set role in the global AuthContext
            setUserRole(role);
            setIsAuthenticated(true);

            // Log context values to confirm they are updated
            console.log("Context updated - User Role:", role);
            console.log("Context updated - Is Authenticated:", true);

            // //Navigate based on role
            if (role === "admin") {
              console.log("Admin is logging in...........");
              navigation.navigate("AdminDashboard");
            } else if (role === "manager") {
              navigation.replace("ManagerDashboard");
            } else if (role === "employee") {
              navigation.reset({
                index: 0,
                routes: [{ name: "EmployeeDashboard" }],
              });
            }

            console.log(
              "Authenticated state updated. Redirecting to dashboard..."
            );
          }
        }
      } else if (response instanceof ApiError) {
        setLoading(false);
        setError(response.message);
        console.error("No token received from backend");
      } else {
        setLoading(false);
        setError("Something went wrong");
      }
    } catch (err) {
      setLoading(false);

      console.error("Error during login:", err);
      setError("Invalid credentials");
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
