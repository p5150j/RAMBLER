import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const userService = {
  initializeUser: async (userId, userData) => {
    console.log("Initializing user:", userId, userData);
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log("User initialized successfully");
    } catch (error) {
      console.error("Error initializing user:", error);
      throw error;
    }
  },

  registerForEvent: async (userId, eventId) => {
    console.log("Registering for event:", userId, eventId);
    if (!userId || !eventId) {
      throw new Error("User ID and Event ID are required");
    }

    try {
      // First, get the event details
      const eventRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(eventRef);
      console.log("Event document:", eventDoc.data());

      if (!eventDoc.exists()) {
        throw new Error("Event not found");
      }

      const eventData = eventDoc.data();

      // Create registration with more event details
      const eventRegistration = {
        eventId,
        title: eventData.title,
        date: eventData.date,
        price: eventData.price,
        location: eventData.location,
        registeredAt: new Date().toISOString(),
        status: "registered",
      };

      console.log("Event registration data:", eventRegistration);

      // Update user document
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        registeredEvents: arrayUnion(eventRegistration),
        updatedAt: new Date().toISOString(),
      });

      console.log("Event registration successful");
      return true;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  },

  addToCart: async (userId, productData) => {
    const userRef = doc(db, "users", userId);

    // Ensure price is a number
    const price = Number(productData.price);

    const orderItem = {
      items: [
        {
          productId: productData.productId,
          title: productData.title,
          price: price, // Stored as number
          image: productData.image,
          size: productData.size,
          quantity: productData.quantity,
          addedAt: new Date().toISOString(),
        },
      ],
      orderedAt: new Date().toISOString(),
      status: "pending",
      totalAmount: price * productData.quantity, // Calculated from number
    };

    return updateDoc(userRef, {
      orders: arrayUnion(orderItem),
      updatedAt: new Date().toISOString(),
    });
  },

  addToExistingCart: async (userId, productData) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    // Find pending order (cart)
    let pendingOrder = userData.orders?.find(
      (order) => order.status === "pending"
    );

    if (pendingOrder) {
      // Add to existing pending order
      pendingOrder.items.push({
        productId: productData.productId,
        title: productData.title,
        price: Number(productData.price),
        image: productData.image,
        size: productData.size,
        quantity: productData.quantity,
        addedAt: new Date().toISOString(),
      });

      // Recalculate total
      pendingOrder.totalAmount = pendingOrder.items.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
      );

      // Update the order in Firestore
      const updatedOrders = userData.orders.map((order) =>
        order.orderedAt === pendingOrder.orderedAt ? pendingOrder : order
      );

      return updateDoc(userRef, {
        orders: updatedOrders,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // No pending order exists, create new one
      return this.addToCart(userId, productData);
    }
  },

  getUserRegistrations: async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.registeredEvents || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      throw error;
    }
  },
};
