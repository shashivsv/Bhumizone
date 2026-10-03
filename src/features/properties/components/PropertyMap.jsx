import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { Link } from 'react-router-dom';

// Custom Map center updater
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Create custom SVG price pill marker
function createPriceIcon(price, isRental) {
  const priceText = formatCurrencyINR(price, isRental);
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: #059669;
        color: white;
        padding: 4px 8px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 11px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
        border: 2px solid white;
        white-space: nowrap;
        cursor: pointer;
        transform: translate(-50%, -50%);
      ">
        ${priceText}
      </div>
    `,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });
}

export function PropertyMap({ properties = [], selectedProperty = null, height = '500px' }) {
  // Default center: India central coordinates (approx. Mumbai / Pune / Central India)
  const defaultCenter = [19.076, 72.8777];

  const activeCenter =
    selectedProperty?.coordinates?.lat && selectedProperty?.coordinates?.lng
      ? [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng]
      : properties.length > 0 && properties[0]?.coordinates?.lat
      ? [properties[0].coordinates.lat, properties[0].coordinates.lng]
      : defaultCenter;

  return (
    <div
      style={{ height }}
      className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
    >
      <MapContainer
        center={activeCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={activeCenter} />

        {properties.map((prop) => {
          if (!prop.coordinates?.lat || !prop.coordinates?.lng) return null;
          const icon = createPriceIcon(prop.price, prop.type === 'RENT');

          return (
            <Marker
              key={prop.id}
              position={[prop.coordinates.lat, prop.coordinates.lng]}
              icon={icon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="w-56 p-1 text-slate-900">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'}
                    alt={prop.title}
                    className="h-28 w-full rounded-lg object-cover mb-2"
                  />
                  <p className="text-xs font-bold truncate">{prop.title}</p>
                  <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                    {formatCurrencyINR(prop.price, prop.type === 'RENT')}
                  </p>
                  <p className="text-[11px] text-slate-500">{prop.locality}, {prop.city}</p>
                  <Link
                    to={`/properties/${prop.slug || prop.id}`}
                    className="mt-2 block text-center rounded-md bg-emerald-600 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
