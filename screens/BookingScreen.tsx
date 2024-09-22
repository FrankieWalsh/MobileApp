import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { bookCar } from '../apiService';

const BookingScreen = ({ route, navigation }) => {
    const { carId } = route.params;
    const [dates, setDates] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');

    const handleBooking = async () => {
        const bookingDetails = {
            rentalDates: dates,
            pickupLocation,
            dropOffLocation,
        };

        try {
            await bookCar(carId, bookingDetails);
            Alert.alert('Booking Confirmed', 'Your car has been booked successfully.');
            navigation.navigate('BookingConfirmation', { carId });
        } catch (error) {
            Alert.alert('Booking Failed', 'There was an error processing your booking.');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Enter rental dates:</Text>
            <TextInput value={dates} onChangeText={setDates} placeholder="e.g., 2024-10-01 to 2024-10-05" style={styles.input} />
            <Text>Pickup Location:</Text>
            <TextInput value={pickupLocation} onChangeText={setPickupLocation} placeholder="e.g., Copenhagen" style={styles.input} />
            <Text>Drop-off Location:</Text>
            <TextInput value={dropOffLocation} onChangeText={setDropOffLocation} placeholder="e.g., Aarhus" style={styles.input} />
            <Button title="Confirm Booking" onPress={handleBooking} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 4,
    },
});

export default BookingScreen;
