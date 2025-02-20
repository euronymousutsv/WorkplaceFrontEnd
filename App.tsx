import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';  
import WelcomeScreen from './src/screens/WelcomeScreen';
import { Text } from 'react-native';  

// Create a stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Welcome Screen */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />

        {/* Login Screen */}
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


// Placeholder Dashboard Screens
const AdminDashboard = () => <Text>Admin Dashboard</Text>;
const EmployeeDashboard = () => <Text>Employee Dashboard</Text>;

export default App;
