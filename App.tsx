import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Component from "./MyComponent";
import CustomText from './CustomText';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello :)</Text>
      <Component />
        <CustomText text="This is a custom message passed as a prop!" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
