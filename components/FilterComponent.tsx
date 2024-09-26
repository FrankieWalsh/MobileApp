import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { RangeSlider } from '@react-native-assets/slider'

interface FilterComponentProps {
    minPrice: number;
    setMinPrice: (value: number) => void;
    maxPrice: number;
    setMaxPrice: (value: number) => void;
    minSeats: number;
    setMinSeats: (value: number) => void;
    maxSeats: number;
    setMaxSeats: (value: number) => void;
    transmissionType: string;
    setTransmissionType: (value: string) => void;
    applyFilters: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minSeats,
    setMinSeats,
    maxSeats,
    setMaxSeats,
    transmissionType,
    setTransmissionType,
    applyFilters,
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const transmissionOptions = ['All', 'Automatic', 'Manual'];

    const resetFilters = () => {
        setMinPrice(0);
        setMaxPrice(250);
        setMinSeats(0);
        setMaxSeats(8);
        setTransmissionType('All');
    };

    useEffect(() => {
        setMinSeats(0); // Set minSeats to 0 on load
    }, []);

    // Apply filters when the state changes
    useEffect(() => {
        applyFilters();
    }, [minPrice, maxPrice, minSeats, maxSeats, transmissionType]);

    const handlePriceChange = ([min, max]: [number, number]) => {
        setMinPrice(min);
        setMaxPrice(max);
    };

    const handleSeatsChange = ([min, max]: [number, number]) => {
        setMinSeats(min);
        setMaxSeats(max);
    };

    const handleSelectTransmission = (itemValue: string) => {
        setTransmissionType(itemValue);
        setDropdownVisible(false); // Close dropdown
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}>

                <Text style={styles.filterButtonText}>
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Text>
            </TouchableOpacity>

            {showFilters && (
                <View style={styles.filterContainer}>

                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderLabel}>Price</Text>

                        <RangeSlider
                            range={[minPrice, maxPrice]}
                            minimumValue={0}
                            maximumValue={250}
                            step={1}
                            minimumRange={10}
                            crossingAllowed={false}
                            outboundColor='lightgrey'
                            inboundColor='#1c146b'
                            thumbTintColor='#5e68c4'
                            trackHeight={7}
                            thumbSize={25}
                            slideOnTap={true}
                            onValueChange={handlePriceChange}
                        />
                        <Text style={styles.sliderValueText}>
                            ${minPrice} - ${maxPrice}
                        </Text>
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderLabel}>Seats</Text>

                        <RangeSlider
                            range={[minSeats, maxSeats]}
                            minimumValue={0}
                            maximumValue={8}
                            step={1}
                            minimumRange={0}
                            crossingAllowed={false}
                            outboundColor='lightgrey'
                            inboundColor='#1c146b'
                            thumbTintColor='#5e68c4'
                            trackHeight={7}
                            thumbSize={25}
                            slideOnTap={true}
                            onValueChange={handleSeatsChange}
                        />
                        <Text style={styles.sliderValueText}>
                            {minSeats} - {maxSeats}
                        </Text>
                    </View>

                    <Text style={styles.typeLabel}>Type</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setDropdownVisible(!dropdownVisible)}>
                        <Text style={styles.dropdownText}>{transmissionType}</Text>
                    </TouchableOpacity>

                    {dropdownVisible && (
                        <View style={styles.dropdown}>
                            <FlatList
                                data={transmissionOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => handleSelectTransmission(item)}>
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetFilters}>
                        <Text style={styles.resetButtonText}>Reset Filters</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    filterButton: {
        backgroundColor: '#5e68c4',
        padding: 10,
        marginHorizontal: -3,
        borderRadius: 5,
        //marginTop: 10,
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    filterContainer: {
        marginHorizontal: -4,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
    },
    sliderContainer: {
        height: 75,
        margin: 10,
        zIndex: 1,
    },
    typeLabel: {
        paddingLeft: 13,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    sliderLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    sliderValueText: {
        fontSize: 14,
        color: '#2F3035',
        textAlign: 'center',
        marginTop: 5,
    },
    pickerWrapper: {
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    picker: {
        height: 'auto',
        width: '100%',
    },
    dropdownButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#380096',
        marginBottom: 10,
    },
    dropdownText: {
        fontSize: 16,
        color: '#2F3035',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#380096',
        borderWidth: 1,
        paddingVertical: 10,
        marginBottom: 10,
        height: 120,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resetButton: {
        padding: -10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    resetButtonText: {
        color: 'black',
    },
});

export default FilterComponent;