import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useLoading } from "../../contexts/LoadingContext";
import Button from "../Button/Button";

interface Gift {
  id: string;
  title: string;
  price: number;
  image: string;
  buyedBy: string;
}

export default function GiftList() {
  const navigate = useNavigate();
  const { setLoadingWithDelay } = useLoading();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGifts() {
      try {
        const giftsCollection = collection(db, "gifts");
        const giftsSnapshot = await getDocs(giftsCollection);
        const giftsList = giftsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Gift[];

        setGifts(giftsList);
      } catch (error) {
        console.error("Error fetching gifts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGifts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-500"></div>
      </div>
    );

  return (
    <section id="presentes" className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-wedding-50">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-wedding-600 mb-4">
          Lista de Presentes
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Escolha um presente especial para celebrar nosso amor
        </p>
        <button
          onClick={() => navigate("/presentes")}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#B24C60] hover:bg-[#CE6375] text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border border-[#B24C60]"
        >
          🎁 Ver Todos os Presentes ({gifts.length})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gifts.slice(0, 8).map(({ id, title, price, image }) => (
          <div
            key={id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between items-center border border-wedding-100 hover:border-wedding-300 transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center flex-1">
              <div className="w-full h-48 flex items-center justify-center mb-4 bg-gradient-to-br from-wedding-50 to-white rounded-xl p-4">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 text-center line-clamp-2 min-h-[3.5rem]">
                {title}
              </h3>
              <div className="bg-gradient-to-r from-wedding-100 to-wedding-200 px-4 py-2 rounded-full mb-4">
                <p className="text-wedding-700 font-bold text-xl">
                  R$ {price.toFixed(2)}
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setLoadingWithDelay(true);
                navigate(`/gift/${id}`);
                setLoadingWithDelay(false);
              }}
              text="Presentear"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
