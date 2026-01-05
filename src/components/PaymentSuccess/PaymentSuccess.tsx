import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { checkPaymentStatus } from "../../services/checkPaymentStatus";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const validStatuses = ["approved", "pending", "rejected", "cancelled"] as const;
type ValidStatus = (typeof validStatuses)[number];
type PaymentStatus = ValidStatus | "loading" | "error";

function PaymentSuccess() {
  // this is not the one that is saved in the database, its the giftId. Need to change that.
  const { payment_id } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("loading");

  useEffect(() => {
    const mpPaymentId = searchParams.get("payment_id");
    const fallbackStatus = searchParams.get("collection_status");

    const check = async () => {
      if (!payment_id) {
        setStatus("error");
        return;
      }

      try {
        const paymentDoc = await getDoc(doc(db, "payments", payment_id));

        if (!paymentDoc.exists()) {
          console.error("Payment document not found:", payment_id);
          setStatus("error");
          return;
        }

        if (
          fallbackStatus &&
          validStatuses.includes(fallbackStatus as ValidStatus)
        ) {
          // Get the payment data to access the giftId
          const paymentData = paymentDoc.data();

          await updateDoc(doc(db, "payments", payment_id), {
            status: fallbackStatus,
            mpPaymentId: mpPaymentId || "",
          });

          if (fallbackStatus === "approved" && paymentData.giftId) {
            await updateDoc(doc(db, "gifts", paymentData.giftId), {
              buyedBy: paymentData.buyerEmail || "anonymous",
            });
          }

          setStatus(fallbackStatus as PaymentStatus);
        }

        console.log("Checking status via API");
        const result = await checkPaymentStatus(mpPaymentId || "");

        if (validStatuses.includes(result as ValidStatus)) {
          await updateDoc(doc(db, "payments", payment_id), {
            status: result,
            mpPaymentId: mpPaymentId || "",
          });
          setStatus(result as PaymentStatus);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setStatus("error");
      }
    };

    check();
  }, [payment_id, searchParams]);

  return (
    <div className="text-center py-20 px-4">
      {status === "loading" && <p>Verificando pagamento...</p>}

      {status === "approved" && (
        <>
          <h1 className="text-3xl font-bold mb-4">🎉 Pagamento aprovado!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Obrigado pela sua contribuição.
          </p>
        </>
      )}

      {status === "pending" && (
        <>
          <h1 className="text-2xl font-bold text-yellow-600">
            Pagamento em análise
          </h1>
          <p className="text-gray-600 mt-2">
            Aguarde a confirmação do Mercado Pago.
          </p>
        </>
      )}

      {status === "rejected" && (
        <>
          <h1 className="text-2xl font-bold text-red-600">
            Pagamento recusado
          </h1>
          <p className="text-gray-600 mt-2">
            O pagamento foi recusado. Verifique os dados e tente novamente.
          </p>
        </>
      )}

      {status === "cancelled" && (
        <>
          <h1 className="text-2xl font-bold text-gray-700">
            Pagamento cancelado
          </h1>
          <p className="text-gray-600 mt-2">
            O pagamento foi cancelado. Você pode tentar novamente se desejar.
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-red-600">
            Erro ao verificar pagamento
          </h1>
          <p className="text-gray-600 mt-2">
            Verifique seu e-mail ou entre em contato com os noivos.
          </p>
        </>
      )}

      <div className="flex gap-x-2 justify-center">
        {validStatuses.includes(status as ValidStatus) && (
          <Link
            to="/"
            className="mt-8 inline-block px-6 py-3 bg-[#D4AF7F] text-white rounded-md hover:bg-[#F4D4C1] transition"
          >
            Voltar para a página inicial
          </Link>
        )}

        <Link
          to="/my-contributions"
          className="mt-8 inline-block px-6 py-3 bg-[#D4AF7F] text-white rounded-md hover:bg-[#F4D4C1] transition"
        >
          Ir para Minhas Contribuições
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
