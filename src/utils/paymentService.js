import { payments } from "@square/web-sdk";

class PaymentService {
  constructor() {
    // Initialize Square SDK with your application ID
    this.applicationId = process.env.REACT_APP_SQUARE_APP_ID;
    this.locationId = process.env.REACT_APP_SQUARE_LOCATION_ID;
  }

  async initializePayment() {
    try {
      const paymentsInstance = await payments(
        this.applicationId,
        this.locationId
      );
      return paymentsInstance;
    } catch (error) {
      console.error("Error initializing Square payments:", error);
      throw new Error("Failed to initialize payment system");
    }
  }

  async createPaymentRequest(amount, currency = "USD") {
    try {
      const paymentRequest = await payments.paymentRequest({
        countryCode: "US",
        currencyCode: currency,
        total: {
          amount: amount * 100, // Convert to cents
          label: "Event Registration",
        },
      });

      return paymentRequest;
    } catch (error) {
      console.error("Error creating payment request:", error);
      throw new Error("Failed to create payment request");
    }
  }

  async processPayment(paymentRequest, card) {
    try {
      const result = await paymentRequest.processPayment(card);
      return result;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw new Error("Payment processing failed");
    }
  }
}

export const paymentService = new PaymentService();
