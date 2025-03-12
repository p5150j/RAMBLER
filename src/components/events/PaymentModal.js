import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { paymentService } from "../../utils/paymentService";
import { payments } from "@square/web-sdk";

const PaymentModal = ({
  event,
  registrationData,
  totalAmount,
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [card, setCard] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize Square payments
      const paymentsInstance = await paymentService.initializePayment();

      // Create payment request
      const request = await paymentService.createPaymentRequest(totalAmount);
      setPaymentRequest(request);

      // Initialize card
      const cardInstance = await payments.card({
        elementId: "card-container",
        style: {
          input: {
            fontSize: "16px",
            color: "#333333",
            placeholderColor: "#999999",
          },
          "input::placeholder": {
            color: "#999999",
          },
        },
      });

      setCard(cardInstance);
    } catch (err) {
      console.error("Payment initialization error:", err);
      setError("Failed to initialize payment system");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card || !paymentRequest) return;

    try {
      setIsLoading(true);
      setError(null);

      // Process payment
      const result = await paymentService.processPayment(paymentRequest, card);

      if (result.status === "SUCCESS") {
        onSuccess(result);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      setError(err.message || "Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Complete Registration</h2>
          <CloseButton onClick={onCancel}>&times;</CloseButton>
        </ModalHeader>

        <PaymentSummary>
          <h3>Payment Summary</h3>
          <SummaryItem>
            <span>Event:</span>
            <span>{event.title}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Registration Type:</span>
            <span>{event.eventType === "team" ? "Team" : "Individual"}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Total Amount:</span>
            <span>${totalAmount}</span>
          </SummaryItem>
        </PaymentSummary>

        <PaymentForm onSubmit={handleSubmit}>
          <CardContainer id="card-container" />

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup>
            <SubmitButton
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </SubmitButton>
            <CancelButton
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </CancelButton>
          </ButtonGroup>
        </PaymentForm>
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
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 30px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: 5px;
`;

const PaymentSummary = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;

  h3 {
    margin: 0 0 15px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardContainer = styled.div`
  width: 100%;
  height: 40px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const SubmitButton = styled(motion.button)`
  flex: 1;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  text-align: center;
`;

export default PaymentModal;
