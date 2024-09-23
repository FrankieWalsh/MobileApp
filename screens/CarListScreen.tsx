import React, { useState, useEffect } from 'react';
import { Image, View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { getCars } from '../apiService';
const imageMap = {
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

const { width } = Dimensions.get('window');

const getImage = (imageName) => {
    return imageMap[imageName];
};

const CarListScreen = ({ navigation }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars();
                setCars(data);
            } catch (err) {
                setError('Error fetching car list.');
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('CarDetails', { carId: item._id })}
        >
            <View style={styles.card}>
                <Image
                    source={getImage(item.image)}
                    style={styles.carImage}
                    resizeMode="contain"
                />
                <View style={styles.carInfo}>
                    <Text style={styles.model}>{item.model}</Text>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.price}>${item.price} per day</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={cars}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        width: (width / 2) - 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    carImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    carInfo: {
        alignItems: 'center',
    },
    model: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    brand: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E90FF',
    },
});

export default CarListScreen;