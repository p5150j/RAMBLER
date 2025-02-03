// utils/galleryService.js
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

const GALLERY_COLLECTION = "gallery";

export const galleryService = {
  // Get all gallery items
  getAllItems: async () => {
    const galleryQuery = query(
      collection(db, GALLERY_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(galleryQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Add new gallery item
  addItem: async (itemData) => {
    return await addDoc(collection(db, GALLERY_COLLECTION), {
      ...itemData,
      createdAt: new Date().toISOString(),
    });
  },

  // Update gallery item
  updateItem: async (id, itemData) => {
    const itemRef = doc(db, GALLERY_COLLECTION, id);
    return await updateDoc(itemRef, {
      ...itemData,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete gallery item
  deleteItem: async (id) => {
    const itemRef = doc(db, GALLERY_COLLECTION, id);
    return await deleteDoc(itemRef);
  },
};
