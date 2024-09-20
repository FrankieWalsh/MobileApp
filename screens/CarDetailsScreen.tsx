import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CarDetailsScreen = ({ route, navigation }) => {
    const { car } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Details for {car.name}</Text>
            <Text>Price: {car.price}</Text>
            <Text>Other details...</Text>
            <Button
                title="Book this Car"
                onPress={() => navigation.navigate('Booking', { car })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default CarDetailsScreen;
