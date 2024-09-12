import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Component() {
  return (
      <View style={styles.container}>
        <Text style={styles.Text}>Hello from the component!</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  Text: {
    fontSize: 18,
    color: '#333',
  },
});
