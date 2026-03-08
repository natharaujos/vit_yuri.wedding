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
import { checkPaymentStatus } from "../../services/checkPaymentStatus";
import { Link } from "react-router-dom";
import { Dialog } from "@mui/material";

interface Payment {
  id?: string; // Add id field for document reference
  amount: number;
  buyerName: string;
  createdAt: Timestamp;
  giftId: string;
  giftTitle: string;
  items?: Array<{
    title: string;
    quantity: number;
    unitPrice?: number;
    totalPrice?: number;
  }>;
  mpPaymentId: string;
  status: "approved" | "pending" | "rejected" | "cancelled" | "error";
}

export function MyContributions() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) {
      setEmailError("Por favor, informe seu email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, informe um email válido.");
      return;
    }

    setEmailError("");
    setLoading(true);
    setSearched(true);

    try {
      const q = query(
        collection(db, "payments"),
        where("buyerEmail", "==", email.toLowerCase().trim())
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
  };

  useEffect(() => {
    // Try to load email from localStorage on mount
    const savedEmail = localStorage.getItem("buyerEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
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

  const getPaymentTitle = (payment: Payment) => {
    if (payment.giftTitle) {
      return payment.giftTitle;
    }

    if (payment.items && payment.items.length > 0) {
      return payment.items
        .map((item) => `${item.title} x${item.quantity}`)
        .join(", ");
    }

    return "Presente";
  };

  const getTotalUnits = (payment: Payment) => {
    if (!payment.items || payment.items.length === 0) {
      return 1;
    }

    return payment.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  };

  const hasMultipleGifts = (payment: Payment) => getTotalUnits(payment) > 1;

  const openDetailsModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 pt-32">
      <h2 className="text-2xl font-bold text-wedding-500 text-center mb-8">
        Minhas Contribuições
      </h2>

      {/* Email input form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">
          Digite seu email para consultar suas contribuições:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) {
                setEmailError("");
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className={`flex-1 border-2 px-4 py-2 rounded-lg transition-all ${
              emailError
                ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60]"
            }`}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-wedding-500 hover:bg-wedding-600"
            }`}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
      </div>

      {/* Results section - only show after search */}
      {searched && (
        <div className="grid gap-4">
        {payments.map((payment, index) => (
          <div
            key={payment.id || index}
            className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between gap-4"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-700">{getPaymentTitle(payment)}</p>
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
              {hasMultipleGifts(payment) && (
                <button
                  onClick={() => openDetailsModal(payment)}
                  className="mt-3 text-sm font-semibold text-wedding-600 hover:text-wedding-700 transition-colors cursor-pointer"
                >
                  Ver detalhes da compra
                </button>
              )}
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
            Nenhuma contribuição encontrada para este email.
          </p>
        )}
        </div>
      )}

      <div className="flex justify-end">
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 bg-wedding-500 text-white rounded-md hover:bg-wedding-600 transition"
        >
          Voltar para a página inicial
        </Link>
      </div>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "rounded-2xl p-2",
        }}
      >
        <div className="p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhes da compra</h3>

          {!selectedPayment?.items || selectedPayment.items.length === 0 ? (
            <p className="text-gray-600">Nao ha detalhes de itens para esta compra.</p>
          ) : (
            <div className="space-y-3">
              {selectedPayment.items.map((item, idx) => {
                const lineTotal = item.totalPrice ?? (item.unitPrice || 0) * item.quantity;
                return (
                  <div
                    key={`${item.title}-${idx}`}
                    className="border border-gray-200 rounded-lg p-3 flex justify-between items-start gap-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                      {item.unitPrice !== undefined && (
                        <p className="text-sm text-gray-500">Unitario: R$ {item.unitPrice.toFixed(2)}</p>
                      )}
                    </div>
                    <p className="font-semibold text-gray-700">R$ {lineTotal.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 border-t border-gray-200 pt-4 flex justify-between items-center">
            <p className="text-gray-600">Total da compra</p>
            <p className="text-lg font-bold text-wedding-600">
              R$ {(selectedPayment?.amount || 0).toFixed(2)}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setDetailsOpen(false)}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
