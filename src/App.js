import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import ReactTooltip from "react-tooltip";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "./LocalStorage.util";

import Locate from "./Locate";
import Search from "./Search";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: -21.7776128,
  lng: -43.3422336,
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = useState(getLocalStorage());
  const [selected, setSelected] = useState(null);
  const [showLugaresSalvos, setShowLugaresSalvos] = useState(false);

  const onMapClick = useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: `${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`,
      },
    ]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng, isHome }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
    setShowLugaresSalvos(false);

    if (!isHome) {
      const newObj = {
        lat,
        lng,
        time: `${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`,
      };
      setMarkers((current) => [...current, newObj]);
      setSelected(newObj);
    }
  }, []);

  useEffect(() => {
    if (markers) {
      setLocalStorage(markers);
    }
  }, [markers]);

  if (loadError) return "Erro ao acessar o Google Maps";
  if (!isLoaded) return "Carregando...";

  const clearPlaces = () => {
    setMarkers([]);
    setSelected(null);
    removeLocalStorage();
  };

  return (
    <div>
      <h1
        style={{ cursor: "pointer" }}
        onClick={() => setShowLugaresSalvos(!showLugaresSalvos)}
      >
        Locais{" "}
        <span role="img" aria-label="tent">
          ⛺️
        </span>
      </h1>

      <Locate panTo={panTo} />
      <Search panTo={panTo} clearPlaces={clearPlaces} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {showLugaresSalvos && (
          <div className="lugares-salvos">
            {markers.length > 0 ? (
              <ul>
                {markers.map((it, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      setSelected({ lat: it.lat, lng: it.lng, time: it.time })
                    }
                  >
                    <b>{it.lat}</b>, <b>{it.lng}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum local salvo</p>
            )}
          </div>
        )}
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: "/logo192.png",
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(60, 60),
            }}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src="/marker.png" alt="marker" style={{ width: 25 }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>Lat. {selected.lat}</span>
                  <span>Lng. {selected.lng}</span>
                </div>
              </h3>
              <p>Salvo dia: {selected.time}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <ReactTooltip />
    </div>
  );
};

export default App;
