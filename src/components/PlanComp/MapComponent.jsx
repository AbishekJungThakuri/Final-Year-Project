import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ mapData }) => {
  const steps = mapData?.steps ?? [];
  const routes = mapData?.routes ?? [];

  const [stepPath, setStepPath] = useState([]);
  const [cityPath, setCityPath] = useState([]);

  const startPoint = steps.length > 0 ? steps[0] : null;
  const endPoint = steps.length > 0 ? steps[steps.length - 1] : null;
  const cityRoute = routes.length > 0 ? routes[0] : null;

  const createStepIcon = (number) =>
    L.divIcon({
      className: "step-icon",
      html: `<div class="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg border-2 border-black">${number}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -25],
    });

  const createInvisibleIcon = () =>
    L.divIcon({
      className: "invisible-marker",
      html: "",
      iconSize: [0, 0],
    });

  // fallback center if no steps
  const center = startPoint
    ? [startPoint.latitude, startPoint.longitude]
    : [27.7, 85.3]; // Kathmandu as default

  // Step route
  useEffect(() => {
    if (!startPoint || !endPoint) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes?.length) {
          const path = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setStepPath(path);
        }
      })
      .catch((err) => console.error("Failed to fetch step route:", err));
  }, [startPoint, endPoint]);

  // City route
  useEffect(() => {
    if (!cityRoute) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${cityRoute.start_city.longitude},${cityRoute.start_city.latitude};${cityRoute.end_city.longitude},${cityRoute.end_city.latitude}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes?.length) {
          const path = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setCityPath(path);
        }
      })
      .catch((err) => console.error("Failed to fetch city route:", err));
  }, [cityRoute]);

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* City route */}
        {cityRoute && cityPath.length > 0 && (
          <>
            <Marker
              position={[cityRoute.start_city.latitude, cityRoute.start_city.longitude]}
              icon={createInvisibleIcon()}
            />
            <Marker
              position={[cityRoute.end_city.latitude, cityRoute.end_city.longitude]}
              icon={createInvisibleIcon()}
            />
            <Polyline positions={cityPath} color="#ff0000" weight={5} opacity={1} />
          </>
        )}

        {/* Steps */}
        {steps.map((step, idx) => (
          <Marker
            key={step.id ?? idx}
            position={[step.latitude, step.longitude]}
            icon={createStepIcon(step.index + 1)}
          >
            <Popup>
              <div className="p-2 text-center max-w-sm">
                {step.image && (
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-32 object-cover rounded-lg mb-2 shadow"
                  />
                )}
                <h4 className="font-bold text-lg text-blue-800">{step.title}</h4>
                {step.place?.name && <p className="text-gray-600 text-sm">{step.place.name}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .step-icon {
          background: none;
          border: none;
        }
        .invisible-marker {
          display: none;
        }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
