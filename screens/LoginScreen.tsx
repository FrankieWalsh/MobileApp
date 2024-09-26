import { View, Text, Image, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';
import { loginUser } from '../apiService';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';  // Using FontAwesome icons

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    SignUp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await loginUser(email, password);

            if (response.token) {
                await AsyncStorage.setItem('userId', response.userId);
                await AsyncStorage.setItem('userName', response.name);

                Alert.alert('Success', 'Login successful');
                navigation.navigate('Home');
            }
        } catch (error) {
            Alert.alert('Error', 'Invalid login credentials');
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // Disable header
        });
    }, [navigation]);
    
    return (
        <View style={styles.container}>
            <Image source={require('../assets/LogoBilway_White.png')} style={{ width: 300, height: 150, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={styles.title}>Welcome to BilWay</Text>
            <Text style={styles.subtitle}>Log in to your account</Text>

            <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#333" style={styles.icon} />
            <TextInput 
                style={styles.input} 
                placeholder="Email" 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#777"
            />
            </View>
            <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#333" style={styles.icon} />
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#777"
            />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        //paddingVertical: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF', 
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#eeeeee',
        textAlign: 'center',
        marginBottom: 60,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        //marginBottom: 20,
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
