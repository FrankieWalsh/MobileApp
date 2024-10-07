import React, { useState, useEffect } from 'react';
import { Image, View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { getCars } from '../apiService';
import FilterComponent from '../FilterComponent';
import { getImage } from '../utils/imageMap';
import Header from "../header/header";
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const { width } = Dimensions.get('window');

const CarListScreen: React.FC = ({ navigation }: any) => {
    const [cars, setCars] = useState<any[]>([]);
    const [filteredCars, setFilteredCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(250);
    const [minSeats, setMinSeats] = useState(2);
    const [maxSeats, setMaxSeats] = useState(8);
    const [transmissionType, setTransmissionType] = useState('All');

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars();
                applyFilters();
                setCars(data);
                setFilteredCars(data);
            } catch (err) {
                setError('Error fetching car list.');
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const applyFilters = () => {
        const filtered = cars.filter(car => {
            return (
                car.availability &&
                car.price >= minPrice &&
                car.price <= maxPrice &&
                car.number_of_seats >= minSeats &&
                car.number_of_seats <= maxSeats &&
                (transmissionType === 'All' || car.type === transmissionType)
            );
        });

        setFilteredCars(filtered);
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('CarDetails', { carId: item._id })}>
            <View style={styles.card}>
                <Image
                    source={getImage(item.image)}
                    style={styles.carImage}
                    resizeMode="contain"
                />
                <View style={styles.carInfo}>
                    <Text style={styles.model}>{item.model}</Text>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <View style={styles.pricetag}>
                        <Text style={styles.price}>${item.price}</Text>
                        <Text style={styles.pricePerDay}> /day</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header/>
            <View style={styles.headerSpace}></View>
            <FilterComponent
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minSeats={minSeats}
                setMinSeats={setMinSeats}
                maxSeats={maxSeats}
                setMaxSeats={setMaxSeats}
                transmissionType={transmissionType}
                setTransmissionType={setTransmissionType}
                applyFilters={applyFilters}
            />

            <FlatList
                data={filteredCars}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
            />
                        {/* Add a Home button at the bottom */}
                        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.homeButtonText}>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F6F5FA',
        flex: 1,
    },
    listContainer: {
        marginTop: -10,
        padding: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    headerSpace: {
        marginTop: 35,
    },
    card: {
        margin: 7,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        width: (width / 2) - 23,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: -1, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111317',
        marginBottom: 4,
    },
    brand: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        color: '#2F3035',
        marginBottom: 8,
    },
    pricetag: {
        backgroundColor: '#6836F5',
        height: 30,
        padding: 7,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: "center",
    },
    price: {
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
        fontWeight: 'bold',
        color: '#F6F5FA',
    },
    pricePerDay: {
        fontFamily: "Montserrat-Medium",
        color: '#F6F5FA',
    },
    homeButton: {
        backgroundColor: '#6836F5',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginHorizontal: 20,
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    homeButtonText: {
        fontFamily: "Montserrat-Bold",
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CarListScreen;