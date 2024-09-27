import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function CustomText({ text }) {
  return (
      <View style={styles.container}>
        <Text style={styles.customText}>{text}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    marginTop: 10,
  },
  customText: {
    fontSize: 18,
    color: '#00796b',
  },
});
