import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const notifications = [
    { id: '1', message: 'Your booking is confirmed!' },
    { id: '2', message: 'Your car is ready for pickup.' },
];

const NotificationsScreen = () => {
    return (
        <SafeAreaView>
        <FlatList
            data={notifications}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text>{item.message}</Text>
                </View>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.container}
        />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    item: {
        padding: 20,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
    },
});

export default NotificationsScreen;
