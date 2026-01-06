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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGifts = gifts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(gifts.length / itemsPerPage);

  return (
    <section id="presentes" className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-wedding-50">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-wedding-600 mb-4">
          Lista de Presentes
        </h2>
        <p className="text-gray-600 text-lg">
          Escolha um presente especial para celebrar nosso amor
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentGifts.map(({ id, title, price, image }) => (
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

      {/* Paginação Melhorada */}
      {totalPages > 1 && (
        <>
          {/* Versão Mobile - Simplificada */}
          <div className="flex md:hidden justify-center items-center mt-12 gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                backgroundColor: currentPage === 1 ? '#E5E7EB' : '#B24C60',
                color: currentPage === 1 ? '#9CA3AF' : '#FFFFFF',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
              className="px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
            >
              ←
            </button>

            <div className="flex flex-col items-center px-4">
              <span className="text-sm font-bold text-wedding-600">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-1.5 mt-2">
                {[...Array(totalPages)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: currentPage === i + 1 ? '#B24C60' : '#E8A5AC',
                      width: currentPage === i + 1 ? '24px' : '8px',
                    }}
                    className="h-2 rounded-full transition-all duration-300"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: currentPage === totalPages ? '#E5E7EB' : '#B24C60',
                color: currentPage === totalPages ? '#9CA3AF' : '#FFFFFF',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
              className="px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
            >
              →
            </button>
          </div>

          {/* Versão Desktop - Completa */}
          <div className="hidden md:flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                backgroundColor: currentPage === 1 ? '#E5E7EB' : '#B24C60',
                color: currentPage === 1 ? '#6B7280' : '#FFFFFF',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Anterior
            </button>

            <div className="flex gap-2 items-center">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;

                // Show first, last, current, and neighbors
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        backgroundColor: currentPage === pageNum ? '#B24C60' : '#FFFFFF',
                        color: currentPage === pageNum ? '#FFFFFF' : '#B24C60',
                        borderColor: currentPage === pageNum ? '#AF5C78' : '#E8A5AC',
                      }}
                      className="min-w-[44px] h-11 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer border-2 shadow-md hover:shadow-lg"
                    >
                      {pageNum}
                    </button>
                  );
                }

                // Show ellipsis if gap
                if (
                  (pageNum === currentPage - 2 && pageNum > 1) ||
                  (pageNum === currentPage + 2 && pageNum < totalPages)
                ) {
                  return (
                    <span key={pageNum} className="px-2 text-gray-400 font-bold">
                      •••
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: currentPage === totalPages ? '#E5E7EB' : '#B24C60',
                color: currentPage === totalPages ? '#6B7280' : '#FFFFFF',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </section>
  );
}
