import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Alert, 
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import JWT from 'expo-jwt';  // Import expo-jwt to decode the token
import { getToken, deleteToken } from '../../../api/auth/token';  // Import getToken to access the token directly
import { getCurrentUserDetails } from '../../../api/auth/profileApi';  // Import API call to fetch user details
import { editCurrentUserDetail } from '../../../api/auth/profileApi';  // Import API for editing details
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigationTypes';


const ProfileScreen = ({  toggleMenu, toggleNotification }: {  toggleMenu: () => void, toggleNotification: () => void }) => {

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);  // Store user details
  const [loading, setLoading] = useState<boolean>(true);  // Loading state for fetching user details
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); 
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      // Call the backend API to change password
      const accessToken = await getToken("accessToken");
      // Ensure we have a valid access token
    if (!accessToken) {
      alert('Token is missing. Please log in again.');
      return;
    }
      const decodedToken = JWT.decode(accessToken, null);
      const userId = decodedToken?.userId;

      if (userId) {
        const response = await editCurrentUserDetail(userId, accessToken, currentPassword, 'password', newPassword);
        
        if (response.statusCode === 200) {
          alert('Password changed successfully!');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
        } else {
          alert(response.message || 'Failed to change password');
        }
      } else {
        alert('User not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || 'Something went wrong');
      } else {
        alert('Something went wrong');
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4A90E2" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
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
      console.log("Token after deletion:", accessToken);  // Should return null if token is deleted
  
      navigation.reset({
        index: 0,  // Set the active screen to 0 (the Login screen)
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout');
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={toggleNotification}>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Picture */}
        <TouchableOpacity onPress={handleProfilePicture} style={styles.profilePicContainer}> 
          <Image 
            source={profilePic ? { uri: profilePic } : require('../../../../assets/wpslogo.png')} 
            style={styles.profilePic} 
          />
          <Ionicons name="camera" size={24} color="white" style={styles.cameraIcon} />
        </TouchableOpacity>

        {/* User Info */}
        <Text style={styles.name}>{userDetails?.firstName} {userDetails?.lastName} </Text>
        <Text style={styles.role}>{userDetails?.role } </Text>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <Ionicons name="id-card-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Employee ID: {userDetails?.id} </Text>
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
          <Text style={styles.infoText}>Employment Status: {userDetails?.employmentStatus}</Text>
        </View>
        
        {/* Join date not implemented yet on backend */}
        {/* <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Joined On: {userDetails?.joinDate}</Text>
        </View> */}

        {/* Change Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>

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

          <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
            <Text style={styles.changePasswordButtonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFF',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  menuButton: {
    position: 'absolute',
    left: 10,
  },
  notificationButton: {
    position: 'absolute',
    right: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4A90E2',
    borderRadius: 50,
    padding: 5,
  },
  section: {
    marginTop: 30,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#393D3F',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#393D3F',
    marginTop: 10,
    marginBottom: 5,
  },
  role: {
    fontSize: 18,
    color: '#4A90E2',
    marginBottom: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#393D3F',
    marginLeft: 10,
  },
  changePasswordButton: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  changePasswordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#D9534F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;
