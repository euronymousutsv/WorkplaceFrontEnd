import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, Dimensions } from 'react-native';
import axios from '../utils/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // For the eye icon and social icons

const { width, height } = Dimensions.get('window');
const isLandscape = width > height; // Check if the screen is in landscape mode

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async () => {
    try {
      console.log('Login attempt with:', { email, password });  // Log the login data
  
      const response = await axios.post('http://192.168.1.143:3000/api/auth/login', { email, password });
  
      console.log('Backend Response:', response.data);  // Log the response data
  
      const { token, role } = response.data;
  
      if (token) {
        console.log('Token received:', token);  // Log the token
  
        // Store the token in localStorage (for web) or AsyncStorage (for mobile)
        if (Platform.OS === 'web') {
          localStorage.setItem('token', token);  // For Web, use localStorage
        } else {
          await AsyncStorage.setItem('token', token);  // For Mobile, use AsyncStorage
        }
  
        // Navigate based on user role
        if (role === 'admin') {
          console.log('Redirecting to Admin Dashboard');
          navigation.navigate('AdminDashboard');
        } else {
          console.log('Redirecting to Employee Dashboard');
          navigation.navigate('EmployeeDashboard');
        }
      } else {
        setError('No token received');
        console.error('No token received from backend');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Invalid credentials');
    }
  };
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
      </View>

      {/* Form (Email, Password) */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* orLogin with text */}
        <Text style={styles.orLoginText}>or login with:</Text>

        {/* Social Media Logos (Apple and Google) */}
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
            <Ionicons name="logo-apple" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <Ionicons name="logo-google" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Don't have an account */}
        <View style={styles.signupContainer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDFDFF', // Off-White background
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    fontSize: Platform.OS === 'web' ? 16 : 10,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column', // Row for web, column for mobile
  },
  welcomeContainer: {
    width: Platform.OS === 'web' ? '40%' : '100%', // Make "Welcome back" take up 40% width on web, full width on mobile
    marginBottom: 20,
    textAlign: Platform.OS === 'web' ? 'left' : 'center', // Left aligned for web, center for mobile
  },
  welcomeText: {
    fontSize: Platform.OS === 'web' ? 30 : 24,
    fontWeight: 'bold',
    color: '#393D3F', // Charcoal Grey
    marginBottom: 20,
  },
  formContainer: {
    width: Platform.OS === 'web' ? '60%' : '100%', // Form takes 60% width on web, full width on mobile
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? '5%' : '10%', // Add space on top for web
  },
  input: {
    width: '100%',
    padding: Platform.OS === 'web' ? 15 : 20, // Larger padding for web
    borderWidth: 3,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 25,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'web' ? 15 : 20, // Adjust position for web
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: Platform.OS === 'web' ? 15 : 20, // Larger padding for mobile
    borderRadius: 25, // Rounded corners
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  socialButton: {
    width: '15%',
    padding: Platform.OS === 'web' ? 10 : 15, // Larger padding for mobile
    borderRadius: 25,
    backgroundColor: '#4A90E2', // Light Blue background for social buttons
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  appleButton: {
    backgroundColor: '#000000', // Black for Apple button
  },
  googleButton: {
    backgroundColor: '#DB4437', // Red for Google button
  },
  orLoginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#393D3F', // Charcoal Grey
    marginVertical: 10, // Space between the buttons and text
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    color: '#007bff', // Blue for the register link
    textDecorationLine: 'underline',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 100,
  },
});

export default LoginScreen;
