import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styled from "styled-components";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentFormContainer = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardElementContainer = styled.div`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 10px;
`;

const CheckoutForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Payment system is not ready. Please try again later.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Call your Firebase Function to create a PaymentIntent
      const response = await fetch(
        "https://createpaymentintent-72ysofrtzq-uc.a.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount * 100 }), // Stripe expects cents
        }
      );
      const data = await response.json();
      if (!data.clientSecret) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      // 2. Confirm the card payment with Stripe.js
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // 3. Success! Call your onSuccess handler
      onSuccess({
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        transactionId: paymentIntent.id,
        lastFour:
          paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4 ||
          "4242",
        cardBrand:
          paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand ||
          "visa",
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <CardElementContainer>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </CardElementContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : `Pay $${amount}`}
      </Button>
      <Button
        type="button"
        onClick={onCancel}
        style={{ background: "#6c757d" }}
      >
        Cancel
      </Button>
    </Form>
  );
};

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  if (!stripePromise) {
    return (
      <PaymentFormContainer>
        <ErrorMessage>
          Payment system is not configured. Please contact support.
        </ErrorMessage>
      </PaymentFormContainer>
    );
  }

  return (
    <PaymentFormContainer>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={amount}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </PaymentFormContainer>
  );
};

export default PaymentForm;
