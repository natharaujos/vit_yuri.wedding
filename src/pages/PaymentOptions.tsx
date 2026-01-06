import { useLocation } from "react-router-dom";
import { useState } from "react";
import { VY_API } from "../constants/urls";

export type LocationState = {
  docRefId: string;
  giftTitle: string;
  giftPrice: number;
  buyerName: string;
};

export default function PaymentOptions() {
  const { state } = useLocation();
  const { docRefId, giftTitle, giftPrice, buyerName } = state as LocationState;

  const [loading, setLoading] = useState(false);

  const handlePix = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${VY_API}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          external_reference: docRefId,
          items: [
            {
              title: giftTitle,
              quantity: 1,
              currency_id: "BRL",
              unit_price: giftPrice,
            },
          ],
          payer: { name: buyerName },
          payment_method_id: "pix",
        }),
      });
      const data = await res.json();

      window.location.replace(data.init_point);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar preferência PIX");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Como você deseja pagar?</h2>
        <p className="mb-6">
          <strong>{giftTitle}</strong> — R$ {giftPrice.toFixed(2)}
        </p>
        <button
          onClick={handlePix}
          disabled={loading}
          className="w-full mb-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? "Aguarde…" : "Presentear"}
        </button>
      </div>
    </div>
  );
}
