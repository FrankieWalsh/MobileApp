import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getNotifications, markNotificationAsRead } from '../apiService';  // Assuming this is the API file
import { useNavigation } from '@react-navigation/native';
import Header from "../header/header";

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchNotifications = async () => {
            const fetchedNotifications = await getNotifications();
            setNotifications(fetchedNotifications);
        };

        fetchNotifications();
    }, []);

    const toggleNotificationDetails = async (notificationId) => {
        // Toggle the expanded state of the notification
        if (expandedNotificationId === notificationId) {
            setExpandedNotificationId(null); // Collapse if already expanded
        } else {
            setExpandedNotificationId(notificationId); // Expand the clicked notification

            // Mark the notification as read if it's not already
            const notification = notifications.find(notif => notif._id === notificationId);
            if (notification && !notification.isRead) {
                try {
                    await markNotificationAsRead(notificationId);
                    setNotifications((prevNotifications) =>
                        prevNotifications.map((notif) =>
                            notif._id === notificationId ? { ...notif, isRead: true } : notif
                        )
                    );
                } catch (error) {
                    console.error('Error marking notification as read:', error);
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <Header></Header>
            <View style={styles.headerSpace}></View>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleNotificationDetails(item._id)}>
                        <View style={[styles.notificationItem, item.isRead ? styles.read : styles.unread]}>
                            {/* Notification Message */}
                            <Text style={styles.message}>{item.message}</Text>

                            {/* If the notification is expanded, show the details */}
                            {expandedNotificationId === item._id && (
                                <View style={styles.detailsContainer}>
                                    <Text style={styles.details}>Details: {item.details}</Text>
                                    {/*<Text style={styles.details}>Sent: {new Date(item.timestamp).toLocaleString()}</Text>*/}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
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
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    headerSpace: {
        marginTop: 55,
    },
    listContainer: {
        paddingTop: 110,  // Espacio para el header
        paddingHorizontal: 20,
        flexGrow: 1,
        paddingBottom: 100, // Espacio para el botón de inicio
    },
    notificationItem: {
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    unread: {
        backgroundColor: '#ffffff',
        borderColor: '#6836F5',
        borderWidth: 1,
    },
    read: {
        backgroundColor: '#ececff',
        borderColor: '#c2c2f0',
        borderWidth: 1,
    },
    message: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    detailsContainer: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#e2e2ff',
        borderRadius: 8,
    },
    details: {
        fontSize: 14,
        color: '#555',
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
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NotificationsScreen;
