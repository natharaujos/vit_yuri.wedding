import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import Button from "../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../store/cartSlice";

type GiftFromDb = {
  title: string;
  image: string;
  price: number;
};

function GiftCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGift, setLoadingGift] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const addGiftFromRouteToCart = async () => {
      if (!id) {
        return;
      }

      const alreadyInCart = cartItems.some((item) => item.giftId === id);
      if (alreadyInCart) {
        return;
      }

      setLoadingGift(true);
      try {
        const giftDoc = await getDoc(doc(db, "gifts", id));
        if (!giftDoc.exists()) {
          return;
        }

        const giftData = giftDoc.data() as GiftFromDb;
        dispatch(
          addToCart({
            giftId: id,
            title: giftData.title,
            image: giftData.image,
            price: giftData.price,
          })
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingGift(false);
      }
    };

    addGiftFromRouteToCart();
  }, [id, cartItems, dispatch]);

  const totalAmount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  const handlePayment = async () => {
    if (!buyerName.trim()) {
      setNameError("Por favor, informe seu nome para continuar.");
      return;
    }

    if (!buyerEmail.trim()) {
      setEmailError("Por favor, informe seu email para continuar.");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
      setEmailError("Por favor, informe um email válido.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    setNameError("");
    setEmailError("");
    setLoading(true);

    // Save email to localStorage for later use in MyContributions
    localStorage.setItem("buyerEmail", buyerEmail.toLowerCase().trim());

    try {
      const paymentItems = cartItems.map((item) => ({
        giftId: item.giftId,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      }));

      const paymentRecord = {
        giftId: cartItems[0]?.giftId || "",
        giftTitle:
          cartItems.length === 1
            ? cartItems[0].title
            : `${cartItems.length} presentes`,
        giftIds: cartItems.map((item) => item.giftId),
        buyerName,
        buyerEmail: buyerEmail.toLowerCase().trim(),
        amount: totalAmount,
        quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        items: paymentItems,
        mpPaymentId: "",
        status: "pending",
        createdAt: new Date(),
      };

      const response = await addDoc(collection(db, "payments"), paymentRecord);

      navigate(`/checkout/options`, {
        state: {
          docRefId: response.id,
          items: paymentItems,
          giftPrice: totalAmount,
          buyerName,
          buyerEmail: buyerEmail.toLowerCase().trim(),
        },
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar sessao de pagamento. Entre em contato com os noivos.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingGift) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-700 font-medium">Carregando presente...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 px-4 text-center">
        <p className="text-lg text-gray-700 font-medium">Seu carrinho esta vazio.</p>
        <button
          onClick={() => navigate("/presentes")}
          className="inline-block px-6 py-3 font-semibold rounded-2xl shadow-md border transition duration-300 ease-in-out text-center cursor-pointer bg-[#B24C60] text-white hover:bg-[#CE6375] border-[#B24C60]"
        >
          Ver lista de presentes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-32">
      <h2 className="text-3xl font-bold text-center mb-6">Seu carrinho</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/presentes")}
          className="inline-block px-5 py-2 font-semibold rounded-2xl border transition duration-300 ease-in-out text-center cursor-pointer bg-white text-[#B24C60] hover:bg-wedding-50 border-[#B24C60]"
        >
          + Adicionar mais presentes
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div
            key={item.giftId}
            className="bg-white rounded-xl shadow-md border border-wedding-100 p-4 flex flex-col sm:flex-row gap-4 items-center"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-24 h-24 object-contain rounded-md"
            />

            <div className="flex-1 w-full">
              <p className="font-bold text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)} cada</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      giftId: item.giftId,
                      quantity: Math.max(1, item.quantity - 1),
                    })
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({ giftId: item.giftId, quantity: item.quantity + 1 })
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={() => dispatch(removeFromCart(item.giftId))}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-wedding-50 to-wedding-100 p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Itens</span>
          <span className="text-gray-800">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </div>
        <div className="border-t border-wedding-200 pt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-wedding-600">R$ {totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Seu nome"
          value={buyerName}
          onChange={(e) => {
            setBuyerName(e.target.value);
            if (nameError) {
              setNameError("");
            }
          }}
          className={`border-2 px-4 py-2 w-full rounded-lg transition-all ${
            nameError
              ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60]"
          }`}
        />
        {nameError && <p className="text-red-500 text-sm mt-2 text-left">{nameError}</p>}
      </div>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Seu email"
          value={buyerEmail}
          onChange={(e) => {
            setBuyerEmail(e.target.value);
            if (emailError) {
              setEmailError("");
            }
          }}
          className={`border-2 px-4 py-2 w-full rounded-lg transition-all ${
            emailError
              ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60]"
          }`}
        />
        {emailError && <p className="text-red-500 text-sm mt-2 text-left">{emailError}</p>}
      </div>

      <Button
        onClick={handlePayment}
        text={loading ? "Redirecionando..." : "Ir para pagamento"}
        type="button"
        disabled={loading}
      />
    </div>
  );
}

export default GiftCheckout;
