// components/admin/GalleryItemForm.js
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { storageService } from "../../utils/storageService";

const GalleryItemForm = ({ item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    item || {
      type: "",
      url: "",
      size: "normal",
      title: "",
      description: "",
    }
  );

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleMediaSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");
      const { url, type } = await storageService.uploadGalleryMedia(file);
      setFormData((prev) => ({
        ...prev,
        url,
        type,
      }));
    } catch (error) {
      console.error("Error uploading media:", error);
      setError("Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.url) {
      setError("Please upload media content");
      return;
    }
    onSubmit(formData);
  };

  return (
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
        <h2>{item ? "Edit Gallery Item" : "Add Gallery Item"}</h2>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Media Upload</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaSelect}
              accept="image/*,video/*"
              style={{ display: "none" }}
            />
            <UploadButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Choose Media"}
            </UploadButton>

            {formData.url && (
              <Preview>
                {formData.type === "image" ? (
                  <img src={formData.url} alt="Preview" />
                ) : (
                  <video src={formData.url} controls />
                )}
              </Preview>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Title (optional)</Label>
            <Input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter title"
            />
          </FormGroup>

          <FormGroup>
            <Label>Description (optional)</Label>
            <TextArea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
            />
          </FormGroup>

          <FormGroup>
            <Label>Size</Label>
            <Select
              value={formData.size}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, size: e.target.value }))
              }
              required
            >
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
              <option value="tall">Tall</option>
              <option value="large">Large</option>
            </Select>
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup>
            <Button type="submit" disabled={isUploading}>
              {item ? "Update" : "Add"} Item
            </Button>
            <Button type="button" onClick={onClose} $variant="secondary">
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
};

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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;

  h2 {
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TextArea = styled.textarea`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UploadButton = styled.button`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Preview = styled.div`
  margin-top: 10px;
  border-radius: 6px;
  overflow: hidden;
  max-height: 300px;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${({ theme, $variant }) =>
    $variant === "secondary" ? theme.colors.surface : theme.colors.primary};
  color: ${({ theme, $variant }) =>
    $variant === "secondary" ? theme.colors.textPrimary : "white"};
  border: ${({ theme, $variant }) =>
    $variant === "secondary" ? `1px solid ${theme.colors.border}` : "none"};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === "secondary"
        ? theme.colors.surfaceAlt
        : theme.colors.primaryDark};
  }
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
`;

export default GalleryItemForm;
