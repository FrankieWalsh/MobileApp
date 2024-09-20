import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const BookingScreen = ({ route, navigation }) => {
    const { car } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Booking for {car.name}</Text>
            <Text>Confirm your booking details...</Text>
            <Button
                title="Proceed to Payment"
                onPress={() => navigation.navigate('Payment', { car })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default BookingScreen;
