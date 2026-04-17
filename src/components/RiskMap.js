'use client';
import { useEffect, useRef, useState } from 'react';

// Zone data with real coordinates
const ZONE_DATA = [
  // Bengaluru
  { city: 'Bengaluru', zone: 'Koramangala', lat: 12.9352, lng: 77.6245, risk: 0.71, workers: 287, status: 'high' },
  { city: 'Bengaluru', zone: 'Indiranagar', lat: 12.9784, lng: 77.6408, risk: 0.45, workers: 198, status: 'moderate' },
  { city: 'Bengaluru', zone: 'Whitefield', lat: 12.9698, lng: 77.7500, risk: 0.32, workers: 145, status: 'low' },
  { city: 'Bengaluru', zone: 'HSR Layout', lat: 12.9116, lng: 77.6389, risk: 0.58, workers: 210, status: 'moderate' },
  { city: 'Bengaluru', zone: 'Electronic City', lat: 12.8399, lng: 77.6770, risk: 0.25, workers: 120, status: 'low' },
  // Mumbai
  { city: 'Mumbai', zone: 'Andheri', lat: 19.1136, lng: 72.8697, risk: 0.92, workers: 342, status: 'critical' },
  { city: 'Mumbai', zone: 'Bandra', lat: 19.0596, lng: 72.8295, risk: 0.78, workers: 265, status: 'high' },
  { city: 'Mumbai', zone: 'Powai', lat: 19.1176, lng: 72.9060, risk: 0.55, workers: 178, status: 'moderate' },
  { city: 'Mumbai', zone: 'Dadar', lat: 19.0178, lng: 72.8478, risk: 0.67, workers: 230, status: 'high' },
  // Delhi
  { city: 'Delhi', zone: 'Connaught Place', lat: 28.6315, lng: 77.2167, risk: 0.45, workers: 198, status: 'moderate' },
  { city: 'Delhi', zone: 'Dwarka', lat: 28.5921, lng: 77.0460, risk: 0.68, workers: 156, status: 'high' },
  { city: 'Delhi', zone: 'Noida', lat: 28.5355, lng: 77.3910, risk: 0.52, workers: 189, status: 'moderate' },
  // Hyderabad
  { city: 'Hyderabad', zone: 'Madhapur', lat: 17.4484, lng: 78.3908, risk: 0.28, workers: 156, status: 'low' },
  { city: 'Hyderabad', zone: 'Gachibowli', lat: 17.4401, lng: 78.3489, risk: 0.22, workers: 134, status: 'low' },
  // Chennai
  { city: 'Chennai', zone: 'T. Nagar', lat: 13.0418, lng: 80.2341, risk: 0.61, workers: 223, status: 'high' },
  { city: 'Chennai', zone: 'Velachery', lat: 12.9815, lng: 80.2180, risk: 0.48, workers: 167, status: 'moderate' },
];

const CITY_CENTERS = {
  'All': { lat: 20.5937, lng: 78.9629, zoom: 5 },
  'Bengaluru': { lat: 12.9352, lng: 77.6245, zoom: 12 },
  'Mumbai': { lat: 19.0760, lng: 72.8777, zoom: 12 },
  'Delhi': { lat: 28.6139, lng: 77.2090, zoom: 11 },
  'Hyderabad': { lat: 17.4401, lng: 78.3489, zoom: 12 },
  'Chennai': { lat: 13.0418, lng: 80.2341, zoom: 12 },
};

function getRiskColor(risk) {
  if (risk >= 0.8) return '#ef4444';
  if (risk >= 0.6) return '#f59e0b';
  if (risk >= 0.4) return '#06b6d4';
  return '#10b981';
}

export default function RiskMap({ selectedCity = 'All', onZoneSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const L = require('leaflet');

    // Fix default icon paths
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current && mapRef.current) {
      const center = CITY_CENTERS['All'];
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: center.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark themed tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Filter zones
    const zones = selectedCity === 'All' 
      ? ZONE_DATA 
      : ZONE_DATA.filter(z => z.city === selectedCity);

    // Add zone circles
    zones.forEach(zone => {
      const color = getRiskColor(zone.risk);
      const radius = Math.max(zone.workers * 3, 400);

      // Pulsing risk circle
      const circle = L.circle([zone.lat, zone.lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 2,
        opacity: 0.6,
      }).addTo(mapInstanceRef.current);

      // Inner dot
      const dot = L.circleMarker([zone.lat, zone.lng], {
        radius: 6,
        color: color,
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(mapInstanceRef.current);

      // Popup
      const popupContent = `
        <div style="font-family: Inter, sans-serif; color: #f1f5f9; min-width: 200px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${zone.zone}, ${zone.city}</div>
          <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px;">
            <span style="color: #94a3b8;">Risk Score</span>
            <span style="color: ${color}; font-weight: 700;">${Math.round(zone.risk * 100)}%</span>
          </div>
          <div style="height: 4px; background: #1e1e2a; border-radius: 4px; margin: 4px 0 8px;">
            <div style="height: 100%; width: ${zone.risk * 100}%; background: ${color}; border-radius: 4px;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span style="color: #94a3b8;">Active Workers</span>
            <span style="font-weight: 600;">${zone.workers}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 4px;">
            <span style="color: #94a3b8;">Status</span>
            <span style="color: ${color}; font-weight: 600; text-transform: uppercase;">${zone.status}</span>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, {
        className: 'risk-map-popup',
        closeButton: false,
      });

      dot.bindPopup(popupContent, {
        className: 'risk-map-popup',
        closeButton: false,
      });

      circle.on('click', () => onZoneSelect?.(zone));
      dot.on('click', () => onZoneSelect?.(zone));

      markersRef.current.push(circle, dot);
    });

    // Pan to city
    const center = CITY_CENTERS[selectedCity] || CITY_CENTERS['All'];
    mapInstanceRef.current.setView([center.lat, center.lng], center.zoom, { animate: true, duration: 1 });

  }, [mounted, selectedCity]);

  if (!mounted) {
    return <div className="skeleton" style={{ width: '100%', height: '100%', minHeight: '500px' }}></div>;
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <style>{`
        .risk-map-popup .leaflet-popup-content-wrapper {
          background: #16161f !important;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
        }
        .risk-map-popup .leaflet-popup-tip {
          background: #16161f !important;
          border: 1px solid rgba(148, 163, 184, 0.12);
        }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '500px', borderRadius: 'var(--radius-lg)' }} />
    </>
  );
}
