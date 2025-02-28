import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { eventService } from "../../utils/eventService";
import { useAuth } from "../../context/AuthContext";

const IndividualRegistrationForm = ({ event, onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: currentUser?.email || "",
    phone: "",
    emergencyContact: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Format the registration data for an individual registration
      const registrationData = {
        userId: currentUser?.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
      };

      // Pass the data directly to the success callback
      // Let the parent component handle the actual registration
      onSuccess(registrationData);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register for the event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Register for {event.title}</h2>
          <CloseButton onClick={onCancel}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Emergency Contact (Name & Phone)</Label>
            <Input
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <PriceInfo>
            <strong>Registration Fee:</strong> ${event.individualPrice}
          </PriceInfo>

          <FormGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              I agree to the terms and conditions
            </CheckboxLabel>
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup>
            <SubmitButton
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Processing..." : "Register Now"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const PriceInfo = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 16px;
  border-radius: 6px;
  margin: 8px 0;
  font-size: 1.1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const SubmitButton = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error || "red"};
  font-size: 0.9rem;
  padding: 8px 0;
`;

export default IndividualRegistrationForm;
