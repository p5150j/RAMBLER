// components/admin/EventForm.js
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { storageService } from "../../utils/storageService";

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    event || {
      title: "",
      date: "",
      location: "",
      price: "",
      status: "active",
      description: "",
      details: "",
      capacity: "",
      requirements: "",
      image: "",
      featured: false,
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError("");
      const imageUrl = await storageService.uploadEventImage(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError("Please upload an event image");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.message || "Failed to save event");
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
        <Label>Date</Label>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Location</Label>
        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Price</Label>
        <Input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="$250"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Status</Label>
        <Select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="past">Past</option>
        </Select>
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
        <Label>Details</Label>
        <TextArea
          name="details"
          value={formData.details}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Capacity</Label>
        <Input
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="50 teams"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Requirements</Label>
        <TextArea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Event Image</Label>
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
          {isLoading && <p>Uploading... {uploadProgress}%</p>}
        </ImageUpload>
        {error && <ErrorText>{error}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>
          <Input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />{" "}
          Featured Event
        </Label>
      </FormGroup>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <Button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
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

export default EventForm;
