import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = 'http://192.168.111.3:5000/api'; // Adjust to your correct server IP

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
export const getCarDetails = async (carId) => {
    try {
        const response = await axios.get(`${BASE_URL}/cars/${carId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car details:', error);
        throw error;
    }
};

// Book a car
export const bookCar = async (carId, bookingDetails) => {
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
export const loginUser = async (email, password) => {
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
export const signUpUser = async (name, email, password) => {
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

// Get user booking details
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

// Get all notifications for a specific user
export const getNotifications = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');  // Fetch from local storage
        const response = await axios.get(`${BASE_URL}/notifications/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

// Post booking confirmation notification
export const createBookingConfirmationNotification = async (userId, carModel, pickupLocation, pickupDate, price) => {
    try {
        const response = await axios.post(`${BASE_URL}/notifications/booking-confirmation`, {
            userId,
            carModel,
            pickupLocation,
            pickupDate,
            price,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.put(`${BASE_URL}/notifications/mark-read/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const sendNotification = async (notificationDetails) => {
    try {
        const response = await axios.post(`${BASE_URL}/notifications`, notificationDetails);
        return response.data;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};
