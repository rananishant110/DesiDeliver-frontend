import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Room as LocationIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { DeliveryTracking, DeliveryRoute } from '../../types';
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

interface MapUpdaterProps {
  center: [number, number];
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

interface DeliveryMapProps {
  tracking: DeliveryTracking;
  autoCenter?: boolean;
  height?: string;
  showRoute?: boolean;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  tracking,
  autoCenter = true,
  height = '500px',
  showRoute = true
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    tracking.current_latitude || tracking.pickup_latitude,
    tracking.current_longitude || tracking.pickup_longitude
  ]);

  useEffect(() => {
    if (autoCenter && tracking.current_latitude && tracking.current_longitude) {
      setMapCenter([tracking.current_latitude, tracking.current_longitude]);
    }
  }, [tracking.current_latitude, tracking.current_longitude, autoCenter]);

  // Prepare route coordinates
  const routeCoordinates: [number, number][] = showRoute && tracking.route_points
    ? tracking.route_points.map(point => [point.latitude, point.longitude])
    : [];

  // Calculate bounds to fit all markers
  const bounds: L.LatLngBoundsExpression = [
    [tracking.pickup_latitude, tracking.pickup_longitude],
    [tracking.delivery_latitude, tracking.delivery_longitude],
  ];

  if (tracking.current_latitude && tracking.current_longitude) {
    bounds.push([tracking.current_latitude, tracking.current_longitude]);
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      assigned: 'default',
      picked_up: 'info',
      in_transit: 'primary',
      nearby: 'warning',
      delivered: 'success',
      failed: 'error',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Paper elevation={3} sx={{ height, overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">
            Order {tracking.order.order_number}
          </Typography>
          <Chip 
            label={formatStatus(tracking.status)} 
            color={getStatusColor(tracking.status) as any}
            size="small"
          />
          {tracking.driver && (
            <Typography variant="body2" color="text.secondary">
              Driver: {tracking.driver.user.first_name} {tracking.driver.user.last_name}
            </Typography>
          )}
        </Stack>
      </Box>
      
      <MapContainer
        bounds={bounds}
        style={{ height: `calc(${height} - 80px)`, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={mapCenter} />
        
        {/* Pickup Location Marker */}
        <Marker 
          position={[tracking.pickup_latitude, tracking.pickup_longitude]}
          icon={pickupIcon}
        >
          <Popup>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                <LocationIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Pickup Location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Warehouse/Store
              </Typography>
            </Box>
          </Popup>
        </Marker>
        
        {/* Delivery Destination Marker */}
        <Marker 
          position={[tracking.delivery_latitude, tracking.delivery_longitude]}
          icon={deliveryIcon}
        >
          <Popup>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                <FlagIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Delivery Destination
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tracking.order.delivery_address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tracking.order.business_name}
              </Typography>
            </Box>
          </Popup>
        </Marker>
        
        {/* Current Driver Location Marker */}
        {tracking.current_latitude && tracking.current_longitude && (
          <Marker 
            position={[tracking.current_latitude, tracking.current_longitude]}
            icon={driverIcon}
          >
            <Popup>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  <TruckIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Current Location
                </Typography>
                {tracking.driver && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Driver: {tracking.driver.user.first_name} {tracking.driver.user.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vehicle: {tracking.driver.vehicle_type}
                    </Typography>
                  </>
                )}
              </Box>
            </Popup>
          </Marker>
        )}
        
        {/* Route Polyline */}
        {showRoute && routeCoordinates.length > 1 && (
          <Polyline 
            positions={routeCoordinates}
            color="blue"
            weight={3}
            opacity={0.6}
          />
        )}
      </MapContainer>
    </Paper>
  );
};

export default DeliveryMap;
