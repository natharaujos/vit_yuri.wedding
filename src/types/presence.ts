export type PaymentType = "paying" | "courtesy";
export type PaymentStatus = "paid" | "pending" | "not-required";

export interface FamilyMemberPayment {
  name: string;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
}
