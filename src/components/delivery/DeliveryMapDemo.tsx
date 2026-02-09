import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DeliveryMapDemo: React.FC = () => {
  // Sample data - San Francisco Bay Area delivery route
  const pickupLocation: [number, number] = [37.7749, -122.4194]; // San Francisco
  const deliveryLocation: [number, number] = [37.3382, -121.8863]; // San Jose
  const currentLocation: [number, number] = [37.5585, -122.2710]; // Fremont (en route)

  // Sample route points showing delivery path
  const routePoints: [number, number][] = [
    pickupLocation,
    [37.7500, -122.3800],
    [37.7200, -122.3500],
    [37.6500, -122.3000],
    [37.5800, -122.2800],
    currentLocation,
    [37.4500, -122.1800],
    deliveryLocation,
  ];

  return (
    <Paper elevation={3} sx={{ height: '600px', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">
            Real-Time Delivery Tracking
          </Typography>
          <Chip 
            label="In Transit" 
            color="primary"
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            Driver: John Smith
          </Typography>
        </Stack>
      </Box>

      <MapContainer
        center={currentLocation}
        zoom={10}
        style={{ height: 'calc(100% - 80px)', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Line */}
        <Polyline
          positions={routePoints}
          color="blue"
          weight={3}
          opacity={0.7}
          dashArray="5, 10"
        />

        {/* Pickup Location */}
        <Marker position={pickupLocation} icon={pickupIcon}>
          <Popup>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Pickup Location
              </Typography>
              <Typography variant="caption">
                Restaurant: Pizza Palace<br />
                San Francisco, CA
              </Typography>
            </Box>
          </Popup>
        </Marker>

        {/* Delivery Location */}
        <Marker position={deliveryLocation} icon={deliveryIcon}>
          <Popup>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Delivery Location
              </Typography>
              <Typography variant="caption">
                Restaurant: Curry House<br />
                San Jose, CA
              </Typography>
            </Box>
          </Popup>
        </Marker>

        {/* Current Driver Location */}
        <Marker position={currentLocation} icon={driverIcon}>
          <Popup>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Current Driver Location
              </Typography>
              <Typography variant="caption">
                John Smith<br />
                Vehicle: Toyota Prius<br />
                ETA: 45 minutes
              </Typography>
            </Box>
          </Popup>
        </Marker>
      </MapContainer>
    </Paper>
  );
};

export default DeliveryMapDemo;
