import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Mock user data (Replace with backend later)
const mockUser = {
  profilePic: null,
  fullName: 'John Doe',
  employeeId: 'EMP12345',
  role: 'Employee',
  email: 'johndoe@example.com',
  phone: '+61 400 123 456',
  workLocation: 'Melbourne, Australia',
  employmentType: 'Full-Time',
  joinDate: 'January 10, 2023',
};

const ProfileScreen = ({ toggleMenu, toggleNotification }: { toggleMenu: () => void, toggleNotification: () => void }) => {
  const [profilePic, setProfilePic] = useState<string | null>(mockUser.profilePic);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Handle profile picture selection
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

  // Handle Change Password
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password changed successfully! (Backend integration needed)');
    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
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
        <Text style={styles.name}>{mockUser.fullName}</Text>
        <Text style={styles.role}>{mockUser.role}</Text>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <Ionicons name="id-card-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Employee ID: {mockUser.employeeId}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="mail-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Email: {mockUser.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="call-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Phone: {mockUser.phone}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="business-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Work Location: {mockUser.workLocation}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="calendar-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Employment Type: {mockUser.employmentType}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={22} color="#4A90E2" />
          <Text style={styles.infoText}>Joined On: {mockUser.joinDate}</Text>
        </View>

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
        <TouchableOpacity style={styles.logoutButton}>
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
