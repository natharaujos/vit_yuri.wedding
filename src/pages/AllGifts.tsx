import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Gift } from "../store/giftSlice";
import StyledLoading from "../components/StyledLoading";
import { Search, Filter, X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import type { RootState } from "../store";

const ITEMS_PER_PAGE = 12;

export default function AllGifts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setLoadingWithDelay } = useLoading();
  const [gifts, setGifts] = useState<(Gift & { firestoreId: string })[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<(Gift & { firestoreId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [showFilters, setShowFilters] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Carregar presentes do Firebase
  useEffect(() => {
    const loadGifts = async () => {
      try {
        const giftCollection = collection(db, "gifts");
        const giftSnapshot = await getDocs(giftCollection);
        const giftList = giftSnapshot.docs.map(docSnapshot => ({
          ...docSnapshot.data() as Gift,
          firestoreId: docSnapshot.id,
        }));
        setGifts(giftList.sort((a, b) => (a.id || 0) - (b.id || 0)));
        setFilteredGifts(giftList.sort((a, b) => (a.id || 0) - (b.id || 0)));
      } catch (error) {
        console.error("Erro ao carregar presentes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGifts();
  }, []);

  // Aplicar filtros e busca
  useEffect(() => {
    let result = [...gifts];

    // Filtro de busca
    if (searchTerm) {
      result = result.filter(gift =>
        gift.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de preço
    if (priceFilter !== "all") {
      result = result.filter(gift => {
        if (priceFilter === "low") return gift.price < 100;
        if (priceFilter === "medium") return gift.price >= 100 && gift.price <= 300;
        if (priceFilter === "high") return gift.price > 300;
        return true;
      });
    }

    setFilteredGifts(result);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  }, [searchTerm, priceFilter, gifts]);

  if (loading) {
    return <StyledLoading />;
  }

  // Paginação
  const totalPages = Math.ceil(filteredGifts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGifts = filteredGifts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleGiftClick = (giftFirestoreId: string) => {
    setLoadingWithDelay(true);
    navigate(`/gift/${giftFirestoreId}`);
    setLoadingWithDelay(false);
  };

  const handleAddToCart = (gift: Gift & { firestoreId: string }) => {
    dispatch(
      addToCart({
        giftId: gift.firestoreId,
        title: gift.title,
        image: gift.image,
        price: gift.price,
      })
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("all");
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-wedding-50 py-12 px-4 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-wedding-600 mb-4">
            🎁 Lista de Presentes
          </h1>
          <p className="text-gray-600 text-lg">
            Escolha um presente especial para o nosso casamento
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total de {filteredGifts.length} {filteredGifts.length === 1 ? 'presente' : 'presentes'}
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="mb-8 space-y-4">
          {/* Busca */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar presentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-wedding-600 transition-colors text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Botão de Filtros */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-wedding-300 text-wedding-600 rounded-lg hover:bg-wedding-50 transition-colors font-semibold"
            >
              <Filter size={20} />
              {showFilters ? 'Esconder Filtros' : 'Mostrar Filtros'}
            </button>
            {(searchTerm || priceFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                <X size={20} />
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 border-2 border-wedding-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Filtrar por Preço</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setPriceFilter("all")}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    priceFilter === "all"
                      ? 'bg-wedding-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setPriceFilter("low")}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    priceFilter === "low"
                      ? 'bg-wedding-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Até R$ 100
                </button>
                <button
                  onClick={() => setPriceFilter("medium")}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    priceFilter === "medium"
                      ? 'bg-wedding-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  R$ 100 - 300
                </button>
                <button
                  onClick={() => setPriceFilter("high")}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    priceFilter === "high"
                      ? 'bg-wedding-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Acima de R$ 300
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grid de Presentes */}
        {paginatedGifts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">😔 Nenhum presente encontrado</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-wedding-600 hover:bg-wedding-700 text-white rounded-lg transition-colors font-semibold"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {paginatedGifts.map((gift) => (
              <div
                key={gift.firestoreId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between items-center border border-wedding-100 hover:border-wedding-300 transform hover:-translate-y-2"
              >
                <div className="flex flex-col items-center flex-1">
                  <div className="w-full h-48 flex items-center justify-center mb-4 bg-gradient-to-br from-wedding-50 to-white rounded-xl p-4">
                    <img
                      src={gift.image}
                      alt={gift.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 text-center line-clamp-2 min-h-[3.5rem]">
                    {gift.title}
                  </h3>
                  <div className="bg-gradient-to-r from-wedding-100 to-wedding-200 px-4 py-2 rounded-full mb-4">
                    <p className="text-wedding-700 font-bold text-xl">
                      R$ {gift.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="w-full mt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleAddToCart(gift)}
                    aria-label={`Adicionar ${gift.title} ao carrinho`}
                    title="Adicionar ao carrinho"
                    className="relative inline-flex items-center justify-center w-11 h-11 rounded-full shadow-md border transition duration-300 ease-in-out cursor-pointer bg-[#B24C60] text-white hover:bg-[#CE6375] border-[#B24C60]"
                  >
                    <ShoppingCart size={18} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#B24C60] border border-[#B24C60] text-xs font-bold flex items-center justify-center leading-none">
                      +
                    </span>
                  </button>
                  <button
                    onClick={() => handleGiftClick(gift.firestoreId)}
                    className="inline-block px-4 py-2 font-semibold rounded-2xl border transition duration-300 ease-in-out text-center cursor-pointer bg-white text-[#B24C60] hover:bg-wedding-50 border-[#B24C60]"
                  >
                    Comprar agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {cartItemsCount > 0 && (
          <div className="sticky bottom-4 mt-8 z-10">
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-wedding-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Carrinho</p>
                <p className="font-bold text-gray-800">
                  {cartItemsCount} {cartItemsCount === 1 ? "item" : "itens"} - R$ {cartTotal.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-3 font-semibold rounded-2xl shadow-md border transition duration-300 ease-in-out text-center cursor-pointer bg-[#B24C60] text-white hover:bg-[#CE6375] border-[#B24C60]"
              >
                Ir para o checkout
              </button>
            </div>
          </div>
        )}

        {/* Botão Voltar */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl transition-colors font-semibold"
          >
            ← Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );
}
