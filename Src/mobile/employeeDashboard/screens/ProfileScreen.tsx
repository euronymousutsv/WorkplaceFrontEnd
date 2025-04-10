import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Button,
  Modal,
  SafeAreaView,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import JWT from "expo-jwt"; // Import expo-jwt to decode the token
import { getToken, deleteToken } from "../../../api/auth/token"; // Import getToken to access the token directly
import { getCurrentUserDetails } from "../../../api/auth/profileApi"; // Import API call to fetch user details
import { editCurrentUserDetail } from "../../../api/auth/profileApi"; // Import API for editing details
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigationTypes";
import { leaveServer } from "../../../api/server/serverApi";
import { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";

const ProfileScreen = ({
  toggleMenu,
  toggleNotification,
}: {
  toggleMenu: () => void;
  toggleNotification: () => void;
}) => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null); // Store user details
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching user details
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCloseModal = () => {
    setIsChecked(false);
    setIsModalOpen(false);
  };
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLeaveServer = async () => {
    try {
      const res = await leaveServer();
      if (res.statusCode === 200) {
        setIsModalOpen(false);
        Toast.show({
          text1: res.message,
          type: "error",
          position: "bottom",
        });
      } else if (res instanceof ApiError) {
        setIsModalOpen(false);
        Toast.show({
          text1: res.message,
          type: "error",
          position: "bottom",
        });
      }
    } catch (error) {
      navigation.goBack();
      Toast.show({
        text1: "Something went wrong",
        type: "error",
        position: "bottom",
      });
    }
  };

  // Fetch user details and token from storage
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = await getToken("accessToken");
        if (!accessToken) {
          alert("Token is missing. Please log in again.");
          return;
        }

        // Extract userId from decoded JWT token
        const decodedToken = JWT.decode(accessToken, null);
        const userId = decodedToken?.userId;

        if (userId) {
          const response = await getCurrentUserDetails(userId, accessToken);
          // console.log("Fetched User Details:", response); // Log the entire response

          if (response?.data) {
            setUserDetails(response.data); // Set only the 'data' part of the response
          } else {
            setUserDetails(null);
          }
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails(null);
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, []);

  const handleProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setProfilePic(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#4A90E2"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  if (!userDetails) {
    return <Text>Failed to load user details.</Text>;
  }
  const handleLogout = async () => {
    try {
      // Delete the access token
      await deleteToken("accessToken");
      // Uncomment if you're using refresh token as well
      // await deleteToken("refreshToken");

      // Debugging: Log to check if the token is deleted
      const accessToken = await getToken("accessToken");
      console.log("Token after deletion:", accessToken); // Should return null if token is deleted

      navigation.reset({
        index: 0, // Set the active screen to 0 (the Login screen)
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={toggleNotification}
        >
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Picture */}
        <TouchableOpacity
          onPress={handleProfilePicture}
          style={styles.profilePicContainer}
        >
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require("../../../../assets/wpslogo.png")
            }
            style={styles.profilePic}
          />
          <Ionicons
            name="camera"
            size={24}
            color="white"
            style={styles.cameraIcon}
          />
        </TouchableOpacity>

        {/* User Info */}
        <Text style={styles.name}>
          {userDetails?.firstName} {userDetails?.lastName}{" "}
        </Text>
        <Text style={styles.role}>{userDetails?.role} </Text>

        {/* Info Cards */}
        {/* <View style={styles.infoCard}>
          <Ionicons name="id-card-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Employee ID: {userDetails?.id} </Text>
        </View> */}

        <View style={styles.infoCard}>
          <Ionicons name="person" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>
            Full Name: {userDetails?.firstName} {userDetails?.lastName}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="mail-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Email: {userDetails?.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="call-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Phone: {userDetails?.phoneNumber}</Text>
        </View>

        {/* Work Location not implemented yet on backend */}

        {/* <View style={styles.infoCard}>
          <Ionicons name="business-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Work Location: {userDetails?.workLocation}</Text>
        </View> */}

        <View style={styles.infoCard}>
          <Ionicons name="calendar-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>
            Employment Status: {userDetails?.employmentStatus}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.infoCard}
          onPress={() => {
            navigation.navigate("EditUserDetailScreens");
          }}
        >
          <Ionicons name="lock-closed" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Update Password</Text>
        </TouchableOpacity>

        {/* leave server */}
        <TouchableOpacity
          style={styles.infoCard}
          onPress={() => {
            setIsModalOpen(true);
          }}
        >
          <Ionicons name="exit-sharp" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Leave Server</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        presentationStyle="pageSheet"
        visible={isModalOpen}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCloseModal}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
            quis sem at nibh elementum imperdiet.
          </Text>

          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsChecked(!isChecked);
              }}
              style={styles.checkBoxContainer}
            >
              <View style={[styles.checkbox, isChecked && styles.checked]}>
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.label}>I agree to the terms</Text>
            </TouchableOpacity>

            {/* <CheckBox value={isChecked} onValueChange={setIsChecked} /> */}
            {/* <Text style={styles.checkboxLabel}></Text> */}
          </View>

          <TouchableOpacity
            onPress={handleLeaveServer}
            disabled={!isChecked}
            style={[
              styles.filledButtton,
              { backgroundColor: isChecked ? "#007AFF" : "#aaa" },
            ]}
          >
            <Text style={styles.filledButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFF",
  },
  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  menuButton: {
    position: "absolute",
    left: 10,
  },
  notificationButton: {
    position: "absolute",
    right: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  profilePicContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#4A90E2",
    borderRadius: 50,
    padding: 5,
  },
  section: {
    marginTop: 30,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#393D3F",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#393D3F",
    marginTop: 10,
    marginBottom: 5,
  },
  role: {
    fontSize: 18,
    color: "#4A90E2",
    marginBottom: 10,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    color: "#393D3F",
    marginLeft: 10,
  },
  changePasswordButton: {
    backgroundColor: "#2ECC71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  changePasswordButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#D9534F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },

  // Modal
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backText: {
    fontSize: 18,
    color: "#007AFF",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
  },
  checkBoxContainer: { flexDirection: "row" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#333",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
  },
  label: {
    fontSize: 16,
  },

  filledButtton: {
    marginTop: 20,
    padding: 18,
    borderRadius: 5,
  },
  filledButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default ProfileScreen;
