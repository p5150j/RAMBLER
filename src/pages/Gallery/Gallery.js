// pages/Gallery/Gallery.js
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const GalleryContainer = styled.div`
  padding: 20px;
  margin-top: 60px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 4px;
  grid-auto-rows: 300px;
  grid-auto-flow: dense;
`;

const GalleryItem = styled(motion.div)`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};

  &.wide {
    grid-column: span 2;
  }

  &.tall {
    grid-row: span 2;
  }

  &.large {
    grid-column: span 2;
    grid-row: span 2;
  }
`;

const MediaContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover {
    img,
    video {
      transform: scale(1.05);
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 1.5rem;

  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;

  img,
  video {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
`;

const LazyVideo = ({ src, ...props }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {isVisible && (
        <>
          <video
            ref={videoRef}
            src={src}
            muted
            loop
            playsInline
            autoPlay
            onLoadedData={handleLoadedData}
            {...props}
          />
          {isLoading && (
            <LoadingOverlay>
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </LoadingOverlay>
          )}
        </>
      )}
      {!isVisible && (
        <LoadingOverlay>
          <span>Loading...</span>
        </LoadingOverlay>
      )}
    </div>
  );
};

const LazyImage = ({ src, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <img src={src} onLoad={() => setIsLoading(false)} {...props} />
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </LoadingOverlay>
      )}
    </>
  );
};

// Gallery data array
const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1591278169757-deac26e49555",
    size: "normal",
  },
  {
    id: 2,
    type: "video",
    src: "https://www.shutterstock.com/shutterstock/videos/1058028727/preview/stock-footage-attractive-young-woman-mechanical-worker-repairing-a-vintage-car-in-old-garage.webm",
    size: "wide",
  },
  {
    id: 3,
    type: "video",
    src: "https://www.shutterstock.com/shutterstock/videos/1058028727/preview/stock-footage-attractive-young-woman-mechanical-worker-repairing-a-vintage-car-in-old-garage.webm",
    size: "tall",
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1591278169792-6f1cbf1d2762",
    size: "large",
  },
  {
    id: 5,
    type: "video",
    src: "https://www.shutterstock.com/shutterstock/videos/1058028727/preview/stock-footage-attractive-young-woman-mechanical-worker-repairing-a-vintage-car-in-old-garage.webm",
    size: "normal",
  },
].concat(
  // Generate more items by duplicating and modifying the existing ones
  Array.from({ length: 15 }, (_, index) => ({
    id: index + 6,
    type: index % 2 === 0 ? "video" : "image",
    src:
      index % 2 === 0
        ? "https://www.shutterstock.com/shutterstock/videos/1058028727/preview/stock-footage-attractive-young-woman-mechanical-worker-repairing-a-vintage-car-in-old-garage.webm"
        : [
            "https://images.unsplash.com/photo-1591278169757-deac26e49555",
            "https://images.unsplash.com/photo-1591278169792-6f1cbf1d2762",
            "https://images.unsplash.com/photo-1702146713882-2579afb0bfba",
          ][index % 3],
    size: ["normal", "wide", "tall", "large"][Math.floor(Math.random() * 4)],
  }))
);

function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <GalleryContainer>
      <GalleryGrid>
        {galleryItems.map((item) => (
          <GalleryItem
            key={item.id}
            className={item.size}
            onClick={() => setSelectedItem(item)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MediaContent>
              {item.type === "image" ? (
                <LazyImage src={item.src} alt={`Gallery item ${item.id}`} />
              ) : (
                <LazyVideo src={item.src} />
              )}
              <Overlay>
                <span>+</span>
              </Overlay>
            </MediaContent>
          </GalleryItem>
        ))}
      </GalleryGrid>

      <AnimatePresence>
        {selectedItem && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <CloseButton onClick={closeModal}>×</CloseButton>
            <ModalContent>
              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.src}
                  alt={`Gallery item ${selectedItem.id}`}
                />
              ) : (
                <video
                  src={selectedItem.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
}

export default Gallery;
