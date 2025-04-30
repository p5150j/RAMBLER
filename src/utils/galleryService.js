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
  limit,
  startAfter,
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

  async getAllImages(lastVisible = null, pageSize = 12) {
    try {
      let q = query(
        collection(db, GALLERY_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      if (lastVisible) {
        q = query(
          collection(db, GALLERY_COLLECTION),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      const images = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        images.push({
          id: doc.id,
          ...doc.data(),
        });
        lastDoc = doc;
      });

      return {
        images,
        lastVisible: lastDoc,
      };
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      throw error;
    }
  },
};
