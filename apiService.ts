import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = 'http://10.126.0.155:5000/api'; // For your Wi-Fi connection

// Get list of cars
export const getCars = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/cars`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car data:', error);
        throw error;
    }
};

// Get car details by ID
export const getCarDetails = async (carId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/cars/${carId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car details:', error);
        throw error;
    }
};

// Book a car
export const bookCar = async (carId: string, bookingDetails: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/bookings`, {
            carId,
            ...bookingDetails,
        });
        return response.data;
    } catch (error) {
        console.error('Error booking the car:', error);
        throw error;
    }
};

// User login
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// User signup
export const signUpUser = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/signup`, {
            name,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

// Fetch all locations
export const getLocations = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/locations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

export const getUserBooking = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await axios.get(`${BASE_URL}/bookings/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user booking:', error);
        throw error;
    }
};
