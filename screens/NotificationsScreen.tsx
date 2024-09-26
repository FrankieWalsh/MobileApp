import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getNotifications, markNotificationAsRead } from '../apiService';  // Assuming this is the API file
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen: React.FC = ({ navigation }: any) => {
    const [notifications, setNotifications] = useState([]);
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    //const navigation = useNavigation();

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
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#f4f4f9',
    },
    listContainer: {
        marginTop: 110,
        flexGrow: 1,
        paddingBottom: 80, // Space for the home button
    },
    notificationItem: {
        padding: 20,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    unread: {
        backgroundColor: '#f9f9f9',
    },
    read: {
        backgroundColor: '#e0e0e0',
    },
    message: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e8e8e8',
        borderRadius: 5,
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
        borderRadius: 20,
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NotificationsScreen;