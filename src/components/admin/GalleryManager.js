// components/admin/GalleryManager.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { galleryService } from "../../utils/galleryService";
import { storageService } from "../../utils/storageService";
import GalleryItemForm from "./GalleryItemForm";

function GalleryManager() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
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

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await galleryService.deleteItem(itemId);
      await fetchItems();
      setIsDeleting(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Button onClick={handleAddItem}>Add New Item</Button>

      <GalleryGrid>
        {items.map((item) => (
          <GalleryItem key={item.id} className={item.size}>
            <MediaWrapper>
              {item.type === "image" ? (
                <img src={item.url} alt={item.title || "Gallery item"} />
              ) : (
                <video src={item.url} muted loop />
              )}
            </MediaWrapper>

            <ItemOverlay>
              <ItemActions>
                <ActionButton onClick={() => handleEditItem(item)}>
                  Edit
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    setSelectedItem(item);
                    setIsDeleting(true);
                  }}
                >
                  Delete
                </ActionButton>
              </ItemActions>
              <ItemInfo>
                <span>{item.type === "image" ? "🖼️" : "🎥"}</span>
                <span>{item.size}</span>
              </ItemInfo>
            </ItemOverlay>
          </GalleryItem>
        ))}
      </GalleryGrid>

      <AnimatePresence>
        {isModalOpen && (
          <GalleryItemForm
            item={selectedItem}
            onClose={() => setIsModalOpen(false)}
            onSubmit={async (data) => {
              try {
                if (selectedItem) {
                  await galleryService.updateItem(selectedItem.id, data);
                } else {
                  await galleryService.addItem(data);
                }
                await fetchItems();
                setIsModalOpen(false);
              } catch (err) {
                setError("Failed to save item");
              }
            }}
          />
        )}

        {isDeleting && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Confirm Delete</h2>
              <p style={{ margin: "20px 0" }}>
                Are you sure you want to delete this item?
              </p>
              <ButtonGroup>
                <Button
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  $variant="danger"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setIsDeleting(false);
                    setSelectedItem(null);
                  }}
                  $variant="secondary"
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Styled Components
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const GalleryItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};

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

const MediaWrapper = styled.div`
  width: 100%;
  height: 100%;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ItemInfo = styled.div`
  display: flex;
  gap: 10px;
  color: white;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme, $variant }) =>
    $variant === "danger"
      ? theme.colors.error
      : $variant === "secondary"
      ? theme.colors.surface
      : theme.colors.primary};
  color: ${({ $variant }) => ($variant === "secondary" ? "inherit" : "white")};
  border: ${({ theme, $variant }) =>
    $variant === "secondary" ? `1px solid ${theme.colors.border}` : "none"};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === "danger"
        ? theme.colors.errorDark
        : $variant === "secondary"
        ? theme.colors.surfaceAlt
        : theme.colors.primaryDark};
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export default GalleryManager;
