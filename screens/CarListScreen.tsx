import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const cars = [
    { id: '1', name: 'Audi A4', price: '120/day' },
    { id: '2', name: 'Tesla Model 3', price: '150/day' },
    { id: '3', name: 'BMW X5', price: '130/day' },
];

const CarListScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text>{item.name} - {item.price}</Text>
            <Button title="View Details" onPress={() => navigation.navigate('CarDetails', { car: item })} />
        </View>
    );

    return (
        <FlatList
            data={cars}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    item: {
        padding: 20,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
    },
});

export default CarListScreen;
