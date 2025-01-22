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
    const orderItem = {
      items: [productData],
      orderedAt: new Date().toISOString(),
      status: "pending",
    };

    return updateDoc(userRef, {
      orders: arrayUnion(orderItem),
      updatedAt: new Date().toISOString(),
    });
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
