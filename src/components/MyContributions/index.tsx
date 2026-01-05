import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  where,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { checkPaymentStatus } from "../../services/checkPaymentStatus";
import { Link } from "react-router-dom";

interface Payment {
  id?: string; // Add id field for document reference
  amount: number;
  buyerName: string;
  createdAt: Timestamp;
  giftId: string;
  giftTitle: string;
  mpPaymentId: string;
  status: "approved" | "pending" | "rejected" | "cancelled" | "error";
}

export function MyContributions() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    async function fetchAndUpdatePayments() {
      if (!user?.email) return;

      try {
        const q = query(
          collection(db, "payments"),
          where("buyerEmail", "==", user.email)
        );
        const querySnapshot = await getDocs(q);

        const myPayments: Payment[] = [];
        const updatePromises: Promise<void>[] = [];

        for (const item of querySnapshot.docs) {
          const data = { ...item.data(), id: item.id } as Payment;
          myPayments.push(data);

          // Only check status for payments that have an mpPaymentId and are not approved
          if (data.mpPaymentId && data.status !== "approved") {
            const statusCheckPromise = async () => {
              try {
                const newStatus = await checkPaymentStatus(data.mpPaymentId);
                if (newStatus !== data.status) {
                  console.log(
                    `Updating payment ${data.id} status to ${newStatus}`
                  );
                  await updateDoc(doc(db, "payments", data?.id || ""), {
                    status: newStatus,
                  });
                  // Update local state
                  data.status = newStatus;
                }
              } catch (error) {
                console.error(
                  `Error checking status for payment ${data.id}:`,
                  error
                );
              }
            };
            updatePromises.push(statusCheckPromise());
          }
        }

        // Wait for all status updates to complete
        await Promise.all(updatePromises);
        setPayments(myPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndUpdatePayments();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF7F]"></div>
      </div>
    );
  }

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: Payment["status"]) => {
    const statusMap = {
      approved: "Aprovado",
      pending: "Pendente",
      rejected: "Rejeitado",
      cancelled: "Cancelado",
      error: "Erro",
    };
    return statusMap[status];
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-[#D4AF7F] text-center mb-8">
        Minhas Contribuições
      </h2>

      <div className="grid gap-4">
        {payments.map((payment, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between gap-4"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-700">{payment.giftTitle}</p>
              <p className="text-sm text-gray-500 mt-1">
                Comprado em:{" "}
                {payment.createdAt.toDate().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-500">
                Valor: R$ {payment.amount.toFixed(2)}
              </p>
            </div>
            <div
              className={`${getStatusColor(
                payment.status
              )} px-3 py-1 rounded-full font-medium self-start sm:self-center`}
            >
              {getStatusText(payment.status)}
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <p className="text-center text-gray-500">
            Você ainda não contribuiu com nenhum presente.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 bg-[#D4AF7F] text-white rounded-md hover:bg-[#F4D4C1] transition"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </section>
  );
}
