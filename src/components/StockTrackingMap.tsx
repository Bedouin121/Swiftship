import { useEffect, useRef, useState } from "react";
import type { Microhub } from "@/types/api";

interface StockTrackingMapProps {
  microhubs: Microhub[];
  apiKey: string;
  height?: string;
}

const BARIKOI_STYLE_URL = "https://map.barikoi.com/styles/barikoi-light/style.json";

export default function StockTrackingMap({
  microhubs,
  apiKey,
  height = "400px",
}: StockTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedHub, setSelectedHub] = useState<Microhub | null>(null);

  // Calculate gradient color from green (0%) to red (100%)
  const getGradientColor = (percentage: number) => {
    // Clamp percentage between 0 and 100
    const p = Math.max(0, Math.min(100, percentage));
    
    // Define color stops: green -> yellow -> red
    if (p <= 50) {
      // Green to Yellow (0-50%)
      const ratio = p / 50;
      const r = Math.round(34 + (245 - 34) * ratio);   // 34 -> 245
      const g = Math.round(197 + (158 - 197) * ratio); // 197 -> 158
      const b = Math.round(94 + (11 - 94) * ratio);    // 94 -> 11
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to Red (50-100%)
      const ratio = (p - 50) / 50;
      const r = Math.round(245 + (239 - 245) * ratio);  // 245 -> 239
      const g = Math.round(158 + (68 - 158) * ratio);   // 158 -> 68
      const b = Math.round(11 + (68 - 11) * ratio);     // 11 -> 68
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const getStatusText = (hub: Microhub) => {
    const utilization = (hub.utilized / hub.capacity) * 100;
    if (utilization < 60) return "In Stock";
    if (utilization < 85) return "Low Stock";
    return "Critical";
  };

  const createMarkerElement = (hub: Microhub) => {
    const utilization = Math.round((hub.utilized / hub.capacity) * 100);
    const color = getGradientColor(utilization);
    
    const el = document.createElement('div');
    el.className = 'stock-marker';
    el.style.cssText = `
      width: 40px;
      height: 50px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    `;
    
    // Create SVG marker pin
    el.innerHTML = `
      <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${hub._id}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Pin shape -->
        <path 
          d="M 20 0 C 11.716 0 5 6.716 5 15 C 5 23.284 20 45 20 45 C 20 45 35 23.284 35 15 C 35 6.716 28.284 0 20 0 Z" 
          fill="${color}" 
          stroke="white" 
          stroke-width="2"
          filter="url(#shadow-${hub._id})"
        />
        <!-- Inner circle for percentage text -->
        <circle cx="20" cy="15" r="10" fill="white" fill-opacity="0.9"/>
        <!-- Percentage text -->
        <text 
          x="20" 
          y="19" 
          text-anchor="middle" 
          font-size="9" 
          font-weight="bold" 
          fill="${color}"
        >${utilization}%</text>
      </svg>
    `;
    
    // Add hover effect
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.15)';
      el.style.zIndex = '1000';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.zIndex = 'auto';
    });
    
    return el;
  };

  useEffect(() => {
    let mounted = true;

    const loadScripts = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="bkoi-gl"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/bkoi-gl@latest/dist/style/bkoi-gl.css";
        document.head.appendChild(link);
      }

      // Load JS
      if (!(window as any).bkoigl) {
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

      // Default center to Dhaka
      let center: [number, number] = [90.4125, 23.8103];
      let zoom = 10;

      // If we have microhubs with coordinates, calculate center
      const hubsWithCoords = microhubs.filter(hub => hub.latitude && hub.longitude);
      
      if (hubsWithCoords.length > 0) {
        if (hubsWithCoords.length === 1) {
          center = [hubsWithCoords[0].longitude!, hubsWithCoords[0].latitude!];
          zoom = 14;
        } else {
          // Calculate center from all coordinates
          const avgLng = hubsWithCoords.reduce((sum, hub) => sum + hub.longitude!, 0) / hubsWithCoords.length;
          const avgLat = hubsWithCoords.reduce((sum, hub) => sum + hub.latitude!, 0) / hubsWithCoords.length;
          center = [avgLng, avgLat];
        }
      }

      const bkoigl = (window as any).bkoigl;
      const map = new bkoigl.Map({
        container: mapContainerRef.current,
        style: BARIKOI_STYLE_URL,
        center,
        zoom,
        accessToken: apiKey,
      });

      mapRef.current = map;

      map.on("load", () => {
        if (!mounted) return;

        // Clear existing markers
        markersRef.current.forEach(marker => {
          try {
            marker.remove();
          } catch (e) {
            // Ignore errors
          }
        });
        markersRef.current = [];

        // Add markers for microhubs with coordinates
        hubsWithCoords.forEach(hub => {
          if (hub.latitude && hub.longitude) {
            try {
              const marker = new bkoigl.Marker({ draggable: false })
                .setLngLat([hub.longitude, hub.latitude])
                .addTo(map);
              
              // Replace default marker with custom element
              const markerElement = marker.getElement();
              if (markerElement) {
                markerElement.innerHTML = '';
                const customElement = createMarkerElement(hub);
                markerElement.appendChild(customElement);
                
                // Add click handler to marker
                markerElement.addEventListener('click', (e) => {
                  e.stopPropagation();
                  setSelectedHub(hub);
                });
              }
              
              markersRef.current.push(marker);
            } catch (e) {
              console.log('Error adding marker for', hub.name);
            }
          }
        });

        // Try to fit bounds if we have multiple markers
        if (hubsWithCoords.length > 1) {
          try {
            const lngs = hubsWithCoords.map(hub => hub.longitude!);
            const lats = hubsWithCoords.map(hub => hub.latitude!);
            
            // Simple bounds calculation
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            
            // Add padding
            const padding = 0.01;
            const bounds = [
              [minLng - padding, minLat - padding],
              [maxLng + padding, maxLat + padding]
            ];
            
            if (map.fitBounds) {
              map.fitBounds(bounds);
            }
          } catch (e) {
            console.log('Could not fit bounds');
          }
        }
      });

      // Close info popup when clicking on map
      map.on('click', () => {
        setSelectedHub(null);
      });
    };

    initMap();

    return () => {
      mounted = false;
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          // Ignore errors
        }
      });
      markersRef.current = [];
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          // Ignore errors
        }
        mapRef.current = null;
      }
    };
  }, [microhubs, apiKey]);

  const hubsWithCoords = microhubs.filter(hub => hub.latitude && hub.longitude);
  const hubsWithoutCoords = microhubs.filter(hub => !hub.latitude || !hub.longitude);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden border">
        <div ref={mapContainerRef} style={{ height, width: "100%" }} />
        
        {/* Legend */}
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-3 rounded-lg text-xs space-y-2 shadow-lg">
          <div className="font-semibold">Stock Levels</div>
          <div className="flex items-center gap-2">
            <svg width="12" height="15" viewBox="0 0 40 50">
              <path d="M 20 0 C 11.716 0 5 6.716 5 15 C 5 23.284 20 45 20 45 C 20 45 35 23.284 35 15 C 35 6.716 28.284 0 20 0 Z" fill="#22c55e" stroke="white" stroke-width="2"/>
            </svg>
            <span>&lt;60% (In Stock)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="15" viewBox="0 0 40 50">
              <path d="M 20 0 C 11.716 0 5 6.716 5 15 C 5 23.284 20 45 20 45 C 20 45 35 23.284 35 15 C 35 6.716 28.284 0 20 0 Z" fill="#f59e0b" stroke="white" stroke-width="2"/>
            </svg>
            <span>60-85% (Low Stock)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="15" viewBox="0 0 40 50">
              <path d="M 20 0 C 11.716 0 5 6.716 5 15 C 5 23.284 20 45 20 45 C 20 45 35 23.284 35 15 C 35 6.716 28.284 0 20 0 Z" fill="#ef4444" stroke="white" stroke-width="2"/>
            </svg>
            <span>&gt;85% (Critical)</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            Click markers for details
          </div>
        </div>

        {/* Info Popup */}
        {selectedHub && (
          <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border max-w-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{selectedHub.name}</h3>
              <button 
                onClick={() => setSelectedHub(null)}
                className="text-muted-foreground hover:text-foreground ml-2"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Location:</span>
                <span>{selectedHub.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getStatusText(selectedHub) === 'In Stock' ? 'bg-green-100 text-green-800' :
                  getStatusText(selectedHub) === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusText(selectedHub)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Capacity:</span>
                <span>{selectedHub.capacity.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Utilized:</span>
                <span>{selectedHub.utilized.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Utilization:</span>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        width: `${Math.round((selectedHub.utilized / selectedHub.capacity) * 100)}%`,
                        backgroundColor: getGradientColor(Math.round((selectedHub.utilized / selectedHub.capacity) * 100))
                      }}
                    />
                  </div>
                  <span className="font-medium">
                    {Math.round((selectedHub.utilized / selectedHub.capacity) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status overlay */}
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
          Showing {hubsWithCoords.length} of {microhubs.length} microhubs
        </div>
      </div>

      {/* Warning for microhubs without coordinates */}
      {hubsWithoutCoords.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> {hubsWithoutCoords.length} microhub(s) don't have coordinates and aren't shown on the map:
          </div>
          <div className="text-xs text-yellow-700 mt-1">
            {hubsWithoutCoords.map(hub => hub.name).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}