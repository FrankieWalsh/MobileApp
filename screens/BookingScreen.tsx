import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import { bookCar, getLocations } from '../apiService';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = ({ route, navigation }) => {
    const { carId } = route.params;
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const fetchedLocations = await getLocations();
                setLocations(fetchedLocations.map(loc => ({ label: loc.address, value: loc._id })));
            } catch (error) {
                Alert.alert('Error', 'Unable to fetch locations.');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const handleBooking = async () => {
        if (!userId) {
            Alert.alert('Error', 'You must be logged in to book a car.');
            return;
        }

        const bookingDetails = {
            rentalStartDate: startDate.toISOString(),
            rentalEndDate: endDate.toISOString(),
            pickupLocation,
            dropOffLocation,
            userId
        };

        try {
            await bookCar(carId, bookingDetails);
            Alert.alert('Booking Confirmed', 'Your car has been booked successfully.');
            // navigation.navigate('BookingConfirmation', { carId });
            navigation.navigate('Home')
        } catch (error) {
            Alert.alert('Booking Failed', 'There was an error processing your booking.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.container}>
            <Text>Start Date:</Text>
            <Button title={startDate.toDateString()} onPress={() => setShowStartDatePicker(true)} />
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowStartDatePicker(false);
                        if (selectedDate) {
                            setStartDate(selectedDate);
                        }
                    }}
                />
            )}

            <Text>End Date:</Text>
            <Button title={endDate.toDateString()} onPress={() => setShowEndDatePicker(true)} />
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowEndDatePicker(false);
                        if (selectedDate) {
                            setEndDate(selectedDate);
                        }
                    }}
                />
            )}

            <Text>Pickup Location:</Text>
            <RNPickerSelect
                onValueChange={(value) => setPickupLocation(value)}
                items={locations}
                placeholder={{ label: 'Select a pickup location', value: null }}
            />

            <Text>Drop-off Location:</Text>
            <RNPickerSelect
                onValueChange={(value) => setDropOffLocation(value)}
                items={locations}
                placeholder={{ label: 'Select a drop-off location', value: null }}
            />

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
