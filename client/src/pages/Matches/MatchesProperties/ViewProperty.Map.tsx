import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '240px'
};

interface MapProps {
  address: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}
export const Map = React.memo(({ address, zoom }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCQxF8nCU-lhv4Wn6THabdieN_m1EAk9tQ'
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    // @ts-ignore
    const bounds = new window.google.maps.LatLngBounds(address);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={address}
      zoom={zoom || 8}
      onLoad={onLoad}
      onUnmount={onUnmount}>
      {/* Child components, such as markers, info windows, etc. */}
      <Marker position={address} title='Description' draggable={false} />
    </GoogleMap>
  ) : (
    <></>
  );
});
