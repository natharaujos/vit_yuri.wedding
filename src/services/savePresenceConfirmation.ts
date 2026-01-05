import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export interface PresenceConfirmation {
  userName: string;
  userEmail: string;
  guestsCount: number;
  confirmedAt: Date;
  otherGuests: string[];
  status: "confirmed" | "canceled";
}

export async function savePresenceConfirmation(data: PresenceConfirmation) {
  try {
    const docRef = await addDoc(collection(db, "presenceConfirmations"), {
      ...data,
      confirmedAt: new Date(),
    });
    console.log("Presença confirmada com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao confirmar presença:", error);
    throw error;
  }
}
