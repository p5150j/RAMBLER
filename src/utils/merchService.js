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

const MERCH_COLLECTION = "merchandise";

export const merchService = {
  getAllMerch: async () => {
    const merchQuery = query(
      collection(db, MERCH_COLLECTION),
      orderBy("title", "asc")
    );
    const snapshot = await getDocs(merchQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  addMerch: async (merchData) => {
    return await addDoc(collection(db, MERCH_COLLECTION), merchData);
  },

  updateMerch: async (id, merchData) => {
    const merchRef = doc(db, MERCH_COLLECTION, id);
    return await updateDoc(merchRef, merchData);
  },

  deleteMerch: async (id) => {
    const merchRef = doc(db, MERCH_COLLECTION, id);
    return await deleteDoc(merchRef);
  },
};
