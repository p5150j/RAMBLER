// pages/Gallery/Gallery.js
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { galleryService } from "../../utils/galleryService";

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

function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      const fetchedItems = await galleryService.getAllItems();
      setItems(fetchedItems);
    } catch (err) {
      console.error("Error fetching gallery items:", err);
      setError("Failed to load gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <p>{error}</p>
        <RetryButton onClick={fetchGalleryItems}>Retry</RetryButton>
      </ErrorContainer>
    );
  }

  if (!items.length) {
    return (
      <EmptyContainer>
        <p>No gallery items available.</p>
      </EmptyContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryGrid>
        {items.map((item) => (
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
                <LazyImage
                  src={item.url}
                  alt={item.title || `Gallery item ${item.id}`}
                />
              ) : (
                <LazyVideo src={item.url} />
              )}
              <Overlay>
                {item.title ? (
                  <OverlayContent>
                    <span className="title">{item.title}</span>
                    {item.description && (
                      <span className="description">{item.description}</span>
                    )}
                  </OverlayContent>
                ) : (
                  <span>+</span>
                )}
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
                  src={selectedItem.url}
                  alt={selectedItem.title || `Gallery item ${selectedItem.id}`}
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              )}
              {(selectedItem.title || selectedItem.description) && (
                <ModalInfo>
                  {selectedItem.title && <h3>{selectedItem.title}</h3>}
                  {selectedItem.description && (
                    <p>{selectedItem.description}</p>
                  )}
                </ModalInfo>
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
}

// Add these styled components after the imports and before the LazyVideo component

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

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorContainer = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmptyContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RetryButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;

  .title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .description {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const ModalInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

export default Gallery;
