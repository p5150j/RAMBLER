import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { paymentService } from "../../utils/paymentService";

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
  const [card, setCard] = useState(null);
  const cardContainerRef = useRef(null);
  const cardInstanceRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const initializePayment = async () => {
      try {
        console.log("[PaymentModal] Starting payment initialization");
        setIsLoading(true);
        setError(null);

        const paymentsInstance = await paymentService.initializePayment();
        if (!mounted) return;

        if (!cardContainerRef.current) {
          throw new Error("Card container not found");
        }

        console.log("[PaymentModal] Creating card instance");
        const cardInstance = await paymentsInstance.card();
        if (!mounted) {
          cardInstance.destroy().catch(console.error);
          return;
        }

        console.log("[PaymentModal] Attaching card to container");
        await cardInstance.attach(cardContainerRef.current);
        if (!mounted) {
          cardInstance.destroy().catch(console.error);
          return;
        }

        console.log("[PaymentModal] Card attached successfully");
        cardInstanceRef.current = cardInstance;
        setCard(cardInstance);
      } catch (err) {
        console.error("[PaymentModal] Initialization error:", err);
        if (mounted) {
          setError(err.message || "Failed to initialize payment system");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializePayment();

    return () => {
      mounted = false;
      if (cardInstanceRef.current) {
        console.log("[PaymentModal] Destroying card instance");
        cardInstanceRef.current.destroy().catch(console.error);
        cardInstanceRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get a payment token
      const result = await card.tokenize();

      if (result.status === "OK") {
        // Include more payment details in the success callback
        onSuccess({
          status: "SUCCESS",
          transactionId: result.token,
          lastFour: result.details?.card?.last4 || "0000",
          cardBrand: result.details?.card?.brand || "unknown",
          token: result.token,
        });
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

        <TestModeNotice>
          <h4>🧪 Test Mode</h4>
          <p>Use these test card numbers:</p>
          <ul>
            <li>Success: 4111 1111 1111 1111</li>
            <li>Declined: 4000 0000 0000 0002</li>
          </ul>
          <p>Use any future expiry date and any 3 digits for CVV</p>
        </TestModeNotice>

        <PaymentForm onSubmit={handleSubmit}>
          <CardContainer ref={cardContainerRef} />

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

const TestModeNotice = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;

  h4 {
    margin: 0 0 10px;
    font-size: 1rem;
  }

  ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 5px;
  }

  p:last-child {
    margin-bottom: 0;
    font-style: italic;
  }
`;

export default PaymentModal;
