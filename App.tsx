import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React,{useEffect,useState} from 'react';

import axios from 'axios';
export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://192.168.1.222:5000/")
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  });
  return (
    
    <View style={styles.container}>
      
      <Text>{message}</Text>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
