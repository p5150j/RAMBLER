// pages/Gallery/Gallery.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { useTheme } from "styled-components";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";
import { galleryService } from "../../utils/galleryService";

const GalleryContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 100px 20px 60px;
`;

const PageHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ImageCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const LazyImage = ({ src, alt, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "100px",
  });

  return (
    <div ref={ref} style={{ height: "100%", width: "100%" }} onClick={onClick}>
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
              transition: "opacity 0.3s ease, transform 0.3s ease",
              transform: `scale(${isLoaded ? 1.0 : 1.1})`,
            }}
          />
          {!isLoaded && <LoadingPlaceholder />}
        </>
      )}
      {!inView && <LoadingPlaceholder />}
    </div>
  );
};

const LoadingPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageOverlay = styled(motion.div)`
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

  ${ImageCard}:hover & {
    opacity: 1;
  }
`;

const ImageTitle = styled.h3`
  color: white;
  text-align: center;
  padding: 20px;
  margin: 0;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin: 20px auto;
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

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
`;

function Gallery() {
  const theme = useTheme();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchedRef = useRef(new Set());
  const ITEMS_PER_PAGE = 12;

  const fetchImages = useCallback(
    async (pageNum) => {
      if (fetchedRef.current.has(pageNum)) {
        return;
      }

      try {
        setIsLoading(true);
        const { images: newImages, lastVisible: newLastVisible } =
          await galleryService.getAllImages(lastVisible, ITEMS_PER_PAGE);

        if (newImages.length === 0) {
          setHasMore(false);
          return;
        }

        setImages((prevImages) => [...prevImages, ...newImages]);
        setLastVisible(newLastVisible);
        fetchedRef.current.add(pageNum);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [lastVisible]
  );

  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (loadMoreInView && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(nextPage);
    }
  }, [loadMoreInView, hasMore, isLoading, page, fetchImages]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Rocky Mountain Rambler</title>
        <meta
          name="description"
          content="Browse our collection of high-quality images showcasing our products and events."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lexi.com/gallery" />
        <meta property="og:title" content="Gallery | Lexi" />
        <meta
          property="og:description"
          content="Browse our collection of high-quality images showcasing our products and events."
        />
        <meta
          property="og:image"
          content="https://lexi.com/gallery-og-image.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://lexi.com/gallery" />
        <meta name="twitter:title" content="Gallery | Lexi" />
        <meta
          name="twitter:description"
          content="Browse our collection of high-quality images showcasing our products and events."
        />
        <meta
          name="twitter:image"
          content="https://lexi.com/gallery-og-image.jpg"
        />
      </Helmet>

      <GalleryContainer>
        <PageHeader>
          <h1 style={{ marginBottom: "20px" }}>Gallery</h1>
          <p style={{ color: "#B0B0B0" }}>
            Explore our collection of high-quality images showcasing our
            products and events.
          </p>
        </PageHeader>

        <ImageGrid>
          <AnimatePresence>
            {images.map((image) => (
              <ImageCard
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LazyImage
                  src={image.url}
                  alt={image.title || "Gallery image"}
                  onClick={() => handleImageClick(image)}
                />
                <ImageOverlay>
                  <ImageTitle>{image.title || "Untitled"}</ImageTitle>
                </ImageOverlay>
              </ImageCard>
            ))}
          </AnimatePresence>
        </ImageGrid>

        <div ref={loadMoreRef}>
          {isLoading && (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>

        <AnimatePresence>
          {selectedImage && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
              <ModalImage
                src={selectedImage.url}
                alt={selectedImage.title || "Gallery image"}
                onClick={(e) => e.stopPropagation()}
              />
            </Modal>
          )}
        </AnimatePresence>
      </GalleryContainer>
    </>
  );
}

export default Gallery;
