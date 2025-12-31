import { useEffect, useRef } from "react";
import type { BkoiMap, BkoiMarker, MapClickEvent } from "@/types/barikoi";

interface BarikoiMapWithRadiusProps {
  onLocationSelect: (coords: { lng: number; lat: number }, location: string, addressDetails?: {
    address?: string;
    thana?: string;
    district?: string;
  }) => void;
  apiKey: string;
  centerCoords: [number, number];
  radiusKm?: number;
  initialZoom?: number;
  height?: string;
}

const BARIKOI_STYLE_URL = "https://map.barikoi.com/styles/barikoi-light/style.json";
const BARIKOI_REVERSE_GEOCODE_URL = "https://barikoi.xyz/v2/api/search/reverse/geocode";

// Helper function to calculate distance between two points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to create circle coordinates
function createCircleCoordinates(center: [number, number], radiusKm: number, points: number = 64): number[][] {
  const coords: number[][] = [];
  const radiusInDegrees = radiusKm / 111.32; // Approximate conversion from km to degrees
  
  for (let i = 0; i <= points; i++) {
    const angle = (i * 360) / points;
    const x = center[0] + radiusInDegrees * Math.cos(angle * Math.PI / 180);
    const y = center[1] + radiusInDegrees * Math.sin(angle * Math.PI / 180);
    coords.push([x, y]);
  }
  
  return coords;
}

export default function BarikoiMapWithRadius({
  onLocationSelect,
  apiKey,
  centerCoords,
  radiusKm = 5,
  initialZoom = 13,
  height = "400px",
}: BarikoiMapWithRadiusProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<BkoiMap | null>(null);
  const markerRef = useRef<BkoiMarker | null>(null);
  const centerMarkerRef = useRef<BkoiMarker | null>(null);
  const onLocationSelectRef = useRef(onLocationSelect);

  // Keep callback ref updated without triggering re-renders
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    let mounted = true;

    const reverseGeocode = async (lng: number, lat: number): Promise<{
      location: string;
      addressDetails: { address?: string; thana?: string; district?: string };
    }> => {
      try {
        const response = await fetch(
          `${BARIKOI_REVERSE_GEOCODE_URL}?longitude=${lng}&latitude=${lat}&district=true&sub_district=true&thana=true&address=true&area=true&api_key=${apiKey}`
        );
        const data = await response.json();
        if (data.place) {
          const { address, area, city, district, sub_district, thana } = data.place;
          
          // Build full location string from available components
          const locationComponents = [address, area, city, district].filter(Boolean);
          const fullLocation = locationComponents.join(", ");
          
          const addressDetails = {
            address: address || fullLocation,
            thana: thana || sub_district || area,
            district: district || city
          };
          
          return {
            location: fullLocation,
            addressDetails
          };
        }
        return {
          location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          addressDetails: {}
        };
      } catch {
        return {
          location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          addressDetails: {}
        };
      }
    };

    const handleMarkerPlacement = async (lngLat: { lng: number; lat: number }) => {
      if (!mapRef.current || !mounted) return;

      // Check if the clicked location is within the radius
      const distance = calculateDistance(
        centerCoords[1], centerCoords[0], // center lat, lng
        lngLat.lat, lngLat.lng // clicked lat, lng
      );

      if (distance > radiusKm) {
        // Show error message or prevent placement
        alert(`Location is outside the ${radiusKm}km delivery radius. Please select a location within the red circle.`);
        return;
      }

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Create new draggable marker
      const marker = new window.bkoigl.Marker({ draggable: true, color: '#22c55e' })
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(mapRef.current);

      markerRef.current = marker;

      // Get location from reverse geocode
      const { location, addressDetails } = await reverseGeocode(lngLat.lng, lngLat.lat);
      if (mounted) {
        onLocationSelectRef.current({ lng: lngLat.lng, lat: lngLat.lat }, location, addressDetails);
      }

      // Handle marker drag end
      marker.on("dragend", async () => {
        if (!mounted) return;
        const newLngLat = marker.getLngLat();
        
        // Check if dragged location is within radius
        const newDistance = calculateDistance(
          centerCoords[1], centerCoords[0],
          newLngLat.lat, newLngLat.lng
        );

        if (newDistance > radiusKm) {
          // Snap back to previous position
          marker.setLngLat([lngLat.lng, lngLat.lat]);
          alert(`Location is outside the ${radiusKm}km delivery radius. Please select a location within the red circle.`);
          return;
        }

        const { location: newLocation, addressDetails: newAddressDetails } = await reverseGeocode(newLngLat.lng, newLngLat.lat);
        if (mounted) {
          onLocationSelectRef.current({ lng: newLngLat.lng, lat: newLngLat.lat }, newLocation, newAddressDetails);
        }
      });
    };

    const loadScripts = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="bkoi-gl"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/bkoi-gl@latest/dist/style/bkoi-gl.css";
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.bkoigl) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/bkoi-gl@latest/dist/iife/bkoi-gl.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    };

    const initMap = async () => {
      await loadScripts();

      if (!mapContainerRef.current || !mounted) return;

      const map = new window.bkoigl.Map({
        container: mapContainerRef.current,
        style: BARIKOI_STYLE_URL,
        center: centerCoords,
        zoom: initialZoom,
        accessToken: apiKey,
      });

      mapRef.current = map;

      map.on("load", () => {
        // Add radius circle as a polygon
        const circleCoords = createCircleCoordinates(centerCoords, radiusKm);
        
        map.addSource("radius-circle", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [circleCoords]
            }
          }
        });

        // Add circle fill layer
        map.addLayer({
          id: "radius-circle-fill",
          type: "fill",
          source: "radius-circle",
          paint: {
            "fill-color": "#ff0000",
            "fill-opacity": 0.1
          }
        });

        // Add circle border layer
        map.addLayer({
          id: "radius-circle-border",
          type: "line",
          source: "radius-circle",
          paint: {
            "line-color": "#ff0000",
            "line-width": 2,
            "line-opacity": 0.6
          }
        });

        // Add center marker for microhub
        const centerMarker = new window.bkoigl.Marker({ draggable: false, color: '#3b82f6' })
          .setLngLat(centerCoords)
          .addTo(map);
        
        centerMarkerRef.current = centerMarker;

        map.on("click", (e) => {
          if (e?.lngLat) {
            handleMarkerPlacement(e.lngLat);
          }
        });
      });
    };

    initMap();

    return () => {
      mounted = false;
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (centerMarkerRef.current) {
        centerMarkerRef.current.remove();
        centerMarkerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [apiKey, centerCoords, radiusKm, initialZoom]);

  return (
    <div className="relative rounded-lg overflow-hidden border">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
      <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
        Click within the {radiusKm}km radius to select delivery location
      </div>
      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
        🔵 Microhub | 🟢 Delivery Location | 🔴 {radiusKm}km Zone
      </div>
    </div>
  );
}