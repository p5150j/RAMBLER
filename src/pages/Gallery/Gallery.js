// pages/Gallery/Gallery.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { galleryService } from "../../utils/galleryService";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";

const GalleryContainer = styled.div`
  padding: 20px;
  margin-top: 60px;
`;

const GalleryGrid = styled.div`
  display: grid;
  gap: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-rows: 300px;
    grid-auto-flow: dense;

    .wide {
      grid-column: span 2;
    }

    .tall {
      grid-row: span 2;
    }

    .large {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;

    /* Reset all special sizes on mobile */
    .wide,
    .tall,
    .large {
      grid-column: auto;
      grid-row: auto;
    }
  }
`;

const GalleryItem = styled(motion.div)`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    aspect-ratio: 4/3; /* Consistent aspect ratio on mobile */
  }
`;

// Update the media components for better mobile handling
const LazyImage = ({ src, alt, onClick, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "100px",
  });

  return (
    <div
      ref={ref}
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
      onClick={onClick}
    >
      {inView && (
        <>
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            {...props}
          />
          {!isLoaded && <LoadingPlaceholder />}
        </>
      )}
      {!inView && <LoadingPlaceholder />}
    </div>
  );
};

const LazyVideo = ({ src, onClick, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "100px",
  });
  const videoRef = useRef(null);

  useEffect(() => {
    if (inView && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle autoplay failure silently
      });
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
      onClick={onClick}
    >
      {inView && (
        <>
          <video
            ref={videoRef}
            src={src}
            onLoadedData={() => setIsLoaded(true)}
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            {...props}
          />
          {!isLoaded && <LoadingPlaceholder />}
        </>
      )}
      {!inView && <LoadingPlaceholder />}
    </div>
  );
};

// Update the LoadingPlaceholder for better mobile display
const LoadingPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
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

const ModalContent = styled(motion.div)`
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
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const ITEMS_PER_PAGE = 12;
  const fetchedRef = useRef(new Set()); // Track fetched pages

  // Fetch gallery items with pagination
  const fetchItems = useCallback(async (pageNum) => {
    // Skip if this page was already fetched
    if (fetchedRef.current.has(pageNum)) {
      return;
    }

    try {
      setIsLoading(true);
      const newItems = await galleryService.getAllItems(
        pageNum,
        ITEMS_PER_PAGE
      );

      setItems((prevItems) => {
        // Filter out any potential duplicates
        const newItemIds = new Set(newItems.map((item) => item.id));
        const filteredPrevItems = prevItems.filter(
          (item) => !newItemIds.has(item.id)
        );
        return [...filteredPrevItems, ...newItems];
      });

      setHasMore(newItems.length === ITEMS_PER_PAGE);
      fetchedRef.current.add(pageNum); // Mark this page as fetched
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchItems(1);
  }, []); // Remove fetchItems from dependencies

  // Infinite scroll detection
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (loadMoreInView && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage);
    }
  }, [loadMoreInView, hasMore, isLoading, page]);

  const renderMediaContent = (item) => {
    return item.type === "video" ? (
      <LazyVideo src={item.url} onClick={() => setSelectedItem(item)} />
    ) : (
      <LazyImage
        src={item.url}
        alt={item.title || "Gallery image"}
        onClick={() => setSelectedItem(item)}
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Rocky Mountain Rambler 500 | Gallery</title>
        <meta
          name="description"
          content="Experience the thrill of the Rocky Mountain Rambler 500 through our gallery. View photos and videos showcasing epic off-road adventures, beater car challenges, and the spirit of our Colorado rally community."
        />
        <meta
          property="og:title"
          content="Gallery - Rocky Mountain Rambler 500"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rockymtnrambler.com/gallery" />
        <meta
          property="og:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
        <meta
          property="og:description"
          content="Experience the thrill of the Rocky Mountain Rambler 500 through our gallery. View photos and videos showcasing epic off-road adventures, beater car challenges, and the spirit of our Colorado rally community."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Gallery - Rocky Mountain Rambler 500"
        />
        <meta
          name="twitter:description"
          content="Experience the thrill of the Rocky Mountain Rambler 500 through our gallery. View photos and videos showcasing epic off-road adventures, beater car challenges, and the spirit of our Colorado rally community."
        />
        <meta
          name="twitter:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
        <meta
          name="twitter:url"
          content="https://rockymtnrambler.com/gallery"
        />
      </Helmet>
      <GalleryContainer>
        <GalleryGrid>
          <AnimatePresence>
            {items.map((item) => (
              <GalleryItem
                key={item.id}
                className={item.size}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderMediaContent(item)}
              </GalleryItem>
            ))}
          </AnimatePresence>
        </GalleryGrid>

        {/* Load more trigger */}
        <div ref={loadMoreRef}>
          {isLoading && (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedItem && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <ModalContent
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <CloseButton onClick={() => setSelectedItem(null)}>
                  ×
                </CloseButton>
                {selectedItem.type === "video" ? (
                  <video
                    src={selectedItem.url}
                    autoPlay
                    controls
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title || "Gallery image"}
                  />
                )}
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </GalleryContainer>
    </>
  );
};

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin: 20px auto;
`;

export default Gallery;
