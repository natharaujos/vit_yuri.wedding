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

function GiftCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buyerName, setBuyerName] = useState("");
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
    setLoading(true);
    if (!buyerName.trim()) {
      alert("Por favor, informe seu nome.");
      setLoading(false);
      return;
    }
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

      <input
        type="text"
        placeholder="Seu nome"
        value={buyerName}
        onChange={(e) => setBuyerName(e.target.value)}
        className="border border-gray-300 px-4 py-2 w-full rounded-md mb-4"
        required
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-[#D4AF7F] text-white px-6 py-3 rounded-md hover:bg-[#F4D4C1] transition disabled:opacity-50"
      >
        {loading ? "Redirecionando..." : "Contribuir com este presente"}
      </button>
    </div>
  );
}

export default GiftCheckout;
