import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import { getNotifications } from '../apiService'; // Use the refactored API call
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({ title }) => {
    const navigation = useNavigation();
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                console.log("No user ID found in AsyncStorage");
                return;
            }

            const notifications = await getNotifications(userId); // Fetch notifications using the userId
            const unread = notifications.some(notif => !notif.isRead);
            setHasUnreadNotifications(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Refetch notifications every time the Header comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchNotifications();  // Fetch notifications when the screen is focused
        }, [])
    );

    return (
        <View style={styles.headerContainer}>
            <View style={styles.leftButtons}>
            <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation.navigate('Home')}>
                <Image source={require('../assets/LogoBilway_White.png')} style={styles.logo} />
            </TouchableOpacity>
            </View>

            <View style={styles.rightButtons}>
                <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation.navigate('Support')}>
                    <Ionicons name="help-circle-outline" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation.navigate('Notifications')}>
                    <View style={styles.notificationContainer}>
                        <Ionicons name="notifications-outline" size={30} color="#fff" />
                        {hasUnreadNotifications && <View style={styles.redDot} />}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation.navigate('User')}>
                    <Ionicons name="person-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100',
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
    },
});

export default Header;