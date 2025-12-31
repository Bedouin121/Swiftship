import { useEffect, useRef } from "react";
import type { BkoiMap, BkoiMarker, MapClickEvent } from "@/types/barikoi";

interface BarikoiMapProps {
  onLocationSelect: (coords: { lng: number; lat: number }, location: string, addressDetails?: {
    address?: string;
    thana?: string;
    district?: string;
  }) => void;
  apiKey: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: string;
}

const BARIKOI_STYLE_URL = "https://map.barikoi.com/styles/barikoi-light/style.json";
const BARIKOI_REVERSE_GEOCODE_URL = "https://barikoi.xyz/v2/api/search/reverse/geocode";

export default function BarikoiMap({
  onLocationSelect,
  apiKey,
  initialCenter = [90.4125, 23.8103], // Dhaka center
  initialZoom = 12,
  height = "300px",
}: BarikoiMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<BkoiMap | null>(null);
  const markerRef = useRef<BkoiMarker | null>(null);
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
        console.log('Making Barikoi API call with:', { lng, lat, apiKey: apiKey ? 'present' : 'missing' });
        const response = await fetch(
          `${BARIKOI_REVERSE_GEOCODE_URL}?longitude=${lng}&latitude=${lat}&district=true&sub_district=true&thana=true&address=true&area=true&api_key=${apiKey}`
        );
        const data = await response.json();
        console.log('Barikoi API response:', data);
        
        if (data.place) {
          const { address, area, city, district, sub_district, thana } = data.place;
          console.log('Extracted place data:', { address, area, city, district, sub_district, thana });
          
          // Build full location string from available components
          const locationComponents = [address, area, city, district].filter(Boolean);
          const fullLocation = locationComponents.join(", ");
          
          const addressDetails = {
            address: address || fullLocation,
            thana: thana || sub_district || area,
            district: district || city
          };
          
          console.log('Processed address details:', { fullLocation, addressDetails });
          
          return {
            location: fullLocation,
            addressDetails
          };
        }
        
        console.log('No place data found, using coordinates');
        return {
          location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          addressDetails: {}
        };
      } catch (error) {
        console.error('Barikoi API error:', error);
        return {
          location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          addressDetails: {}
        };
      }
    };

    const handleMarkerPlacement = async (lngLat: { lng: number; lat: number }) => {
      if (!mapRef.current || !mounted) return;

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Create new draggable marker
      const marker = new window.bkoigl.Marker({ draggable: true })
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
        center: initialCenter,
        zoom: initialZoom,
        accessToken: apiKey,
      });

      mapRef.current = map;

      map.on("load", () => {
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [apiKey, initialCenter, initialZoom]);

  return (
    <div className="relative rounded-lg overflow-hidden border">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
      <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
        Click on the map to pin location
      </div>
    </div>
  );
}
