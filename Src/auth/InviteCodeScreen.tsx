import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InviteCodeScreen = ({ navigation }: { navigation: any }) => {
  const [inviteCode, setInviteCode] = useState<string>(''); // Store invite code input

  const handleSubmit = () => {
    if (inviteCode.length !== 8) {
      Alert.alert('Error', 'Invite code must be 8 characters long.');
    } else {
      console.log('Invite Code Submitted:', inviteCode);
      // Navigate to the next screen or perform some other action after success
      navigation.navigate('SignUp'); // Navigate to the signup screen
    }
  };

  const handleBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={29} color="black" />
      </TouchableOpacity>

      {/* Invite Code Input Form */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Enter Invite Code</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter 8-character invite code"
          value={inviteCode}
          onChangeText={setInviteCode}
          maxLength={8}
          keyboardType="default" // You can also use numeric if invite code is only numbers
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFF', // Off-White background
    padding: 20,
  },
  backButton: {
    padding: 10,
    marginTop: 30, // Adjust for iOS devices
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    flexGrow: 1,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 30 : 24,
    fontWeight: 'bold',
    color: '#393D3F', // Charcoal Grey
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: Platform.OS === 'web' ? 15 : 20, // Larger padding for mobile
    borderWidth: 3,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 25,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    padding: Platform.OS === 'web' ? 15 : 20, // Larger padding for mobile
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InviteCodeScreen;
