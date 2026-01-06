import { useLocation } from "react-router-dom";
import { useState } from "react";
import { VY_API } from "../constants/urls";
import Button from "../components/Button/Button";
import { Gift, ArrowLeft, CheckCircle } from "lucide-react";

export type LocationState = {
  docRefId: string;
  giftTitle: string;
  giftPrice: number;
  buyerName: string;
  buyerEmail: string;
};

export default function PaymentOptions() {
  const { state } = useLocation();
  const { docRefId, giftTitle, giftPrice, buyerName, buyerEmail } = state as LocationState;

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
          payer: { 
            name: buyerName,
            email: buyerEmail 
          },
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
    <div className="min-h-screen bg-gradient-to-br from-wedding-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com botão voltar */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-wedding-600 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-wedding-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-wedding-100 rounded-full">
                <Gift className="text-wedding-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Resumo do Pedido</h2>
            </div>

            <div className="space-y-6">
              {/* Detalhes do presente */}
              <div className="border-b border-gray-200 pb-6">
                <p className="text-sm text-gray-500 mb-2">Presente selecionado</p>
                <p className="text-lg font-semibold text-gray-800">{giftTitle}</p>
              </div>

              {/* Informações do comprador */}
              <div className="border-b border-gray-200 pb-6">
                <p className="text-sm text-gray-500 mb-2">Comprador</p>
                <p className="text-lg font-medium text-gray-700">{buyerName}</p>
              </div>

              {/* Valor total */}
              <div className="bg-gradient-to-r from-wedding-50 to-wedding-100 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">R$ {giftPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Taxa de processamento</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="border-t border-wedding-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-wedding-600">
                    R$ {giftPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={18} className="text-green-500" />
                  Pagamento 100% seguro
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={18} className="text-green-500" />
                  Confirmação instantânea
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={18} className="text-green-500" />
                  Sem taxas adicionais
                </div>
              </div>
            </div>
          </div>

          {/* Opções de Pagamento */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-wedding-100 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-wedding-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-wedding-600" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Finalize seu presente
              </h2>
              <p className="text-gray-600">
                Você será redirecionado para escolher a forma de pagamento
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <Button
                  text={loading ? "Aguarde..." : "Ir para Pagamento"}
                  onClick={handlePix}
                  disabled={loading}
                />
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium border-2 border-gray-300 rounded-2xl hover:border-gray-400 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>

            {/* Nota de segurança */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 text-center">
                🔒 Seus dados estão protegidos com criptografia de ponta a ponta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
