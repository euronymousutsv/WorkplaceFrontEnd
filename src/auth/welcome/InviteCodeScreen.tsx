import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchServer } from "../../api/server/serverApi";
import { ApiError, ApiResponse } from "../../api/utils/apiResponse";
import { SearchServerResponse } from "../../api/server/server";
import Toast from "react-native-toast-message";
import { KeyboardAvoidingView } from "react-native";
import { SearchedServerScreen } from "./SearchedServerScreen";
import { useSignup } from "../Signup/SignUpContext";
import { SafeAreaView } from "react-native";

const InviteCodeScreen = ({ navigation }: { navigation: any }) => {
  const [inviteCode, setInviteCode] = useState<string>(""); // Store invite code input
  const [serverName, setServerName] = useState<string>(""); // Store server name input
  const [createingServer, setCreatingServer] = useState(false);
  const { updateFormData } = useSignup();

  const handleSubmit = async () => {
    try {
      updateFormData("inviteLink", inviteCode);
      updateFormData("serverName", serverName);
      if (!createingServer && inviteCode.length !== 8) {
        Alert.alert("Error", "Invite code must be 8 characters long.");
      } else {
        if (!createingServer) {
          const res = await searchServer(inviteCode);

          if (res instanceof ApiError) {
            Toast.show({
              type: "error",
              text1: res.message,
              position: "bottom",
              swipeable: false,
              bottomOffset: 40,
            });
          } else {
            navigation.navigate("SearchedServer", {
              searchServer: res.data.data,
            });
          }
        } else {
          navigation.navigate("SearchedServer");
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something Went Wrong",
        position: "bottom",
      });
    }
  };

  const handleBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <>
      {createingServer ? (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={29} color="black" />
          </TouchableOpacity>
          {/* Invite Code Input Form */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Create A New Server</Text>

            <TextInput
              autoFocus={true}
              style={styles.input}
              placeholder="New Server Name"
              value={serverName}
              onChangeText={setServerName}
              keyboardType="default"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createServer}
              onPress={() => {
                setServerName("");
                setCreatingServer(false);
              }}
            >
              <Text style={styles.submitButtonText}>back</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={29} color="black" />
          </TouchableOpacity>
          {/* Invite Code Input Form */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Enter Invite Code</Text>

            <TextInput
              autoFocus={true}
              style={styles.input}
              placeholder="Enter 8-character invite code"
              value={inviteCode}
              onChangeText={setInviteCode}
              maxLength={8}
              keyboardType="default" // You can also use numeric if invite code is only numbers
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createServer}
              onPress={() => {
                setInviteCode("");
                setCreatingServer(true);
              }}
            >
              <Text style={styles.submitButtonText}>Create A New Server</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFF", // Off-White background
    padding: 20,
  },
  backButton: {
    padding: 10,
    marginTop: 30, // Adjust for iOS devices
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    flexGrow: 1,
  },
  title: {
    fontSize: Platform.OS === "web" ? 30 : 24,
    fontWeight: "bold",
    color: "#393D3F", // Charcoal Grey
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
    borderRadius: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  createServer: {
    backgroundColor: "#ccc",
    padding: Platform.OS === "web" ? 15 : 20, // Larger padding for mobile
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InviteCodeScreen;
