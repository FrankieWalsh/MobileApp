import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ScrollView } from 'react-native';
import { getUserBooking, cancelBooking  } from '../apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getImage } from '../utils/imageMap';
import Header from '../header/header';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBookingId, setExpandedBookingId] = useState(null); // State to track expanded bookings

    const fetchUserData = async () => {
        try {
            const name = await AsyncStorage.getItem('userName');
            setUserName(name || 'User');

            const bookings = await getUserBooking();
            setBookings(bookings); // Set all bookings
        } catch (error) {
            console.error('Error loading user data or booking:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refetch data every time the Home screen is focused
    useFocusEffect(
        useCallback(() => {
            setLoading(true); // Set loading state
            fetchUserData();   // Re-fetch data when the screen is focused
        }, [])
    );

    const toggleBookingDetails = (bookingId) => {
        if (expandedBookingId === bookingId) {
            setExpandedBookingId(null); // Collapse if already expanded
        } else {
            setExpandedBookingId(bookingId); // Expand the clicked booking
        }
    };

    // Function to handle the cancellation of a booking
    const handleCancelBooking = async (bookingId) => {
        try {
            await cancelBooking(bookingId);  // Call the API to cancel the booking
            Alert.alert('Success', 'Booking has been cancelled.');

            // Update the state to reflect the cancelled booking
            setBookings(bookings.filter(booking => booking._id !== bookingId));
        } catch (error) {
            Alert.alert('Error', 'Failed to cancel the booking. Please try again.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.container2}>
            <Header />
            <View style={styles.container}>
                <Text style={styles.title}>Welcome, {userName}!</Text>
                <Text style={styles.subtitle}>Find your perfect car now!</Text>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>

                    <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('CarList')}>
                        <View style={styles.bigButtonContent}>
                            <Text style={styles.buttonMainText}>Available Cars</Text>
                            <Text style={styles.buttonSubText}>Long term, Short term</Text>
                            <View style={styles.arrowContainer}>
                                <Text style={styles.arrowText}>→</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Display all bookings */}
                    <Text style={styles.title}>Booked cars</Text>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <View key={booking._id} style={styles.carCard}>
                                <TouchableOpacity onPress={() => toggleBookingDetails(booking._id)}>
                                    <View style={styles.carHeader}>
                                        <Image source={getImage(booking.car_id.image)} style={styles.carImage} />
                                        <View style={styles.carDetails}>
                                            <Text style={styles.carName}>{booking.car_id.model}</Text>
                                            <Text style={styles.carBrand}>{booking.car_id.brand}</Text>
                                        </View>
                                        <Text style={styles.arrow}>{expandedBookingId === booking._id ? '↑' : '↓'}</Text>
                                    </View>
                                </TouchableOpacity>

                                {expandedBookingId === booking._id && (
                                    <View style={styles.expandedDetails}>
                                        <Text style={styles.detailText}>
                                            Pickup Location: {booking.pickup_location_id.address}
                                        </Text>
                                        <Text style={styles.detailText}>
                                            Rental Start: {new Date(booking.rental_start_date).toLocaleDateString()}
                                        </Text>
                                        <Text style={styles.detailText}>
                                            Rental End: {new Date(booking.rental_end_date).toLocaleDateString()}
                                        </Text>

                                        {/* Add the cancel booking button */}
                                        <TouchableOpacity onPress={() => handleCancelBooking(booking._id)}>
                                            <Text style={styles.cancelButton}>Cancel Booking</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.subtitle}>No cars booked currently.</Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container2: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 20,
        paddingTop: 130,
    },
    scrollViewContainer: {
        paddingVertical: 10,
    },
    title: {
        fontFamily: "Montserrat-Bold",
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        marginTop: 35,
    },
    subtitle: {
        fontFamily: "Montserrat-Medium",
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    carCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 20,
        padding: 15,
    },
    carHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carImage: {
        width: 100,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    carDetails: {
        flex: 1,
    },
    carName: {
        fontFamily: "Montserrat-Bold",
        fontSize: 18,
        fontWeight: 'bold',
    },
    carBrand: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    arrow: {
        fontFamily: "Montserrat-Bold",
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6836F5',
    },
    expandedDetails: {
        marginTop: 10,
    },
    detailText: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        color: '#555',
    },
    garageLink: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        color: '#6836F5',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    bigButton: {
        backgroundColor: '#6836F5',
        paddingVertical: 25,
        borderRadius: 15,
        marginBottom: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    bigButtonContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
    },
    buttonMainText: {
        fontFamily: "Montserrat-Bold",
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 20,
    },
    buttonSubText: {
        fontFamily: "Montserrat-Medium",
        padding: 10,
        fontSize: 14,
        color: '#ddd',
        marginLeft: 12,
    },
    arrowContainer: {
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    arrowText: {
        color: '#6836F5',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cancelButton: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        color: 'red',  // Red text color for the cancel button
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});

export default HomeScreen;
