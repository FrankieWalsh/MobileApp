import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';

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
import UserScreen from './screens/UserScreen';

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
  User: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load custom fonts
  const loadFonts = async () => {
    await Font.loadAsync({
      'Montserrat-ExtraBold': require('./assets/fonts/Montserrat-ExtraBold.ttf'),
      'Montserrat-ExtraBoldItalic': require('./assets/fonts/Montserrat-ExtraBoldItalic.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-BoldItalic': require('./assets/fonts/Montserrat-BoldItalic.ttf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-MediumItalic': require('./assets/fonts/Montserrat-MediumItalic.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

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
          <Stack.Screen name="User" component={UserScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;