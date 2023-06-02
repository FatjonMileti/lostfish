import React from 'react';
// @ts-ignore
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

export const CreatePropertyMap = React.memo((props: any) => {
  const {
    mapDetails: { geometry },
    setValue
  } = props;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCQxF8nCU-lhv4Wn6THabdieN_m1EAk9tQ'
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    // @ts-ignore
    const bounds = new window.google.maps.LatLngBounds(geometry.location);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleDragEnd = (data: any) => {
    const latitude = data.latLng.lat();
    const longitude = data.latLng.lng();
    setValue('asset_address.latitude', latitude);
    setValue('asset_address.longitude', longitude);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={geometry.location}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}>
      {/* Child components, such as markers, info windows, etc. */}
      <Marker position={geometry.location} title='Description' draggable={true} onDragEnd={handleDragEnd} />
    </GoogleMap>
  ) : (
    <></>
  );
});
