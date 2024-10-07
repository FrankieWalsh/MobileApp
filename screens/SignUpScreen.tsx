import React, { useState } from 'react';
import {View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity} from 'react-native';
import { signUpUser } from '../apiService'; // Import the signUpUser function
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    SignUp: undefined;
    Login: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp'>;

type Props = {
    navigation: SignUpScreenNavigationProp;
    route: SignUpScreenRouteProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await signUpUser(name, email, password);  // Use signUpUser function from apiService
            console.log(response)

            if (response.status === 201) {
                Alert.alert('Success', 'Account created successfully');
                navigation.replace('Login'); // Navigate back to Login after signup
                //await AsyncStorage.setItem('userEmail', email);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Unable to create account. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace('Login')}>
                <Text style={styles.loginText}>Already have an account? Login</Text>
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
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#5e68c4',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButton: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default SignUpScreen;
