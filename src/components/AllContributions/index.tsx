import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { checkPaymentStatus } from "../../services/checkPaymentStatus";
import { Dialog } from "@mui/material";
import Button from "../Button/Button";
import { Trash2 } from "lucide-react";

interface Payment {
  id?: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  createdAt: Timestamp;
  giftId: string;
  giftTitle: string;
  mpPaymentId: string;
  status: "approved" | "pending" | "rejected" | "cancelled" | "error";
}

function AllContributions() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchAndUpdatePayments() {
      try {
        const q = query(collection(db, "payments"));
        const querySnapshot = await getDocs(q);

        const allPayments: Payment[] = [];
        const updatePromises: Promise<void>[] = [];
        let total = 0;

        for (const item of querySnapshot.docs) {
          const data = { ...item.data(), id: item.id } as Payment;
          allPayments.push(data);

          if (data.status === "approved") {
            total += data.amount;
          }

          if (data.mpPaymentId && data.status !== "approved") {
            const statusCheckPromise = async () => {
              try {
                const newStatus = await checkPaymentStatus(data.mpPaymentId);
                if (newStatus !== data.status) {
                  await updateDoc(doc(db, "payments", data?.id || ""), {
                    status: newStatus,
                  });
                  data.status = newStatus;
                  if (newStatus === "approved") {
                    total += data.amount;
                  }
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

        await Promise.all(updatePromises);
        setPayments(
          allPayments.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        );
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndUpdatePayments();
  }, []);

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
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

  const handleDelete = async () => {
    if (!selectedPaymentId) return;

    try {
      await deleteDoc(doc(db, "payments", selectedPaymentId));
      setPayments((prev) => prev.filter((p) => p.id !== selectedPaymentId));
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error);
    } finally {
      setConfirmOpen(false);
      setSelectedPaymentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-500"></div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-wedding-500 text-center mb-8">
        Todos os Presentes
      </h2>

      <div className="bg-gradient-to-r from-white to-wedding-50 rounded-xl shadow-lg p-6 mb-8 border border-wedding-200">
        <h3 className="text-xl font-bold text-wedding-600 mb-4">Resumo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-wedding-50 to-wedding-100 p-4 rounded-lg shadow-sm border border-wedding-200">
            <p className="text-sm font-medium text-gray-600">Total de Presentes</p>
            <p className="text-3xl font-bold text-wedding-600 mt-1">
              {payments.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm font-medium text-gray-600">Presentes Aprovados</p>
            <p className="text-3xl font-bold text-green-700 mt-1">
              {payments.filter((p) => p.status === "approved").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
            <p className="text-sm font-medium text-gray-600">Valor Total Aprovado</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">
              R$ {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-gradient-to-r from-white to-wedding-50/30 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 relative pb-16 sm:pb-4 border border-wedding-100"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-gray-700">{payment.giftTitle}</p>
                <p className="text-sm text-gray-500">
                  Comprador: {payment.buyerName} ({payment.buyerEmail})
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Data:{" "}
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span
                  className={`${getStatusColor(
                    payment.status
                  )} px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap`}
                >
                  {getStatusText(payment.status)}
                </span>
                <button
                  onClick={() => {
                    setSelectedPaymentId(payment.id || "");
                    setConfirmOpen(true);
                  }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer"
                  title="Remover contribuição"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <p className="text-center text-gray-500">
            Nenhum presente foi comprado ainda.
          </p>
        )}
      </div>

      {/* 🔥 Modal de confirmação */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: "p-6 rounded-lg",
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Confirmar exclusão
        </h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja remover esta <strong>contribuição</strong>?
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end space-x-3">
          <Button
            text="Cancelar"
            onClick={() => setConfirmOpen(false)}
            variant="secondary"
          />
          <Button
            text="Remover"
            onClick={handleDelete}
          />
        </div>
      </Dialog>
    </section>
  );
}

export default AllContributions;
