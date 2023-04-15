import "leaflet/dist/leaflet.css";

import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { MarkerBusIcon, MarkerStopIcon } from "./marker-icon";

const MapWidget = (props) => {
  const [center, setCenter] = useState([40.64, -8.65]);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(14);
  const { buses, stops, changeSelectedBus } = props;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: "100%", height: "60vh" }}
      whenCreated={(map) => setMap(map)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stops.map((stop) => (
        <MarkerStopIcon key={stop.id} designation={stop.designation} position={stop.position} />
      ))}
      {Object.entries(buses).map(([deviceId, bus]) => (
        <MarkerBusIcon
          key={deviceId}
          deviceId={deviceId}
          busId=""
          name=""
          position={bus.position}
          changeSelectedBus={changeSelectedBus}
        />
      ))}
    </MapContainer>
  );
};
export default MapWidget;
