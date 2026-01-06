import { VY_API } from "../constants/urls";

export async function checkPaymentStatus(
  paymentId: string
): Promise<"approved" | "rejected" | "cancelled" | "pending" | "error"> {
  try {
    const res = await fetch(
      `${VY_API}/api/payments/checkStatus?paymentId=${paymentId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) throw new Error("Request failed");

    const responseData = await res.json();

    return responseData;
  } catch (err) {
    console.error("Erro ao checar status de pagamento", err);
    return "error";
  }
}
