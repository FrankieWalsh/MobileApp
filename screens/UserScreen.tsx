import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Header from "../header/header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';  // Para conectar con tu API backend

const UserScreen = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [preferences, setPreferences] = useState({});
    const [paymentDetails, setPaymentDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Función para obtener los datos del usuario
    const fetchUserData = async () => {
        try {
            // Recuperar nombre de usuario desde AsyncStorage
            const name = await AsyncStorage.getItem('userName');
            setUserName(name || 'User');

            // no se recuperan correctamente
            // Recuperar correo electrónico desde AsyncStorage
            const userEmail = await AsyncStorage.getItem('userEmail');
            setEmail(userEmail || 'user@example.com');

            // Recuperar preferencias y detalles de pago (si se almacenan en el backend o en AsyncStorage)
            const storedPreferences = await AsyncStorage.getItem('userPreferences');
            setPreferences(storedPreferences ? JSON.parse(storedPreferences) : {});

            const storedPaymentDetails = await AsyncStorage.getItem('userPaymentDetails');
            setPaymentDetails(storedPaymentDetails ? JSON.parse(storedPaymentDetails) : {});
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data.');
        } finally {
            setLoading(false);  // Finalizar la carga
        }
    };

    // Llamar a fetchUserData cuando se monte el componente
    useEffect(() => {
        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        try {
            // Aquí puedes realizar la actualización de los datos del usuario
            // Almacenar los datos en AsyncStorage después de editar
            await AsyncStorage.setItem('userName', userName);
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
            await AsyncStorage.setItem('userPaymentDetails', JSON.stringify(paymentDetails));

            Alert.alert('Success', 'User information updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user data:', error);
            Alert.alert('Error', 'Failed to update user information.');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();  // Limpiar AsyncStorage al cerrar sesión
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            // Aquí podrías redirigir a la pantalla de inicio de sesión
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Pantalla de carga mientras se recupera la información del usuario
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
            {/* Contenido principal */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>User Profile</Text>

                {/* Información del usuario */}
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

                    <Text style={styles.label}>Preferences:</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={JSON.stringify(preferences)}
                            onChangeText={(text) => setPreferences(JSON.parse(text))}
                            placeholder="Enter your preferences"
                        />
                    ) : (
                        <Text style={styles.text}>{JSON.stringify(preferences) || 'No preferences set.'}</Text>
                    )}

                    <Text style={styles.label}>Payment Details:</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={JSON.stringify(paymentDetails)}
                            onChangeText={(text) => setPaymentDetails(JSON.parse(text))}
                            placeholder="Enter your payment details"
                        />
                    ) : (
                        <Text style={styles.text}>{JSON.stringify(paymentDetails) || 'No payment details set.'}</Text>
                    )}
                </View>

                {/* Botones de acción */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    headerSpace: {
        marginTop: 75,
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
});

export default UserScreen;
