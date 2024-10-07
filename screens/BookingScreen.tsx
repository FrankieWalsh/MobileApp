import React, { useState, useEffect } from 'react';
import {View, Text, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Dimensions} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {bookCar, getLocations, getCarDetails, sendNotification} from '../apiService';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../header/header';

const { width, height } = Dimensions.get('window');

const BookingScreen = ({ route, navigation }) => {
    const { carId } = route.params;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [car, setCar] = useState(null); // New state for car details

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
                // Get car details and store it in state
                const carDetails = await getCarDetails(carId);
                setCar(carDetails); // Save car details to use later for pricing and display
                const carLocationId = carDetails.location_id.id;

                // Fetch all locations and pre-select the car's pickup location
                const fetchedLocations = await getLocations();
                const carLocation = fetchedLocations.find(loc => loc._id === carLocationId);

                if (carLocation) {
                    setPickupLocation(carLocation._id); // Automatically set the pickup location
                }

                // Set the fetched locations for the picker
                setLocations(fetchedLocations.map(loc => ({ label: loc.address, value: loc._id })));
            } catch (error) {
                Alert.alert('Error', 'Unable to fetch car or location details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetailsAndLocations();
    }, [carId]);

    useEffect(() => {
        if (endDate) {
            console.log('Updated End Date:', endDate);
        }
    }, [endDate]);

    const handleDateChange = (date, type) => {
        console.log("1")
        if (type === "END_DATE") {
            setEndDate(date);  // End date is set as usual
            console.log("2")
        } else {
            // Check if the same start date is selected twice
            if (startDate && startDate.toDateString() === date.toDateString()) {
                console.log("3")
                setEndDate(date);  // Treat it as a single-day booking
            } else {
                // Set a new start date and clear the end date for range selection
                console.log("4")
                setStartDate(date);
                setEndDate(null);
            }
        }
    };



    const calculateTotalPrice = () => {
        if (!startDate || !endDate || !car) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = Math.abs(end - start);
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
        return days * car.price;
    };



    const handleBooking = async () => {
        if (!userId) {
            Alert.alert('Error', 'You must be logged in to book a car.');
            return;
        }
        const finalEndDate = endDate ? endDate : startDate;

        const bookingDetails = {
            rentalStartDate: startDate ? startDate.toISOString() : '',
            rentalEndDate: finalEndDate ? finalEndDate.toISOString() : '',
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
        <View style={styles.container}>
            <Header />
            <Text style={styles.heading}>Select Rental Dates</Text>

            <View style={styles.calendarContainer}>
                <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    minDate={new Date()}
                    selectedDayColor="#6836F5"
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={handleDateChange}
                    selectedRangeStyle={styles.selectedRangeStyle}
                    todayBackgroundColor="#E5E5E5"
                    textStyle={styles.calendarText}
                />
            </View>

            <Text>Pickup Location (Pre-filled):</Text>
            <RNPickerSelect
                value={pickupLocation}
                items={locations}
                placeholder={{ label: 'Select a pickup location', value: null }}
                style={pickerSelectStyles}
                disabled={true} // Disable the pickup location selector
                onValueChange={() => {}} // Provide an empty function to avoid the warning
            />

            <Text>Drop-off Location:</Text>
            <RNPickerSelect
                onValueChange={(value) => setDropOffLocation(value)}
                items={locations}
                placeholder={{ label: 'Select a drop-off location', value: null }}
                style={pickerSelectStyles}
            />

            <View style={styles.footerContainer}>
                <View style={styles.footerPriceTag}>
                    <Text style={styles.footerPrice}>${calculateTotalPrice()}</Text>
                    <Text style={styles.footerPricePerDay}> total price</Text>
                </View>

                <View>
                    <TouchableOpacity onPress={handleBooking} style={styles.footerButtonContainer}>
                        <Text style={styles.footerButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f4f4f9', // Light background to enhance contrast
        flex: 1,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center', // Center align the heading
    },
    calendarContainer: {
        backgroundColor: '#ECECFF', // Light purple/blue background to contrast with main background
        padding: 10,
        borderRadius: 20, // Rounded corners for a modern look
        marginTop: 70,
    },
    dateContainer: {
        marginTop: 16,
        marginBottom: 20,
    },
    calendarText: {
        color: '#333', // General text color for the calendar
        fontWeight: 'bold', // Make the calendar text bold
    },
    selectedRangeStyle: {
        backgroundColor: '#669cf2', // Color for the selected date range
    },
    selectedRangeStartStyle: {
        backgroundColor: '#6836F5',
        borderTopLeftRadius: 15, // Rounded corners for start date
        borderBottomLeftRadius: 15,
    },
    selectedRangeEndStyle: {
        backgroundColor: '#6836F5',
        borderTopRightRadius: 15, // Rounded corners for end date
        borderBottomRightRadius: 15,
    },
    headerWrapperStyle: {
        backgroundColor: '#ECECFF', // Matching the header background with the overall design
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 10, // Add vertical padding for space around the text
        paddingHorizontal: 10, // Adjust horizontal padding to reduce background extension
        maxWidth: '95%', // Shrink the header horizontally (adjust as needed)
        alignSelf: 'center', // Center the header within the calendar
        overflow: 'hidden', // Ensure the content doesn't overflow
    },
    footerContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: width,
        minHeight: 90,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    footerPriceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    footerPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    footerPricePerDay: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 5,
    },
    footerButtonContainer: {
        backgroundColor: '#6836F5',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    footerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },




    arrowStyle: {
        fontSize: 24,
        color: '#6836F5', // Arrow color to match the selected date color
    },
});

// Picker styles to make the location dropdown match the calendar style
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is not covered by the icon
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is not covered by the icon
        marginBottom: 10,
        backgroundColor: '#fff',
    },
});

export default BookingScreen;
