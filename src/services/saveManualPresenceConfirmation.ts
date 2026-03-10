import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import type { FamilyMemberPayment } from "../types/presence";

export interface ManualPresenceConfirmation {
  userName: string;
  userEmail: string;
  adminEmail: string;
  guestsCount: number;
  confirmedAt: Date;
  otherGuests: string[];
  status: "confirmed" | "canceled";
  addedByAdmin: boolean;
  familyMembers?: FamilyMemberPayment[];
}

export async function saveManualPresenceConfirmation(
  data: ManualPresenceConfirmation
) {
  try {
    const docRef = await addDoc(collection(db, "presenceConfirmations"), {
      ...data,
      confirmedAt: new Date(),
      addedByAdmin: true,
    });
    console.log("Presença manual confirmada com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao confirmar presença manual:", error);
    throw error;
  }
}
