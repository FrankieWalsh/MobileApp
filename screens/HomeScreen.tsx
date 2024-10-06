import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { getUserBooking } from '../apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../header/header';
import { useFocusEffect } from '@react-navigation/native';

// Function to map car images dynamically
const getImageForCar = (imageName) => {
    const images = {
        'white-tesla.png': require('../assets/cars/white-tesla.png'),
        'black-toyota.png': require('../assets/cars/black-toyota.png'),
        'gray-toyota.png': require('../assets/cars/gray-toyota.png'),
        'red-bmw.png': require('../assets/cars/red-bmw.png'),
        'blue-bmw.png': require('../assets/cars/blue-bmw.png'),
        'black-audi.png': require('../assets/cars/black-audi.png'),
        'blue-honda.png': require('../assets/cars/blue-honda.png'),
        'green-mini.png': require('../assets/cars/green-mini.png'),
        'black-land-rover.png': require('../assets/cars/black-land-rover.png'),
        'blue-jeep.png': require('../assets/cars/blue-jeep.png'),
        'black-bmw.png': require('../assets/cars/black-bmw.png'),
        'black-noah-toyota.png': require('../assets/cars/black-noah-toyota.png'),
        'blue-ford.png': require('../assets/cars/blue-ford.png'),
        'silver-bmw.png': require('../assets/cars/silver-bmw.png'),
    };

    return images[imageName] || require('../assets/cars/silver-bmw.png'); // Fallback to a default image
};

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
            <Text style={styles.title}>Booked cars:</Text>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <View key={booking._id} style={styles.carCard}>
                        <TouchableOpacity onPress={() => toggleBookingDetails(booking._id)}>
                            <View style={styles.carHeader}>
                                <Image source={getImageForCar(booking.car_id.image)} style={styles.carImage} />
                                <View style={styles.carDetails}>
                                    <Text style={styles.carName}>{booking.car_id.model}</Text>
                                    <Text style={styles.carBrand}>{booking.car_id.brand}</Text>
                                </View>
                                {/* Arrow to indicate expand/collapse */}
                                <Text style={styles.arrow}>{expandedBookingId === booking._id ? '↑' : '↓'}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* If this booking is expanded, show more details */}
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
                                {/*<TouchableOpacity*/}
                                {/*    onPress={() => navigation.navigate('BookingConfirmation', { carId: booking.car_id._id })}*/}
                                {/*>*/}
                                {/*    <Text style={styles.garageLink}>View Booking</Text>*/}
                                {/*</TouchableOpacity>*/}
                            </View>
                        )}
                    </View>
                ))
            ) : (
                <Text>No cars booked currently.</Text>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        marginTop: 35,
    },
    subtitle: {
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    carBrand: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    arrow: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6836F5',
    },
    expandedDetails: {
        marginTop: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
    },
    garageLink: {
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
    },
    bigButtonContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
    },
    buttonMainText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 20,
    },
    buttonSubText: {
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
});

export default HomeScreen;
