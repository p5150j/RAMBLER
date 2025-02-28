import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const EventMap = ({
  location,
  height = "150px",
  showPin = true,
  zoom = 14,
}) => {
  // Encode the location for the Google Maps embed URL
  const encodedLocation = encodeURIComponent(location);

  return (
    <MapContainer style={{ height }}>
      <Map
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedLocation}&zoom=${zoom}`}
        allowFullScreen=""
        loading="lazy"
        title={`Map showing ${location}`}
      />
      {showPin && (
        <MapOverlay>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <LocationPin />
          </motion.div>
          <MapLocation
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {location}
          </MapLocation>
        </MapOverlay>
      )}
    </MapContainer>
  );
};

const MapContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
`;

const Map = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(100%) invert(92%) hue-rotate(180deg);
  transition: all 0.3s ease;

  &:hover {
    filter: grayscale(50%) invert(92%) hue-rotate(180deg);
  }
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const LocationPin = styled.div`
  width: 12px;
  height: 12px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  position: relative;
  margin-bottom: 8px;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: ${({ theme }) => theme.colors.primary}40;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
`;

const MapLocation = styled(motion.div)`
  color: white;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.primary}80;
  padding: 4px 10px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default EventMap;
