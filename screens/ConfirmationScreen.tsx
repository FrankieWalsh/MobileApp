import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ConfirmationScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Booking Confirmed!</Text>
            <Text>Your booking has been successfully placed.</Text>
            <Button
                title="Back to Home"
                onPress={() => navigation.navigate('Home')}
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

export default ConfirmationScreen;
