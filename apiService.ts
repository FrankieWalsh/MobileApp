import axios from 'axios';

const BASE_URL = 'http://192.168.111.2:5000/api'; //Change to your computers IP

export const getCars = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/cars`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car data:', error);
        throw error;
    }
};

// Function to get car details by ID
export const getCarDetails = async (carId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/cars/${carId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car details:', error);
        throw error;
    }
};

// Function to book a car
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
