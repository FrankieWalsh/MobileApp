import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer}>
            {/* Logo on the left */}
            <Image source={require('../assets/bilway.png')} style={styles.logo} />

            {/* Notification Bell Icon */}
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Ionicons name="notifications-outline" size={24} color="black" style={styles.bellIcon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100',
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    logo: {
        marginLeft: 10,
        marginTop: 30,
        width: 120,  // Adjust the width of the logo
        height: 50,  // Adjust the height of the logo
        resizeMode: 'contain', // Ensure the logo scales correctly
    },
    bellIcon: {
        marginRight: 20,
        marginTop: 20,
    },
});

export default Header;
