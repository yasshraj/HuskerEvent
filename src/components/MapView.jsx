// ./components/MapView.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function MapView({ events = [], apiKey }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  const loadGoogleMapsScript = (callback) => {
    const existingScript = document.getElementById('googleMapsScript');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&callback=initMap`;
      script.id = 'googleMapsScript';
      script.async = true;
      script.defer = true;
      window.initMap = () => callback();
      document.head.appendChild(script);
    } else {
      callback();
    }
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const { Map } = window.google.maps;
    const { AdvancedMarkerElement } = window.google.maps.marker;

    const mapInstance = new Map(mapRef.current, {
      mapId: "EVENT_MAP_ID",
      center: events[0]?.coords || { lat: 40.8194, lng: -96.7026 },
      zoom: 16,
      disableDefaultUI: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
      ],
    });

    setMap(mapInstance);

    events.forEach(ev => {
      new AdvancedMarkerElement({
        map: mapInstance,
        position: ev.coords,
        title: ev.title,
      });
    });
  };

  useEffect(() => {
    loadGoogleMapsScript(initializeMap);
  }, [events]);

  return <div ref={mapRef} className="w-full h-full" />;
}