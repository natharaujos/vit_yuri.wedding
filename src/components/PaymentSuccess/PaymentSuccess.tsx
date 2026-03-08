import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { checkPaymentStatus } from "../../services/checkPaymentStatus";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cartSlice";

const validStatuses = ["approved", "pending", "rejected", "cancelled"] as const;
type ValidStatus = (typeof validStatuses)[number];
type PaymentStatus = ValidStatus | "loading" | "error";

function PaymentSuccess() {
  const { payment_id } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const dispatch = useDispatch();

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
          const paymentData = paymentDoc.data();

          await updateDoc(doc(db, "payments", payment_id), {
            status: fallbackStatus,
            mpPaymentId: mpPaymentId || "",
          });

          if (fallbackStatus === "approved") {
            const giftIdsFromItems = Array.isArray(paymentData.items)
              ? paymentData.items
                  .map((item: { giftId?: string }) => item?.giftId)
                  .filter(Boolean)
              : [];

            const giftIds = Array.isArray(paymentData.giftIds)
              ? paymentData.giftIds
              : paymentData.giftId
                ? [paymentData.giftId]
                : giftIdsFromItems;

            await Promise.all(
              giftIds.map((giftId: string) =>
                updateDoc(doc(db, "gifts", giftId), {
                  buyedBy: paymentData.buyerEmail || "anonymous",
                })
              )
            );

            dispatch(clearCart());
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

          if (result === "approved") {
            dispatch(clearCart());
          }

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
  }, [payment_id, searchParams, dispatch]);

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
          <h1 className="text-2xl font-bold text-wedding-500">
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
            style={{
              backgroundColor: '#B24C60',
              color: '#FFFFFF',
            }}
            className="mt-8 inline-block px-6 py-3 rounded-md hover:opacity-90 transition font-semibold"
          >
            Voltar para a página inicial
          </Link>
        )}

        <Link
          to="/my-contributions"
          style={{
            backgroundColor: '#B24C60',
            color: '#FFFFFF',
          }}
          className="mt-8 inline-block px-6 py-3 rounded-md hover:opacity-90 transition font-semibold"
        >
          Ir para Minhas Contribuições
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
