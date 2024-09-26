import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>User Profile will be here!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
});

export default UserScreen;
