import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotifications } from '../apiService';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ title }) => {
    const navigation = useNavigation();
    const route = useRoute();  // Get the current route
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                console.log("No user ID found in AsyncStorage");
                return;
            }

            const notifications = await getNotifications(userId);
            const unread = notifications.some(notif => !notif.isRead);
            setHasUnreadNotifications(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    // Function to dynamically determine styles based on the current screen
    const getIconStyle = (screenName) => {
        return route.name === screenName
            ? styles.activeIconBackground  // Active screen style
            : styles.inactiveIconBackground;  // Inactive screen style
    };

    return (
        <View style={styles.headerContainer}>
            {/* Left Logo Button */}
            <View style={styles.leftButtons}>
                <TouchableOpacity
                    style={styles.topBarIcon}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
                >
                    <Image source={require('../assets/LogoBilway_White.png')} style={styles.logo} />
                </TouchableOpacity>
            </View>

            {/* Right Navigation Icons */}
            <View style={styles.rightButtons}>
                {/* Support Icon */}
                <TouchableOpacity
                    style={[styles.topBarIcon, getIconStyle('Support')]}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Support' }] })}
                >
                    <Ionicons name="help-circle-outline" size={30} color={route.name === 'Support' ? "#a5bae0" : "#fff"} />
                </TouchableOpacity>

                {/* Notifications Icon */}
                <TouchableOpacity
                    style={[styles.topBarIcon, getIconStyle('Notifications')]}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Notifications' }] })}
                >
                    <View style={styles.notificationContainer}>
                        <Ionicons name="notifications-outline" size={30} color={route.name === 'Notifications' ? "#a5bae0" : "#fff"} />
                        {hasUnreadNotifications && <View style={styles.redDot} />}
                    </View>
                </TouchableOpacity>

                {/* User Profile Icon */}
                <TouchableOpacity
                    style={[styles.topBarIcon, getIconStyle('User')]}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'User' }] })}
                >
                    <Ionicons name="person-outline" size={30} color={route.name === 'User' ? "#a5bae0" : "#fff"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
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
        paddingHorizontal: 20,
        paddingVertical: 28,
        backgroundColor: '#1C146B',
        marginBottom: 60,
    },
    logo: {
        marginLeft: 10,
        marginTop: 30,
        width: 120,
        height: 50,
        resizeMode: 'contain',
    },
    leftButtons: {
        top: 10,
        right: 28,
    },
    rightButtons: {
        top: 28,
        flexDirection: 'row',
    },
    notificationContainer: {
        position: 'relative',
    },
    redDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    topBarIcon: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,  // Add some border-radius for visual effect
    },
    activeIconBackground: {
        color: '#ececff',  // Change background for active state
    },
    inactiveIconBackground: {
        backgroundColor: 'transparent',  // No background for inactive state
    },
});

export default Header;
