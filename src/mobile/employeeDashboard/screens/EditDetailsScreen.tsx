import JWT from "expo-jwt";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { getToken } from "../../../api/auth/token";
import { editCurrentUserDetail } from "../../../api/auth/profileApi";
import Toast from "react-native-toast-message";
import { editUserDetail } from "../../../api/auth/authApi";
import { AxiosError } from "axios";
import { ApiError } from "../../../api/utils/apiResponse";

const EditDetailScreens = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Toast.show({
        text1: "Please fill in all fields",
        type: "error",
        position: "bottom",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Toast.show({
        text1: "New password doesn't match",
        type: "error",
        position: "bottom",
      });
      return;
    }

    if (newPassword.length < 8 || currentPassword.length < 8) {
      Toast.show({
        text1: "Password length must be at le 8 characters. ",
        type: "error",
        position: "bottom",
      });
      return;
    }

    try {
      // Call the backend API to change password
      const accessToken = await getToken("accessToken");
      // Ensure we have a valid access token
      if (!accessToken) {
        alert("Token is missing. Please log in again.");
        return;
      }

      //   const response = await editCurrentUserDetail(
      //     currentPassword,
      //     "password",
      //     newPassword
      //   );

      const res = await editUserDetail({
        editType: "password",
        newDetail: newPassword,
        password: currentPassword,
      });

      if (res.statusCode === 200) {
        Toast.show({
          text1: "Password changed successfully! ",
          type: "success",
          position: "bottom",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else if (res instanceof ApiError) {
        Toast.show({
          text1: res.message,
          type: "error",
          position: "bottom",
        });
      } else {
        Toast.show({
          text1: "Something went wrong",
          type: "error",
          position: "bottom",
        });
      }
    } catch (error) {
      Toast.show({
        text1: "Something went wrong",
        type: "error",
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView style={styles.section}>
      <Text style={styles.sectionTitle}>Change your password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />

      <TouchableOpacity
        style={styles.changePasswordButton}
        onPress={handleChangePassword}
      >
        <Text style={styles.changePasswordButtonText}>Update Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 30,
    margin: "20",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#393D3F",
    marginBottom: 15,
  },

  changePasswordButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  changePasswordButtonText: {
    color: "white",
    fontSize: 18,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
  },
});

export default EditDetailScreens;
