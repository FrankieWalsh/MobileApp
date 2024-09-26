import React, { useState, useEffect } from 'react';
//import { View, Text, Button, StyleSheet } from 'react-native';
import { Image, View, Button, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { getCars } from '../apiService';
import FilterComponent from '../components/FilterComponent';
import Icon from 'react-native-vector-icons/Ionicons'; // Example: using Ionicons

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

const getImage = (imageName: string) => {
    return imageMap[imageName];
};


const HomeScreen: React.FC = ({ navigation }: any) => {
    
    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // Disable header
        });
    }, [navigation]);

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
                car.availability = true &&
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
                        <Text style={styles.pricePerDay}> per day</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
    return (
        <SafeAreaView>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Image
                    source={require('../assets/LogoBilway_White.png')} // Change to png logo
                    style={styles.logo}
                />

                {/* Put Icons instead of text */}
                <View style={styles.rightButtons}>
                    <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation.navigate('Support')}>
                        <Icon name="help-circle-outline" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation.navigate('Notifications')}>
                        <Icon name="notifications-outline" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation.navigate('User')}>
                        <Icon name="person-outline" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
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
            </View>
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F6F5FA',
        //flex: 1,
        padding: 10,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: '#1C146B',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    logo: {
        width: width*0.24,
        height: width*0.12,
    },
    rightButtons: {
        flexDirection: 'row',
    },

    topBarButton: {
        backgroundColor: '#5e68c4',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    topBarIcon: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    topBarButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    listContainer: {
        marginTop: -10,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        margin: 7,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        width: (width / 2) - 23,
        alignItems: 'center',
        shadowRadius: 4,
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
        color: '#111317',
        marginBottom: 4,
    },
    brand: {
        fontSize: 14,
        color: '#2F3035',
        marginBottom: 8,
    },
    pricetag: {
        backgroundColor: '#5e68c4',
        height: 35,
        padding: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: "center",
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#F6F5FA',
    },
    pricePerDay: {
        color: '#F6F5FA',
    },
});

export default HomeScreen;
