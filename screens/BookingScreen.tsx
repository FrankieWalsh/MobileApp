import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { bookCar, getLocations, getCarDetails, sendNotification } from '../apiService';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../header/header';
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment'; // Import moment to help with date calculations

const { width, height } = Dimensions.get('window');

const BookingScreen = ({ route, navigation }) => {
    const { carId } = route.params;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [car, setCar] = useState(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const data = await getCarDetails(carId);
                setCar(data);
            } catch (err) {
                setError('Error fetching car details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [carId]);

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
        const fetchCarDetailsAndLocations = async () => {
            try {
                const carDetails = await getCarDetails(carId);
                const carLocationId = carDetails.location_id.id;

                const fetchedLocations = await getLocations();
                const carLocation = fetchedLocations.find(loc => loc._id === carLocationId);

                if (carLocation) {
                    setPickupLocation(carLocation._id);
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
        if (type === 'START_DATE') {
            setStartDate(date);
        } else if (type === 'END_DATE') {
            setEndDate(date);
        }
    };

    // Calculate total rental days and price
    const calculateTotalPrice = () => {
        if (!startDate || !endDate || !car) return 0;

        // Calculate the number of rental days
        const rentalDays = moment(endDate).diff(moment(startDate), 'days') + 1;
        const totalPrice = rentalDays * car.price;

        return totalPrice;
    };

    const handleBooking = async () => {
        if (!userId) {
            Alert.alert('Error', 'You must be logged in to book a car.');
            return;
        }
        if (!startDate) {
            Alert.alert('Error', 'Please select a rental start date.');
            return;
        }
        if (!endDate) {
            Alert.alert('Error', 'Please select a rental end date.');
            return;
        }
        if (!pickupLocation) {
            Alert.alert('Error', 'Pickup location is not set.');
            return;
        }
        if (!dropOffLocation) {
            Alert.alert('Error', 'Please select a drop-off location.');
            return;
        }

        // Construct booking details object
        const bookingDetails = {
            rentalStartDate: startDate ? startDate.toISOString() : '',
            rentalEndDate: endDate ? endDate.toISOString() : '',
            pickupLocation,
            dropOffLocation,
            userId,
        };

        try {
            // Make the booking API call
            const bookingResponse = await bookCar(carId, bookingDetails);

            // Check the response structure to confirm booking
            if (bookingResponse && bookingResponse.success) {
                const notificationDetails = {
                    user_id: userId,
                    message: `Your booking for ${bookingResponse.booking.car_id.model} is confirmed! Pickup: ${pickupLocation}, Drop-off: ${dropOffLocation}.`
                };

                // Show success alert and navigate back to Home
                Alert.alert('Booking Confirmed', 'Your car has been booked successfully.');
                navigation.navigate('Home');
            } else {
                console.error('Failed to book on server:', bookingResponse);
                Alert.alert('Error', 'Failed to book the car. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            Alert.alert('Error', 'Failed to book the car. Please try again.');
        }
    };


    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.container2}>
            <Header />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('CarDetails', { carId })}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerSpace}></View>
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
                        selectedRangeStartStyle={styles.selectedRangeStartStyle}
                        selectedRangeEndStyle={styles.selectedRangeEndStyle}
                        textStyle={styles.calendarText}
                    />
                </View>

                <Text>Pickup Location (Pre-filled):</Text>
                <RNPickerSelect
                    value={pickupLocation} // Pre-fill the car's pickup location
                    items={locations}
                    placeholder={{ label: 'Select a pickup location', value: null }}
                    style={pickerSelectStyles}
                    disabled={true} // Disable the pickup location selector
                    onValueChange={() => { }} // Provide an empty function to satisfy the required prop
                />


                <Text>Drop-off Location:</Text>
                <RNPickerSelect
                    onValueChange={(value) => setDropOffLocation(value)}
                    items={locations}
                    placeholder={{ label: 'Select a drop-off location', value: null }}
                    style={pickerSelectStyles}
                />
            </View>

            {/* Footer with total price and booking button */}
            <View style={styles.footerContainer}>
                <View style={styles.footerPriceTag}>
                    <Text style={styles.footerPrice}>${calculateTotalPrice()}</Text>
                    <Text style={styles.footerPricePerDay}> total</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.footerButtonContainer} onPress={handleBooking}>
                        <Text style={styles.footerButtonText}>Confirm</Text>
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
    container2: {
        flex: 1,
    },
    headerSpace: {
        marginTop: 150,
    },
    space2: {
        marginTop: 20,
    },
    heading: {
        padding: 10,
        fontFamily: "Montserrat-Bold",
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: -50,
        color: '#000',
        textAlign: 'center', // Center align the heading
    },
    calendarContainer: {
        backgroundColor: '#ECECFF', // Light purple/blue background to contrast with main background
        padding: 10,
        borderRadius: 20, // Rounded corners for a modern look
        marginTop: 70,
    },
    backButton: {
        position: 'absolute',
        top: 160,
        left: 20,
        zIndex: 10, // Ensure the back button is on top of everything
        backgroundColor: '#00000080', // Semi-transparent background
        padding: 10,
        borderRadius: 20,
    },
    dateContainer: {
        marginTop: 16,
        marginBottom: 20,
    },
    calendarText: {
        fontFamily: "Montserrat-Bold",
        paddingHorizontal: 7,
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
    arrowStyle: {
        fontSize: 24,
        color: '#6836F5', // Arrow color to match the selected date color
    },
    confirmButton: {
        backgroundColor: '#6836F5',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginHorizontal: 20,
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    confirmButtonText: {
        fontFamily: "Montserrat-Bold",
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
        fontFamily: "Montserrat-Bold",
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
    },
    footerPricePerDay: {
        fontFamily: "Montserrat-Medium",
        fontSize: 16,
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
        fontFamily: "Montserrat-Bold",
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
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
});

// Picker styles to make the location dropdown match the calendar style
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontFamily: "Montserrat-Medium",
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
        fontFamily: "Montserrat-Medium",
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
