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
      Marker: new (options?: { draggable?: boolean; color?: string }) => BkoiMarker;
    };
  }
}

export interface BkoiMap {
  on: (event: string, callback: (e?: MapClickEvent) => void) => void;
  remove: () => void;
  addLayer: (layer: any) => void;
  addSource: (id: string, source: any) => void;
  getSource: (id: string) => any;
  removeLayer: (id: string) => void;
  removeSource: (id: string) => void;
}

export interface BkoiMarker {
  setLngLat: (lngLat: [number, number] | { lng: number; lat: number }) => BkoiMarker;
  addTo: (map: BkoiMap) => BkoiMarker;
  remove: () => void;
  on: (event: string, callback: () => void) => BkoiMarker;
  getLngLat: () => { lng: number; lat: number };
}

export interface MapClickEvent {
  lngLat: { lng: number; lat: number };
}