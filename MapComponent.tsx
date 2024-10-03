import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapComponent = ({ cars }) => {
  // Check if car data is available
  const car = cars && cars[0];

  // Parse latitude and longitude from the car's location_id.coordinates
  const [initialLatitude, initialLongitude] = car && car.location_id && car.location_id.coordinates
      ? car.location_id.coordinates.split(',').map(Number)  // Parse coordinates
      : [55.6761, 12.5683];  // Default to Copenhagen if not available
  const mapRef = useRef(null);

  // Default camera view
  const initialRegion = {
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Add padding to push the pin up (move the map slightly down)
  const edgePadding = { top: 200, right: 0, bottom: 0, left: 0 };

  return (
      <View style={styles.mapContainer}>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            mapPadding={edgePadding}  // Add padding to move the marker higher on the screen
            rotateEnabled={false}
            scrollEnabled={false}
            zoomEnabled={true}
            zoomControlEnabled={true}
            minZoomLevel={5}
            maxZoomLevel={15}
        >
          {cars.map((car) => {
            // Parse latitude and longitude for each car
            const [latitude, longitude] = car.location_id.coordinates.split(',').map(Number);
            return (
                <Marker
                    key={car.id}
                    coordinate={{ latitude, longitude }}
                    title={car.model}
                    description={car.brand}
                    anchor={{ x: 0.5, y: 0.5 }} // Adjust this to move the pin itself if needed
                />
            );
          })}
        </MapView>
      </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: { flex: 1, width: '100%', height: '100%' },
  map: { ...StyleSheet.absoluteFillObject },
});

export default MapComponent;
