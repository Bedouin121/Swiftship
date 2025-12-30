import { useEffect, useRef, useCallback } from "react";

// Barikoi GL types
declare global {
  interface Window {
    bkoigl: {
      Map: new (options: {
        container: string | HTMLElement;
        style: string;
        center: [number, number];
        zoom: number;
        accessToken: string;
      }) => BkoiMap;
      Marker: new (options?: { draggable?: boolean }) => BkoiMarker;
    };
  }
}

interface BkoiMap {
  on: (event: string, callback: (e?: MapClickEvent) => void) => void;
  remove: () => void;
}

interface BkoiMarker {
  setLngLat: (lngLat: [number, number] | { lng: number; lat: number }) => BkoiMarker;
  addTo: (map: BkoiMap) => BkoiMarker;
  remove: () => void;
  on: (event: string, callback: () => void) => BkoiMarker;
  getLngLat: () => { lng: number; lat: number };
}

interface MapClickEvent {
  lngLat: { lng: number; lat: number };
}

interface BarikoiMapProps {
  onLocationSelect: (coords: { lng: number; lat: number }, location: string) => void;
  apiKey: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: string;
}

const BARIKOI_STYLE_URL = "https://map.barikoi.com/styles/barikoi-light/style.json";
const BARIKOI_REVERSE_GEOCODE_URL = "https://barikoi.xyz/v1/api/search/reverse/geocode";

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
  const scriptsLoadedRef = useRef(false);

  const reverseGeocode = useCallback(
    async (lng: number, lat: number): Promise<string> => {
      try {
        const response = await fetch(
          `${BARIKOI_REVERSE_GEOCODE_URL}?longitude=${lng}&latitude=${lat}&district=true&sub_district=true&api_key=${apiKey}`
        );
        const data = await response.json();
        if (data.place) {
          const { address, area, city, district } = data.place;
          return [address, area, city, district].filter(Boolean).join(", ");
        }
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      } catch {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    },
    [apiKey]
  );

  const handleMarkerPlacement = useCallback(
    async (lngLat: { lng: number; lat: number }) => {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create new draggable marker
      const marker = new window.bkoigl.Marker({ draggable: true })
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(mapRef.current!);

      markerRef.current = marker;

      // Get location from reverse geocode
      const location = await reverseGeocode(lngLat.lng, lngLat.lat);
      onLocationSelect({ lng: lngLat.lng, lat: lngLat.lat }, location);

      // Handle marker drag end
      marker.on("dragend", async () => {
        const newLngLat = marker.getLngLat();
        const newLocation = await reverseGeocode(newLngLat.lng, newLngLat.lat);
        onLocationSelect({ lng: newLngLat.lng, lat: newLngLat.lat }, newLocation);
      });
    },
    [onLocationSelect, reverseGeocode]
  );

  useEffect(() => {
    const loadScripts = async () => {
      if (scriptsLoadedRef.current) return;

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

      scriptsLoadedRef.current = true;
    };

    const initMap = async () => {
      await loadScripts();

      if (!mapContainerRef.current || mapRef.current) return;

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
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [apiKey, initialCenter, initialZoom, handleMarkerPlacement]);

  return (
    <div className="relative rounded-lg overflow-hidden border">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
      <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
        Click on the map to pin location
      </div>
    </div>
  );
}
