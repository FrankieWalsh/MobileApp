import axios from 'axios';

const BASE_URL = 'http://192.168.111.2:5000/api'; // Change to your computer's IP

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
