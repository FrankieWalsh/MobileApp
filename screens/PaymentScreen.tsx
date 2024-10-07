import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PaymentScreen = ({ route, navigation }) => {
    const { car } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment for {car.name}</Text>
            <Text>Payment processing screen...</Text>
            <Button
                title="Confirm Payment"
                onPress={() => navigation.navigate('Confirmation')}
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
        fontFamily: "Montserrat-Bold",
        fontSize: 24,
        marginBottom: 20,
    },
});

export default PaymentScreen;
