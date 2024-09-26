// MapComponent.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapComponent = ({ cars }) => {
  const defaultRegion = {
    latitude: 55.39946676609737,
    longitude: 10.397733841355198,
    latitudeDelta: 1, // Zoom level, adjust if needed
    longitudeDelta: 0,
  };

  return (
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={defaultRegion} mapType="standard">
          {cars.map((car) => (
              <Marker
                  key={car.id}
                  coordinate={{ latitude: car.latitude, longitude: car.longitude }}
                  title={car.model}
                  description={car.brand}
              />
          ))}
        </MapView>
      </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
