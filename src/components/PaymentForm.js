import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const PaymentFormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardContainer = styled.div`
  min-height: 89px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
`;

const SubmitButton = styled(motion.button)`
  padding: 15px 30px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 14px;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #00c851;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;

const TestModeIndicator = styled.div`
  background: #ffd700;
  color: #000;
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
`;

function PaymentForm({ amount, onSuccess, disabled }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function initializeSquare() {
      try {
        const appId = process.env.REACT_APP_SQUARE_APP_ID;
        const locationId = process.env.REACT_APP_SQUARE_LOCATION_ID;

        if (!appId || !locationId) {
          throw new Error("Square credentials are not properly configured");
        }

        const paymentsInstance = await window.Square.payments(
          appId,
          locationId
        );
        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach("#card-container");
        setCard(cardInstance);
      } catch (e) {
        console.error("Square initialization error:", e);
        setError("Failed to initialize payment system: " + e.message);
      }
    }

    // Load Square.js script if not already loaded
    if (!window.Square) {
      const script = document.createElement("script");
      script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
      script.onload = initializeSquare;
      script.onerror = () => setError("Failed to load Square payment system");
      document.body.appendChild(script);
    } else {
      initializeSquare();
    }

    // Cleanup
    return () => {
      const script = document.querySelector('script[src*="square.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card) {
      setError("Payment system not initialized");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await card.tokenize();
      if (result.status === "OK") {
        // Make payment request
        const response = await fetch(
          "https://connect.squareupsandbox.com/v2/payments",
          {
            method: "POST",
            headers: {
              "Square-Version": "2025-03-19",
              Authorization: `Bearer ${process.env.REACT_APP_SQUARE_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              source_id: result.token,
              idempotency_key: crypto.randomUUID(),
              amount_money: {
                amount: amount * 100, // Convert to cents
                currency: "USD",
              },
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.errors?.[0]?.detail || "Payment failed");
        }

        setSuccess(true);
        onSuccess?.(data);
      } else {
        throw new Error(
          result.errors?.[0]?.message || "Card tokenization failed"
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentFormContainer>
      <TestModeIndicator>
        Test Mode - Use card number: 4111 1111 1111 1111
      </TestModeIndicator>

      <Form onSubmit={handleSubmit}>
        <CardContainer id="card-container" />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton
          type="submit"
          disabled={loading || !card || disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Processing..." : `Pay $${amount}`}
        </SubmitButton>

        {success && (
          <SuccessMessage>
            Payment successful! You will receive a confirmation email shortly.
          </SuccessMessage>
        )}
      </Form>
    </PaymentFormContainer>
  );
}

export default PaymentForm;
