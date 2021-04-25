import React from "react";

const Locate = ({ panTo }) => {
  return (
    <button
      data-tip="Voltar para 🏠"
      data-place="bottom"
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              isHome: true,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
};

export default Locate;
