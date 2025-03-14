// utils/storageService.js
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const storageService = {
  uploadMerchImage: async (file) => {
    try {
      const fileName = `merchandise/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  uploadEventImage: async (file) => {
    try {
      // Create a unique file name
      const fileName = `events/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  uploadGalleryMedia: async (file) => {
    try {
      const isVideo = file.type.startsWith("video/");
      const folderName = isVideo ? "gallery/videos" : "gallery/images";
      const fileName = `${folderName}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        url: downloadURL,
        type: isVideo ? "video" : "image",
      };
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  },
};
