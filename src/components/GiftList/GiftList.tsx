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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF7F]"></div>
      </div>
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGifts = gifts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(gifts.length / itemsPerPage);

  return (
    <section id="presentes" className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-[#3A3A3A] mb-8 text-center">
        Lista de Presentes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {currentGifts.map(({ id, title, price, image }) => (
          <div
            key={id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between items-center h-full"
          >
            <div className="flex flex-col items-center">
              <img
                src={image}
                alt={title}
                className="w-32 h-32 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {title}
              </h3>
              <p className="text-[#D4AF7F] font-bold mb-4">
                R$ {price.toFixed(2)}
              </p>
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

      {/* Paginação */}
      <div className="flex justify-center mt-10 space-x-2 sm:space-x-3 flex-wrap sm:flex-nowrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#D4AF7F] text-white hover:bg-[#F4D4C1]"
          }`}
        >
          Prev
        </button>

        <div className="flex overflow-x-auto max-w-[80vw] sm:max-w-none space-x-2 sm:space-x-3 scrollbar-hide">
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
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
                    currentPage === pageNum
                      ? "bg-[#F4D4C1] text-white"
                      : "bg-[#D4AF7F] text-white hover:bg-[#F4D4C1]"
                  }`}
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
                <span key={pageNum} className="px-2 text-gray-500">
                  ...
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
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#D4AF7F] text-white hover:bg-[#F4D4C1]"
          }`}
        >
          Next
        </button>
      </div>
    </section>
  );
}
