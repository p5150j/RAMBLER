import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../../components/events/PaymentModal";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const RegisterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 20px;
  font-family: "Racing Sans One", "Poppins", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const RegistrationForm = styled.form`
  max-width: 600px;
  margin: 0 auto 40px;
  padding: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 16px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 16px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RegistrationFee = styled.div`
  text-align: center;
  margin: 40px 0;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FeeAmount = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  margin: 10px 0;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.8rem;
  margin-top: 5px;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: "",
    teamName: "",
    experience: "beginner",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.carMake ||
      !formData.carModel ||
      !formData.carYear
    ) {
      setFormError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setIsSubmitting(true);
    try {
      // Save registration data
      const registrationData = {
        ...formData,
        registrationDate: new Date().toISOString(),
        status: "pending",
      };

      // Add to Firestore
      const docRef = await addDoc(
        collection(db, "registrations"),
        registrationData
      );

      // Redirect to success page with registration ID
      navigate("/registration-success", {
        state: {
          registrationId: docRef.id,
        },
      });
    } catch (error) {
      console.error("Error saving registration:", error);
      setFormError("Registration failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <RegisterContainer>
      <RegisterHeader>
        <Title>Register for the Rocky Mountain Rambler 500</Title>
        <Subtitle>
          Join us for the most exciting budget racing event in the Rockies. Fill
          out your registration details below and secure your spot!
        </Subtitle>
      </RegisterHeader>

      <RegistrationForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Full Name *</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Email *</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Phone Number *</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Car Make *</Label>
          <Input
            type="text"
            name="carMake"
            value={formData.carMake}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Car Model *</Label>
          <Input
            type="text"
            name="carModel"
            value={formData.carModel}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Car Year *</Label>
          <Input
            type="number"
            name="carYear"
            value={formData.carYear}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Team Name (Optional)</Label>
          <Input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Racing Experience *</Label>
          <Select
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </FormGroup>

        {formError && <ErrorMessage>{formError}</ErrorMessage>}

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? "Processing..." : "Register Now"}
        </SubmitButton>
      </RegistrationForm>

      {showPaymentModal && (
        <PaymentModal
          event={{
            title: "Rocky Mountain Rambler 500",
            eventType: "individual",
          }}
          registrationData={formData}
          totalAmount={100} // TODO: Get actual registration fee
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </RegisterContainer>
  );
}

export default Register;
