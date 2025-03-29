import { payments } from "@square/web-sdk";

class PaymentService {
  constructor() {
    console.log("[PaymentService] Initializing service");
    this.applicationId = process.env.REACT_APP_SQUARE_APP_ID;
    this.locationId = process.env.REACT_APP_SQUARE_LOCATION_ID;
    this.paymentsInstance = null;
    this.isInitializing = false;
    this.initPromise = null;

    if (!this.applicationId || !this.locationId) {
      console.error("[PaymentService] Square credentials missing:", {
        hasAppId: !!this.applicationId,
        hasLocationId: !!this.locationId,
      });
    } else {
      console.log("[PaymentService] Credentials found");
    }
  }

  loadSquareScript() {
    return new Promise((resolve, reject) => {
      if (window.Square) {
        console.log("[PaymentService] Square already available");
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src*="square.js"]');
      if (existingScript) {
        console.log("[PaymentService] Found existing Square script");
        existingScript.addEventListener("load", () => {
          console.log("[PaymentService] Existing script loaded");
          resolve();
        });
        return;
      }

      console.log("[PaymentService] Loading new Square script");
      const script = document.createElement("script");
      script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
      script.onload = () => {
        console.log("[PaymentService] New Square script loaded");
        resolve();
      };
      script.onerror = (err) => {
        console.error("[PaymentService] Script load error:", err);
        reject(new Error("Failed to load Square.js"));
      };
      document.body.appendChild(script);
    });
  }

  async initializePayment() {
    try {
      if (this.initPromise) {
        console.log(
          "[PaymentService] Returning existing initialization promise"
        );
        return this.initPromise;
      }

      console.log("[PaymentService] Starting payment initialization");

      if (!this.applicationId || !this.locationId) {
        throw new Error("Square credentials are not properly configured");
      }

      this.initPromise = (async () => {
        await this.loadSquareScript();

        if (this.paymentsInstance) {
          console.log("[PaymentService] Returning existing payments instance");
          return this.paymentsInstance;
        }

        console.log("[PaymentService] Creating new payments instance");
        this.paymentsInstance = await window.Square.payments(
          this.applicationId,
          this.locationId
        );
        console.log("[PaymentService] Payments instance created successfully");

        return this.paymentsInstance;
      })();

      return this.initPromise;
    } catch (error) {
      console.error("[PaymentService] Initialization error:", error);
      this.initPromise = null;
      throw error;
    }
  }

  async createPaymentRequest(amount, currency = "USD") {
    try {
      console.log("[PaymentService] Creating payment request", {
        amount,
        currency,
      });

      if (!this.paymentsInstance) {
        console.log("[PaymentService] No payments instance, initializing...");
        await this.initializePayment();
      }

      if (!amount) {
        throw new Error("Amount is required for payment request");
      }

      const paymentRequest = await this.paymentsInstance.paymentRequest({
        countryCode: "US",
        currencyCode: currency,
        total: {
          amount: String(Math.round(amount * 100)),
          label: "Event Registration",
        },
      });

      console.log("[PaymentService] Payment request created successfully");
      return paymentRequest;
    } catch (error) {
      console.error("[PaymentService] Payment request error:", error);
      throw error;
    }
  }

  async processPayment(paymentRequest, card) {
    try {
      console.log("[PaymentService] Processing payment");
      const result = await paymentRequest.processPayment(card);
      console.log("[PaymentService] Payment processed:", result);
      return result;
    } catch (error) {
      console.error("[PaymentService] Payment processing error:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
