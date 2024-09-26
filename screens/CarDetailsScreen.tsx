import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { getCarDetails } from '../apiService';
import MapComponent from '../components/MapComponent';

const { width } = Dimensions.get('window');

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

const getImage = (imageName: string) => {
    return imageMap[imageName];
};

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
        <SafeAreaView style={styles.container}>
            <View style={styles.mapBackground}>
                <MapComponent cars={[car]} />
            </View>

            <View style={styles.mainCard}>

                <View style={styles.headerContainer}>
                    <Text style={styles.modelName}>{car.model}</Text>
                    <View style={styles.brandContainer}>
                        <Text style={styles.brandName}>{car.brand}</Text>
                    </View>
                </View>

                {car.image && (
                    <Image
                        source={getImage(car.image)}
                        style={styles.carImage}
                        resizeMode="contain"
                    />
                )}

                <View style={styles.detailCard}>
                    <View style={styles.specificationsContainer}>
                        <View style={styles.specBox}>
                            <Text style={styles.specTitle}>{car.type}</Text>
                        </View>
                        <View style={styles.specBox}>
                        <Text style={styles.specTitle}>{car.number_of_seats} seats</Text>
                        </View>
                    </View>

                    <Text style={styles.specificationsHeader}>SPECIFICATIONS</Text>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.specificationsContainer}>
                        {car.specifications && Object.entries(car.specifications).map(([key, value]) => (
                            <View key={key} style={styles.specBox}>
                                <Text style={styles.specificationKey}>{`${key} `}</Text>
                                <Text style={styles.specificationValue}>{`${value}`}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.footerContainer}>
                        <View style={styles.footerPriceTag}>
                            <Text style={styles.footerPrice}>${car.price}</Text>
                            <Text style={styles.footerPricePerDay}> per day</Text>
                        </View>

                        <View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Booking', { carId: car.id })}
                                style={styles.footerButtonContainer}
                            >
                                <Text style={styles.footerButtonText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C146B',
        flex: 1,
    },
    mapBackground: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    mainCard: {
        flex: 1,
        backgroundColor: '#5e68c4',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '80%',
        overflow: 'hidden',
    },
    headerContainer: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    modelName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    brandContainer: {
        backgroundColor: '#1c146b',
        padding: 9,
        borderRadius: 25,
        marginTop: 5,
        alignSelf: 'flex-start',
        marginLeft: 7,
    },
    brandName: {
        fontSize: 16,
        color: '#F6F5FA',
        fontWeight: '600',
    },
    carImage: {
        width: 200,
        height: 120,
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    detailCard: {
        flex: 1,
        backgroundColor: '#F6F5FA',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 30,
        paddingTop: 40,
        paddingLeft: 20,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    specTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 4,
        textAlign: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    specificationsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#BFBFBE',
        marginTop: 40,
    },
    specificationsContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    specBox: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: 110,
        height: 80,
        justifyContent: 'flex-start',
        elevation: 3,
        margin: 5,
    },
    specificationKey: {
        fontSize: 14,
        color: '#888888',
    },
    specificationValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 4,
    },
    pricetagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingRight: 20,
    },
    pricetag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5e68c4',
        padding: 10,
        borderRadius: 20,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    pricePerDay: {
        color: '#FFFFFF',
        marginLeft: 5,
    },
    footerContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: width,
        minHeight: 90,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    footerPriceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    footerPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    footerPricePerDay: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 5,
    },
    footerButtonContainer: {
        backgroundColor: '#380096',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    footerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CarDetailsScreen;
