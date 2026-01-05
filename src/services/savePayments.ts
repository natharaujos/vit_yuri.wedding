// src/services/savePayment.ts
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export interface PaymentData {
  giftId: string;
  giftName: string;
  buyerName: string;
  amount: number;
  paymentMethod: "pix" | "credit_card";
  status: "pending" | "success" | "failed";
  createdAt: Date;
}

export async function savePayment(data: PaymentData) {
  try {
    const docRef = await addDoc(collection(db, "payments"), data);
    console.log("Pagamento salvo com ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao salvar pagamento:", error);
  }
}
