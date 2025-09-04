import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SingleRouteMap = ({ mapData }) => {
  if (!mapData || !mapData.steps || mapData.steps.length < 2)
    return <p>Not enough data to show a route</p>;

  const [roadPath, setRoadPath] = useState([]);

  const places = mapData.steps;

  // Custom marker icon
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  const center = [places[0].latitude, places[0].longitude];

  // Fetch road-following path from start to end
  useEffect(() => {
    const start = places[0];
    const end = places[places.length - 1];

    const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes?.length) {
          const path = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRoadPath(path);
        }
      })
      .catch((err) => console.error("Failed to fetch route:", err));
  }, [places]);

  return (
    <div className="h-screen w-full">
      <MapContainer center={center} zoom={8} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

          {/* Place markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
          >
            <Popup>
              <div className="text-sm">
                <h4 className="font-bold">{place.title}</h4>
                <p>
                  <strong>{place.place.name}</strong> ({place.place.category})
                </p>
                <img
                  src={place.image}
                  alt={place.title}
                  className="mt-2 w-40 rounded"
                />
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Start marker */}
        <Marker position={[places[0].latitude, places[0].longitude]}>
          <Popup>Start Point</Popup>
        </Marker>

        {/* End marker */}
        <Marker position={[places[places.length - 1].latitude, places[places.length - 1].longitude]}>
          <Popup>End Point</Popup>
        </Marker>

        {/* Road-following path */}
        {roadPath.length > 0 && <Polyline positions={roadPath} color="blue" weight={4} />}
      </MapContainer>
    </div>
  );
};

export default SingleRouteMap;
