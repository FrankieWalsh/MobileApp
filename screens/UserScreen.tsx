import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Header from "../header/header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserDetails } from '../apiService';  // Ensure updateUserDetails is correctly imported
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const UserScreen = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const navigation = useNavigation();  // Get the navigation object

    // Fetch user data from AsyncStorage
    const fetchUserData = async () => {
        try {
            const name = await AsyncStorage.getItem('userName');
            setUserName(name || 'User');

            const userEmail = await AsyncStorage.getItem('userEmail');
            setEmail(userEmail || 'user@example.com');
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');

            // Verify if userId exists
            if (!userId) {
                Alert.alert('Error', 'User ID not found in local storage.');
                return;
            }

            const updatedData = { name: userName, email: email };
            const response = await updateUserDetails(userId, updatedData);  // Send request to backend

            // Check if the server responded with a success message
            if (response && response.status === 200) {
                // Update local AsyncStorage if backend update was successful
                await AsyncStorage.setItem('userName', userName);
                await AsyncStorage.setItem('userEmail', email);

                Alert.alert('Success', 'User information updated successfully!');
                setIsEditing(false);
            } else {
                console.error('Failed to update on server:', response);
                Alert.alert('Error', 'Failed to update user information on the server.');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            Alert.alert('Error', 'Failed to update user information.');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert('Logged Out', 'You have been logged out successfully.');

            // Reset navigation stack to remove the back option
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6836F5" />
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6836F5" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header />
            <View style={styles.headerSpace}></View>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>User Profile</Text>

                {/* User Information Section */}
                <View style={styles.userInfoSection}>
                    <Text style={styles.label}>Name:</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={userName}
                            onChangeText={setUserName}
                            placeholder="Enter your name"
                        />
                    ) : (
                        <Text style={styles.text}>{userName}</Text>
                    )}

                    <Text style={styles.label}>Email:</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                    ) : (
                        <Text style={styles.text}>{email}</Text>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    {isEditing ? (
                        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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
        marginTop: 125,
    },
    contentContainer: {
        padding: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6836F5',
        textAlign: 'center',
        marginVertical: 20,
    },
    userInfoSection: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#6836F5',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    logoutButton: {
        backgroundColor: '#F53636',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
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

export default UserScreen;
