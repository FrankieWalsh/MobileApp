import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { getCarDetails } from '../apiService';

const CarDetailsScreen = ({ route, navigation }) => {
    const { carId } = route.params;
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch car details from API when component mounts
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

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    if (!car) {
        return <Text>No car details available.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{car.name}</Text>
            <Text>Price: {car.price}</Text>
            <Text>Description: {car.description}</Text>
            <Button title="Book Now" onPress={() => navigation.navigate('Booking', { carId })} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default CarDetailsScreen;
