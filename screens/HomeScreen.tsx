import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getUserBooking } from '../apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../header/header';

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
    const [bookedCar, setBookedCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const name = await AsyncStorage.getItem('userName');
                setUserName(name || 'User');

                const bookings = await getUserBooking();
                if (bookings && bookings.length > 0) {
                    setBookedCar(bookings[0]);
                }
            } catch (error) {
                console.error('Error loading user data or booking:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.container}>
            <Header/>
            <Text style={styles.title}>Welcome, {userName}!</Text>
            <Text style={styles.subtitle}>Find your perfect car now!</Text>

            {/* Display booked car if available */}
            {bookedCar ? (
                <View style={styles.carCard}>
                    <Image source={getImageForCar(bookedCar.car_id.image)} style={styles.carImage} />
                    <View style={styles.carDetails}>
                        <Text style={styles.carName}>{bookedCar.car_id.model}</Text>
                        <Text style={styles.carBrand}>{bookedCar.car_id.brand}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('BookingConfirmation', { carId: bookedCar.car_id._id })}>
                            <Text style={styles.garageLink}>View Booking</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text>No car booked currently.</Text>
            )}

            {/* Updated Available Cars Button */}
            <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('CarList')}>
                <View style={styles.bigButtonContent}>
                    <Text style={styles.buttonMainText}>Available Cars</Text>
                    <Text style={styles.buttonSubText}>Long term, Short term</Text>
                    <View style={styles.arrowContainer}>
                        <Text style={styles.arrowText}>→</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 20,
        paddingTop: 130,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    carCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 20,
        padding: 15,
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
    garageLink: {
        fontSize: 14,
        color: '#6836F5',
        textDecorationLine: 'underline',
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
        flexDirection: 'column',  // Change this to column for a vertical layout
        justifyContent: 'center',
        alignItems: 'flex-start',  // Center the text horizontally
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
        alignSelf: "flex-end",
        marginRight: 20,
    },
    arrowText: {
        color: '#6836F5',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
