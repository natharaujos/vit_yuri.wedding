import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { giftData } from "../constants/gifts";

async function migrateGifts() {
  try {
    const giftsCollection = collection(db, "gifts");

    for (const gift of giftData) {
      await addDoc(giftsCollection, {
        ...gift,
        buyedBy: "", // Add empty buyedBy field
      });
      console.log(`Added gift: ${gift.title}`);
    }

    console.log("All gifts migrated successfully!");
  } catch (error) {
    console.error("Error migrating gifts:", error);
  }
}

// Execute the migration
migrateGifts();
