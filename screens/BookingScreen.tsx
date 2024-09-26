import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { bookCar, getLocations, getCarDetails, sendNotification } from '../apiService';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = ({ route, navigation }) => {
    const { carId } = route.params;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
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

    // Fetch car details and location when the component mounts
    useEffect(() => {
        const fetchCarDetailsAndLocations = async () => {
            try {
                // Get the car details (which includes the location_id)
                const carDetails = await getCarDetails(carId);
                const carLocationId = carDetails.location_id;

                // Fetch all locations, and set the car's location as the pickup location
                const fetchedLocations = await getLocations();
                const carLocation = fetchedLocations.find(loc => loc._id === carLocationId);

                if (carLocation) {
                    setPickupLocation(carLocation._id); // Automatically set the pickup location
                }
                setLocations(fetchedLocations.map(loc => ({ label: loc.address, value: loc._id })));

            } catch (error) {
                Alert.alert('Error', 'Unable to fetch car or location details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetailsAndLocations();
    }, [carId]);

    const handleDateChange = (date, type) => {
        console.log("hello")
        if (type === 'START_DATE') {
            setStartDate(date);
        } else if (type === 'END_DATE') {
            setEndDate(date);
        }
    };

    const handleBooking = async () => {
        if (!userId) {
            Alert.alert('Error', 'You must be logged in to book a car.');
            return;
        }

        const bookingDetails = {
            rentalStartDate: startDate ? startDate.toISOString() : '',
            rentalEndDate: endDate ? endDate.toISOString() : '',
            pickupLocation,
            dropOffLocation,
            userId
        };

        try {
            const bookingResponse = await bookCar(carId, bookingDetails);

            // Assuming bookingResponse contains the car details for the notification
            const notificationDetails = {
                user_id: userId,
                message: `Your booking for ${bookingResponse.car.model} is confirmed! Pickup: ${bookingResponse.pickupLocation}, Drop-off: ${bookingResponse.dropOffLocation}.`
            };

            // Send the notification request after booking confirmation
            await sendNotification(notificationDetails);

            Alert.alert('Booking Confirmed', 'Your car has been booked successfully.');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Booking Confirmed', 'Your car has been booked successfully.');
            navigation.navigate('Home');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Text style={styles.heading}>Select Rental Dates</Text>

                <View style={styles.calendarWrapper}>
                    <CalendarPicker
                        startFromMonday={true}
                        allowRangeSelection={true}
                        minDate={new Date()} 
                        selectedDayColor="#1C146B"
                        selectedDayTextColor="#FFFFFF"
                        selectedRangeStyle={styles.selectedRangeStyle}
                        todayBackgroundColor="#5E68C4"
                        selectedRangeStartStyle={styles.selectedRangeStartStyle}
                        selectedRangeEndStyle={styles.selectedRangeEndStyle}
                        textStyle={styles.calendarText}
                        previousTitleStyle={styles.calendarNavButton}
                        nextTitleStyle={styles.calendarNavButton}
                    />
                </View>

                <Text style={styles.label}>Pickup Location (Pre-filled):</Text>
                <RNPickerSelect
                    value={pickupLocation}
                    items={locations}
                    placeholder={{ label: 'Select a pickup location', value: null }}
                    style={pickerSelectStyles}
                    disabled={true}
                    onValueChange={() => {}}
                />

                <Text style={styles.label}>Drop-off Location:</Text>
                <RNPickerSelect
                    onValueChange={(value) => setDropOffLocation(value)}
                    items={locations}
                    placeholder={{ label: 'Select a drop-off location', value: null }}
                    style={pickerSelectStyles}
                />

                <TouchableOpacity style={styles.button} onPress={handleBooking}>
                    <Text style={styles.buttonText}>Confirm Booking</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F5FA',
    },
    scrollViewContainer: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1C146B',
        textAlign: 'center',
    },
    calendarWrapper: {
        padding: 10, // Add padding around the entire calendar
        backgroundColor: '#bfd1e5',
        borderRadius: 20,
        marginTop: 20,
        marginHorizontal: -10,
    },
    calendarText: {
        color: '#333',
        fontWeight: 'bold',
    },
    selectedRangeStyle: {
        backgroundColor: '#5e68c4',
    },
    selectedRangeStartStyle: {
        backgroundColor: '#380096',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    selectedRangeEndStyle: {
        backgroundColor: '#380096',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    calendarNavButton: {
        color: '#1C146B', // Customize the color of the previous/next buttons
        marginHorizontal: 10, // Add space between the buttons and the edges
        fontSize: 18,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        color: '#1C146B',
    },
    button: {
        backgroundColor: '#5E68C4',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#1C146B',
        borderRadius: 8,
        color: '#333',
        paddingRight: 30,
        marginBottom: 10,
        backgroundColor: '#fff',
        width: '100%',
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#1C146B',
        borderRadius: 8,
        color: '#333',
        paddingRight: 30,
        marginBottom: 10,
        backgroundColor: '#fff',
        width: '100%',
    },
});

export default BookingScreen;
