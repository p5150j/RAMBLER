// utils/eventService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  orderBy,
  where,
  getDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const EVENTS_COLLECTION = "events";
const EVENT_REGISTRATIONS_COLLECTION = "event_registrations";

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(eventsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Add new event
  addEvent: async (eventData) => {
    // Ensure prices are stored as numbers
    const formattedData = {
      ...eventData,
      eventType: eventData.eventType || "team", // Default to team event
      // Format prices based on event type
      ...(eventData.eventType === "team"
        ? {
            basePrice: Number(eventData.basePrice),
            extraMemberPrice: Number(eventData.extraMemberPrice),
            minTeamSize: Number(eventData.minTeamSize),
            maxTeamSize: Number(eventData.maxTeamSize),
          }
        : {
            individualPrice: Number(eventData.individualPrice),
          }),
      registeredTeams: 0, // Counter for registered teams/individuals
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await addDoc(collection(db, EVENTS_COLLECTION), formattedData);
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    const formattedData = {
      ...eventData,
      // Format prices based on event type
      ...(eventData.eventType === "team"
        ? {
            basePrice: Number(eventData.basePrice),
            extraMemberPrice: Number(eventData.extraMemberPrice),
            minTeamSize: Number(eventData.minTeamSize),
            maxTeamSize: Number(eventData.maxTeamSize),
          }
        : {
            individualPrice: Number(eventData.individualPrice),
          }),
      updatedAt: new Date().toISOString(),
    };
    return await updateDoc(eventRef, formattedData);
  },

  // Delete event
  deleteEvent: async (id) => {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    return await deleteDoc(eventRef);
  },

  // Register a team or individual for an event
  registerTeam: async (eventId, registrationData) => {
    console.log("Starting team registration:", { eventId, registrationData });

    // First check if event has capacity
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventDoc = await getDoc(eventRef);
    const eventData = eventDoc.data();

    console.log("Event data retrieved:", eventData);

    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }

    if (eventData.registeredTeams >= Number(eventData.capacity)) {
      throw new Error("Event is at capacity");
    }

    // Calculate total cost based on event type
    let totalCost = registrationData.totalCost;

    // Create registration record
    const formattedRegistrationData = {
      eventId,
      userId: registrationData.userId,
      // For team events, use the teamMembers array
      // For individual events, create a single-member array
      members:
        eventData.eventType === "team"
          ? registrationData.teamMembers
          : [
              {
                name: registrationData.name,
                email: registrationData.email,
                phone: registrationData.phone || "",
                emergencyContact: registrationData.emergencyContact || "",
              },
            ],
      totalCost,
      status: "pending", // pending, confirmed, cancelled
      registeredAt: new Date().toISOString(),
      paymentStatus: "unpaid", // unpaid, paid, failed
      paymentDetails: null, // Will be updated after successful payment
      // Only include shirt details for team events with shirts
      shirtDetails:
        eventData.eventType === "team" && eventData.includesShirt
          ? registrationData.teamMembers.map((member) => ({
              memberName: member.name,
              size: member.shirtSize,
              collected: false,
            }))
          : [],
      eventDetails: {
        title: eventData.title,
        date: eventData.date,
        location: eventData.location,
        eventType: eventData.eventType,
      },
    };

    console.log("Formatted registration data:", formattedRegistrationData);

    try {
      // Add registration and increment counter atomically
      const registration = await addDoc(
        collection(db, EVENT_REGISTRATIONS_COLLECTION),
        formattedRegistrationData
      );

      console.log("Registration document created:", registration.id);

      // Increment the counter by 1 (one team or one individual)
      await updateDoc(eventRef, {
        registeredTeams: increment(1),
      });

      console.log("Event counter incremented successfully");

      return {
        registrationId: registration.id,
        ...formattedRegistrationData,
      };
    } catch (error) {
      console.error("Error creating registration:", error);
      throw new Error(`Failed to create registration: ${error.message}`);
    }
  },

  // Update registration payment status
  updateRegistrationPayment: async (registrationId, paymentResult) => {
    const registrationRef = doc(
      db,
      EVENT_REGISTRATIONS_COLLECTION,
      registrationId
    );

    const paymentDetails = {
      status: paymentResult.status,
      transactionId: paymentResult.transactionId,
      lastFour: paymentResult.lastFour,
      cardBrand: paymentResult.cardBrand,
      processedAt: new Date().toISOString(),
    };

    await updateDoc(registrationRef, {
      paymentStatus: paymentResult.status === "SUCCESS" ? "paid" : "failed",
      paymentDetails,
      status: paymentResult.status === "SUCCESS" ? "confirmed" : "pending",
    });

    return paymentDetails;
  },

  // Get registrations for an event
  getEventRegistrations: async (eventId) => {
    const registrationsQuery = query(
      collection(db, EVENT_REGISTRATIONS_COLLECTION),
      where("eventId", "==", eventId),
      orderBy("registeredAt", "desc")
    );
    const snapshot = await getDocs(registrationsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get user's registrations
  getUserRegistrations: async (userId) => {
    const registrationsQuery = query(
      collection(db, EVENT_REGISTRATIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("registeredAt", "desc")
    );
    const snapshot = await getDocs(registrationsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
