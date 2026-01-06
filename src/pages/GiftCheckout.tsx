import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Gift } from "../store/giftSlice";
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from "../components/Button/Button";

function GiftCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buyerName, setBuyerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gift, setGift] = useState<Gift | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [user] = useAuthState(auth);

  let docRef: DocumentReference<DocumentData>;

  useEffect(() => {
    const getGiftDetails = async () => {
      if (id) {
        const giftDoc = await getDoc(doc(db, "gifts", id));
        const giftData = giftDoc.data();
        setGift(giftData as Gift);
      }
    };

    getGiftDetails();
  }, [id]);

  const handlePayment = async () => {
    // Validar nome
    if (!buyerName.trim()) {
      setNameError("Por favor, informe seu nome para continuar.");
      return;
    }
    
    setNameError("");
    setLoading(true);
    
    try {
      const totalAmount = (gift?.price || 0) * quantity;
      const paymentRecord = {
        giftId: id,
        giftTitle: gift?.title,
        buyerName,
        buyerEmail: user?.email,
        amount: totalAmount,
        quantity,
        mpPaymentId: "",
        status: "pending",
        createdAt: new Date(),
      };
      const response = await addDoc(collection(db, "payments"), paymentRecord);
      docRef = response;

      if (gift) {
        navigate(`/gift/${id}/options`, {
          state: {
            docRefId: docRef.id,
            giftTitle: gift.title,
            giftPrice: totalAmount,
            buyerName,
            quantity,
          },
        });
      }
    } catch (error) {
      console.error(error);
      alert(
        `Erro ao iniciar sessão de pagamento. Entre em contato com os noivos.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!gift) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-700 font-medium">
          Presente não encontrado.
        </p>
      </div>
    );
  }

  const totalPrice = (gift.price * quantity).toFixed(2);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center">
      <img
        src={gift.image}
        alt={gift.title}
        className="w-50 rounded-md mb-6 mx-auto"
      />
      <h2 className="text-2xl font-bold">{gift.title}</h2>
      <p className="text-lg text-gray-600 mb-2">
        R$ {gift.price.toFixed(2)} cada
      </p>

      {/* Quantidade com botões + - */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          -
        </button>
        <span className="text-lg font-semibold w-8 text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          +
        </button>
      </div>

      {/* Total */}
      <p className="text-lg font-semibold text-gray-800 mb-6">
        Total: R$ {totalPrice}
      </p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Seu nome"
          value={buyerName}
          onChange={(e) => {
            setBuyerName(e.target.value);
            if (nameError) setNameError(""); // Limpar erro ao digitar
          }}
          className={`border-2 px-4 py-2 w-full rounded-lg transition-all ${
            nameError 
              ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
              : "border-gray-300 focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60]"
          }`}
        />
        {nameError && (
          <p className="text-red-500 text-sm mt-2 text-left flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {nameError}
          </p>
        )}
      </div>

      <Button
        onClick={handlePayment}
        text={loading ? "Redirecionando..." : "Contribuir com este presente"}
        type="button"
        disabled={loading}
      />
    </div>
  );
}

export default GiftCheckout;
