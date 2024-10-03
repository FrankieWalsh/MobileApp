import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import PaymentScreen from './screens/PaymentScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import CarListScreen from './screens/CarListScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SupportScreen from './screens/SupportScreen';

// Define the type for the Stack Navigator
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  CarDetails: undefined;
  Notifications: undefined;
  CarList: undefined;
  Booking: undefined;
  Payment: undefined;
  Confirmation: undefined;
  Support: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="CarDetails" component={CarDetailsScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="CarList" component={CarListScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
