// components/admin/MerchForm.js
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { storageService } from "../../utils/storageService";

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

const Button = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  padding: 20px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  margin-top: 8px;
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MerchForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    item || {
      title: "",
      price: "",
      originalPrice: "",
      description: "",
      image: "",
      badge: "",
      sizes: [],
      inStock: true,
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const availableSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "sizes") {
      const newSizes = [...formData.sizes];
      if (checked) {
        newSizes.push(value);
      } else {
        const index = newSizes.indexOf(value);
        if (index > -1) newSizes.splice(index, 1);
      }
      setFormData((prev) => ({
        ...prev,
        sizes: newSizes,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError("");
      const imageUrl = await storageService.uploadMerchImage(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError("Please upload a product image");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Title</Label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Price</Label>
        <Input
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Original Price (optional, for sale items)</Label>
        <Input
          name="originalPrice"
          type="number"
          step="0.01"
          value={formData.originalPrice}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Badge Text (optional, e.g., "New", "Sale", "Limited")</Label>
        <Input name="badge" value={formData.badge} onChange={handleChange} />
      </FormGroup>

      <FormGroup>
        <Label>Available Sizes</Label>
        <CheckboxGroup>
          {availableSizes.map((size) => (
            <CheckboxLabel key={size}>
              <input
                type="checkbox"
                name="sizes"
                value={size}
                checked={formData.sizes.includes(size)}
                onChange={handleChange}
              />
              {size}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FormGroup>

      <FormGroup>
        <CheckboxLabel>
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          In Stock
        </CheckboxLabel>
      </FormGroup>

      <FormGroup>
        <Label>Product Image</Label>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageSelect}
          accept="image/*"
        />
        <ImageUpload onClick={() => fileInputRef.current?.click()}>
          {formData.image ? (
            <>
              <ImagePreview src={formData.image} />
              <p style={{ marginTop: "10px" }}>Click to change image</p>
            </>
          ) : (
            <p>Click to upload image</p>
          )}
        </ImageUpload>
        {error && <ErrorText>{error}</ErrorText>}
      </FormGroup>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <Button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? "Saving..." : item ? "Update Product" : "Create Product"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            style={{ background: "#666" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
};

export default MerchForm;
