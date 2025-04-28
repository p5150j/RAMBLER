import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import PaymentForm from "./PaymentForm";

const PaymentModal = ({
  event,
  registrationData,
  totalAmount,
  onSuccess,
  onCancel,
}) => {
  console.log("PaymentModal props:", {
    event,
    registrationData,
    totalAmount,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement payment processing with new provider
      console.log("[PaymentModal] Payment processing not implemented yet");
      setError(
        "Payment processing is not implemented yet. Please contact support."
      );
    } catch (err) {
      console.error("[PaymentModal] Payment error:", err);
      setError("Payment failed. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    onSuccess(paymentResult);
    onCancel();
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

        <PaymentForm
          amount={totalAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={onCancel}
        />

        {error && (
          <ErrorContainer>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}
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

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
`;

const ErrorIcon = styled.span`
  font-size: 1.2rem;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  flex: 1;
`;

export default PaymentModal;
