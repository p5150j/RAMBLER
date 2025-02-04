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
      basePrice: Number(eventData.basePrice),
      extraMemberPrice: Number(eventData.extraMemberPrice),
      minTeamSize: Number(eventData.minTeamSize),
      maxTeamSize: Number(eventData.maxTeamSize),
      registeredTeams: 0, // Counter for registered teams
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
      basePrice: Number(eventData.basePrice),
      extraMemberPrice: Number(eventData.extraMemberPrice),
      minTeamSize: Number(eventData.minTeamSize),
      maxTeamSize: Number(eventData.maxTeamSize),
      updatedAt: new Date().toISOString(),
    };
    return await updateDoc(eventRef, formattedData);
  },

  // Delete event
  deleteEvent: async (id) => {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    return await deleteDoc(eventRef);
  },

  // Register a team for an event
  registerTeam: async (eventId, teamData) => {
    // First check if event has capacity
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventDoc = await getDoc(eventRef);
    const eventData = eventDoc.data();

    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }

    if (eventData.registeredTeams >= Number(eventData.capacity)) {
      throw new Error("Event is at capacity");
    }

    // Calculate total cost
    const extraMembers = Math.max(
      0,
      teamData.members.length - eventData.minTeamSize
    );
    const totalCost =
      eventData.basePrice + extraMembers * eventData.extraMemberPrice;

    // Create registration record
    const registrationData = {
      eventId,
      userId: teamData.userId,
      members: teamData.members,
      totalCost,
      status: "pending", // pending, confirmed, cancelled
      registeredAt: new Date().toISOString(),
      paymentStatus: "unpaid", // unpaid, paid
      shirtDetails: eventData.includesShirt
        ? teamData.members.map((member) => ({
            memberName: member.name,
            size: member.shirtSize,
            collected: false,
          }))
        : [],
      eventDetails: {
        title: eventData.title,
        date: eventData.date,
        location: eventData.location,
      },
    };

    // Add registration and increment counter atomically
    const registration = await addDoc(
      collection(db, EVENT_REGISTRATIONS_COLLECTION),
      registrationData
    );
    await updateDoc(eventRef, {
      registeredTeams: increment(1),
    });

    return {
      registrationId: registration.id,
      ...registrationData,
    };
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
