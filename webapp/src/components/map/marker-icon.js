import { Marker, Popup, useMap } from 'react-leaflet';

export const MarkerStopIcon = (props) => {
  const { designation, position } = props;

  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const map = useMap();

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{ click: () => {map.flyTo(position, 18);} }}
    >
      <Popup>
        {designation}
      </Popup>
    </Marker>
  );
};

export const MarkerBusIcon = (props) => {
  const { deviceId, position, changeSelectedBus } = props;

  const customIcon = new L.Icon({
    iconUrl: '/static/images/icons/bus.png',
    iconSize: [30, 30],
    popupAnchor: [0, -15]
  });

  const map = useMap();

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          map.flyTo(position, 18);
          changeSelectedBus(deviceId);
        }
      }}
    >
    </Marker>
  );
};
