import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set the base URL for API requests
const api = axios.create({
    baseURL: Platform.OS === 'web' ? 'http://192.168.1.143:3000/' : 'http://192.168.1.143:3000/', // Use local IP for both mobile and web
});

// Set up Axios Interceptors
api.interceptors.request.use(
  async (config) => {
    let token = null;

    // Get the token from localStorage (for web) or AsyncStorage (for mobile)
    if (Platform.OS === 'web') {
      token = localStorage.getItem('token');  // Use localStorage for web
    } else {
      token = await AsyncStorage.getItem('token');  // Use AsyncStorage for mobile
    }

    // If there's a token, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
