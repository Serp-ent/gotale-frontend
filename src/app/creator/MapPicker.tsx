"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { X, Check, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

// Fix for default marker icons in Leaflet with Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapPickerProps {
  initialLat?: string;
  initialLng?: string;
  initialTitle?: string;
  onSelect: (lat: string, lng: string, title: string) => void;
  onClose: () => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

function MapUpdater({ center }: { center: L.LatLngExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center as L.LatLngTuple, 13);
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ initialLat, initialLng, initialTitle, onSelect, onClose }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? L.latLng(parseFloat(initialLat), parseFloat(initialLng)) : null
  );
  const [title, setTitle] = useState(initialTitle || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = () => {
    if (position) {
      onSelect(position.lat.toFixed(6), position.lng.toFixed(6), title);
      onClose();
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos = L.latLng(parseFloat(lat), parseFloat(lon));
        setPosition(newPos);
        setMapCenter(newPos);
        // Optional: auto-fill title if empty
        if (!title) {
            setTitle(display_name.split(',')[0]);
        }
      } else {
        toast.error("Nie znaleziono lokalizacji.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Wystąpił błąd podczas wyszukiwania.");
    } finally {
      setIsSearching(false);
    }
  };

  const defaultCenter: L.LatLngExpression = position ? [position.lat, position.lng] : [52.237, 21.017]; // Warsaw default

  const content = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-card text-card-foreground rounded-xl shadow-2xl border border-border w-full max-w-7xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 h-[85vh] cursor-default"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2 text-accent">
              <MapPin size={20} />
              <h3 className="font-bold text-lg hidden sm:block whitespace-nowrap">Wybierz lokalizację</h3>
            </div>

            <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
               <input 
                  className="flex-1 p-2 text-sm rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Szukaj miasta, adresu..."
               />
               <Button type="submit" size="sm" variant="secondary" disabled={isSearching}>
                  <Search size={16} className={isSearching ? "animate-spin" : ""} />
               </Button>
            </form>
          </div>

          <button onClick={onClose} className="hover:bg-muted p-1 rounded-md transition-colors ml-4">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 w-full relative">
          <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
            <MapUpdater center={mapCenter} />
          </MapContainer>
        </div>

        <div className="p-4 border-t border-border flex flex-col gap-4 bg-muted/30">
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                <div className="w-full sm:w-1/2 space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Nazwa lokalizacji</label>
                    <input 
                        className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="np. Tajna Baza"
                    />
                </div>
                <div className="w-full sm:w-1/2 flex flex-col items-end gap-1">
                     <div className="text-sm text-muted-foreground font-mono">
                        {position ? (
                          <>Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}</>
                        ) : (
                          "Kliknij na mapie, aby wybrać punkt"
                        )}
                      </div>
                </div>
            </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/50 w-full">
            <Button variant="outline" onClick={onClose}>
              <X size={16} className="mr-1" /> Anuluj
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!position}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              <Check size={16} className="mr-1" /> Potwierdź
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(content, document.body) : null;
}
