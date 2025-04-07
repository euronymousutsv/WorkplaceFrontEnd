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
  Modal,
} from "react-native";
import { useSignup } from "./SignUpContext";
import Toast from "react-native-toast-message";
import { sendOTP, verifyOTP } from "../api/auth/authApi";
import { ApiError } from "../api/utils/apiResponse";

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

export const SignupPhoneScreen = ({ navigation }: { navigation: any }) => {
  const [phone, setPhone] = useState("");
  const [verification, setVerification] = useState("");
  const [phoneVerificationModelVisible, setPhoneVerificationModelVisible] =
    useState(false);

  // using signup context
  const { updateFormData } = useSignup();

  function validatePhoneNumber(phoneNumer: string): boolean {
    if (!phoneNumer.startsWith("+61")) {
      phoneNumer = "+61" + phoneNumer;
    }

    if (phoneNumer.length != 12) return false;
    const newNum = Number.parseInt(phoneNumer.slice(0));
    console.log(newNum);
    if (!isNaN(newNum)) return true;
    else return false;
  }

  const handleNext = () => {
    updateFormData("phoneNumber", phone);
    setPhoneVerificationModelVisible(false);
    navigation.navigate("SignupPassword");
  };

  const handleSendVerification = () => {
    if (!phone) {
      Toast.show({
        text1: "Enter your phone number first",
        type: "error",
        position: "bottom",
      });
      return;
    }

    if (!validatePhoneNumber(phone)) {
      Toast.show({
        text1: "Phone Number is Invalid.",
        type: "error",
        position: "bottom",
      });
      return;
    }
    sendVerification(phone);
    setPhoneVerificationModelVisible(true);
  };

  const sendVerification = async (phoneNumber: string) => {
    try {
      if (!phoneNumber.startsWith("+61")) {
        phoneNumber = "+61" + phoneNumber;
      }

      const res = await sendOTP({ phoneNumber: phoneNumber });
      if (res.success) {
        Toast.show({
          text1: "Verification Code Sent.",
          type: "success",
          position: "bottom",
        });
      } else if (res instanceof ApiError) {
        Toast.show({
          text1: res.message,
          type: "error",
          position: "bottom",
        });
      }
    } catch (err) {
      Toast.show({
        text1: "Something went wrong",
        type: "error",
        position: "bottom",
      });
    }
  };

  const verifyOtp = async (phoneNumber: string) => {
    try {
      if (!phoneNumber.startsWith("+61")) {
        phoneNumber = "+61" + phoneNumber;
      }

      const res = await verifyOTP({
        code: verification,
        phoneNumber: phoneNumber,
      });
      if (res.success) {
        Toast.show({
          text1: res.message,
          type: "success",
          position: "bottom",
        });

        handleNext();
      } else if (res instanceof ApiError) {
        console.log(res.message);
        Toast.show({
          text1: res.message,
          type: "error",
          position: "bottom",
        });
      }
    } catch (err) {
      Toast.show({
        text1: "Something went wrong",
        type: "error",
        position: "bottom",
      });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.countryCode}
                  value={"+61"}
                  disabled={true}
                  focusable={false}
                  editable={false}
                />

                <TextInput
                  maxLength={9}
                  autoFocus={true}
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Open Verification Modal Button */}
              <TouchableOpacity
                onPress={handleSendVerification}
                style={styles.button}
              >
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

      <Modal
        presentationStyle="pageSheet"
        visible={phoneVerificationModelVisible}
        animationType="slide"
        onRequestClose={() => {
          setPhoneVerificationModelVisible(!phoneVerificationModelVisible);
        }}
      >
        <View style={styles.container}>
          <View style={styles.formContainer}>
            {/* First Name Input */}
            <Text style={styles.verificationText}>
              A 6 digit verification code has been sent to your phone.
            </Text>
            <TextInput
              maxLength={6}
              autoFocus={true}
              style={styles.verifyInput}
              placeholder="6 Digit Code"
              value={verification}
              onChangeText={setVerification}
            />

            {/* Signup Button */}
            <TouchableOpacity onPress={verifyOtp} style={styles.button}>
              <Text style={styles.buttonText}>Verify </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text>Didn't receive code? </Text>
              <TouchableOpacity
                onPress={() => {
                  // resend button
                }}
              >
                <Text style={styles.link}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: Platform.OS === "web" ? "30%" : "100%",
    marginBottom: 60,
  },

  formContainer: {
    width: Platform.OS === "web" ? "60%" : "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  inputContainer: {
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
  },
  countryCode: {
    flex: 1,
    fontSize: 16,
    marginBottom: 15,
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
    borderRadius: 5,
  },

  input: {
    flex: 7,
    fontSize: 16,
    width: "100%",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 5,
  },
  verifyInput: {
    fontSize: 16,
    width: "100%",
    padding: Platform.OS === "web" ? 15 : 25, // Larger padding for mobile
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 5,
  },
  headingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff",
    textAlign: "left",
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "left",
    marginTop: 5,
    marginBottom: 10,
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

export default SignupPhoneScreen;
