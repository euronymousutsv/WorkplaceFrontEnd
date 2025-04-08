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

export const SignupFirstScreen = ({ navigation }: { navigation: any }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { updateFormData } = useSignup();

  const handleNext = () => {
    if (!firstName || !lastName) {
      Toast.show({
        text1: "Please fill all fields to continue.",
        type: "error",
        position: "bottom",
      });
      return;
    }
    updateFormData("firstName", firstName);
    updateFormData("lastName", lastName);
    navigation.navigate("Signup2");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView>
        {/* Back Button */}
        {/* <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity> */}
        {/* Platform-specific Layout */}
        <View
          style={[
            styles.rowContainer,
            { flexDirection: Platform.OS === "web" ? "row" : "column" },
          ]}
        >
          {/* Left Side: Create Account Text */}
          <View style={styles.leftSide}>
            <Text style={styles.serverName}>Fairy Tail</Text>

            <Text style={styles.subTitle}>
              Sign up to create your account and start your journey!
            </Text>
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
            <TouchableOpacity onPress={handleNext} style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {/* back to previous screen */}
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
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
  //   title: {
  //     fontSize: 24,
  //     fontWeight: "bold",
  //     marginBottom: 10,
  //     color: "#393D3F", // Charcoal Grey
  //     textAlign: Platform.OS === "web" ? "left" : "center", // Align to left for web
  //   },

  serverName: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#393D3F", // Charcoal Grey
    textAlign: Platform.OS === "web" ? "left" : "center", // Align to left for web
  },

  subTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "#393D3F", // Charcoal Grey
    // textAlign: Platform.OS === "web" ? "left" : "center", // Align to left for web
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
    fontSize: 16,
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
    fontSize: 16,
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

export default SignupFirstScreen;
