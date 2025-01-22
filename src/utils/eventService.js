import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const EVENTS_COLLECTION = "events";

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
    return await addDoc(collection(db, EVENTS_COLLECTION), eventData);
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    return await updateDoc(eventRef, eventData);
  },

  // Delete event
  deleteEvent: async (id) => {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    return await deleteDoc(eventRef);
  },
};
