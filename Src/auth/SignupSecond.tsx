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
} from "react-native";
import { useSignup } from "./SignUpContext";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

export const SignupSecondScreen = ({ navigation }: { navigation: any }) => {
  const validateEmail = (email: string): boolean => {
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(email.toLocaleLowerCase());
  };

  const [email, setEmail] = useState("");

  const { updateFormData } = useSignup();

  const handleNext = () => {
    if (!email) {
      Toast.show({
        text1: "Email is Missing.",
        type: "error",
        position: "bottom",
      });
      return;
    }
    if (!validateEmail(email)) {
      Toast.show({
        text1: "Invalid Email Format",
        type: "error",
        position: "bottom",
      });
      return;
    }

    updateFormData("email", email);
    navigation.navigate("SignupPhone");
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
            {/* First Name Input */}
            <TextInput
              autoFocus={true}
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            {/* Signup Button */}
            <TouchableOpacity onPress={handleNext} style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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

export default SignupSecondScreen;
