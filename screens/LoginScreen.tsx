import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, {useEffect } from 'react';

const LoginScreen = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // Disable header
        });
    }, [navigation]);
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Email" 
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C146B', 
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF', 
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#5e68c4', 
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpButton: {
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 1,
    },
    signUpText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default LoginScreen;
