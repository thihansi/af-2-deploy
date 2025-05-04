import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const CountryMap = ({ country }) => {
  if (!country || !country.latlng) {
    return <div>No map data available</div>;
  }

  const position = [country.latlng[0], country.latlng[1]];

  return (
    <MapContainer center={position} zoom={6} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          {country.name.common}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default CountryMap;