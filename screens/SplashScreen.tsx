import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const SplashScreen = ({ navigation }) => {

    useEffect(() => {
        // Simulate loading or waiting for resources
        const timer = setTimeout(() => {
            navigation.replace('Login');  // Navigate to Home screen after 3 seconds
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Full-Screen GIF */}
            <Image
                source={require('../assets/car2.gif')}  // Add your GIF in the assets folder
                style={styles.gif}
                resizeMode="cover"  // This will cover the entire screen
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gif: {
        width: width,   // Full screen width
        height: height, // Full screen height
    },
});

export default SplashScreen;
