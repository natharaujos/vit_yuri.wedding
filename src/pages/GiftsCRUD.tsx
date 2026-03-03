import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import admins from "../constants/admins";
import type { Gift } from "../store/giftSlice";
import Button from "../components/Button/Button";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import StyledLoading from "../components/StyledLoading";

const ITEMS_PER_PAGE = 10;

// Toast component
const Toast = ({ message, type, show }: { message: string; type: 'success' | 'error'; show: boolean }) => {
  if (!show) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✓' : '✕';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse z-40`}>
      <span className="text-xl font-bold">{icon}</span>
      <span>{message}</span>
    </div>
  );
};

// Modal de confirmação de exclusão
const DeleteConfirmModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  giftTitle 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void; 
  giftTitle: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-wedding-600 mb-4">Confirmar Exclusão</h2>
        <p className="text-gray-700 mb-6">
          Tem certeza que deseja deletar <strong>"{giftTitle}"</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
          >
            <Trash2 size={18} />
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal para adicionar/editar presente
const GiftModal = ({ 
  isOpen, 
  isEditing,
  formData, 
  onSave, 
  onCancel, 
  onInputChange,
  loading
}: { 
  isOpen: boolean; 
  isEditing: boolean;
  formData: Partial<Gift>;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full my-8">
        <h2 className="text-3xl font-bold text-wedding-600 mb-6">
          {isEditing ? "✏️ Editar Presente" : "🎁 Novo Presente"}
        </h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Presente *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={onInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-wedding-600 transition-colors"
              placeholder="Ex: Jogo de Panelas"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem *
            </label>
            <input
              type="text"
              name="image"
              value={formData.image || ""}
              onChange={onInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-wedding-600 transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço (R$) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || 0}
              onChange={onInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-wedding-600 transition-colors"
              placeholder="100.00"
              step="0.01"
            />
          </div>
        </div>

        {/* Preview da imagem */}
        {formData.image && (
          <div className="mb-6 text-center">
            <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
            <img
              src={formData.image}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg mx-auto border-4 border-wedding-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/160";
              }}
            />
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white rounded-lg transition-colors font-semibold"
          >
            <X size={20} />
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors font-semibold"
          >
            <Save size={20} />
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function GiftsCRUD() {
  const [user] = useAuthState(auth);
  const [gifts, setGifts] = useState<(Gift & { firestoreId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Gift>>({
    title: "",
    image: "",
    price: 0,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({
    message: "",
    type: "success",
    show: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

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
      } catch (error) {
        console.error("Erro ao carregar presentes:", error);
        showToast("Erro ao carregar presentes", "error");
      } finally {
        setLoading(false);
      }
    };

    loadGifts();
  }, []);

  // Função para mostrar toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // Verificar se é admin
  if (!user || !admins.includes(user.email || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-wedding-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <StyledLoading />;
  }

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({ title: "", image: "", price: 0 });
  };

  const handleEdit = (gift: Gift & { firestoreId: string }) => {
    setEditingId(gift.firestoreId);
    setFormData(gift);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image || formData.price === undefined || formData.price === 0) {
      showToast("Por favor, preencha todos os campos", "error");
      return;
    }

    setSaving(true);
    try {
      if (isAddingNew) {
        const docRef = await addDoc(collection(db, "gifts"), {
          title: formData.title,
          image: formData.image,
          price: Number(formData.price),
          id: Math.max(...gifts.map(g => g.id || 0), 0) + 1,
        });
        setGifts([
          ...gifts,
          {
            id: Math.max(...gifts.map(g => g.id || 0), 0) + 1,
            title: formData.title,
            image: formData.image,
            price: Number(formData.price),
            firestoreId: docRef.id,
          },
        ]);
        setIsAddingNew(false);
        showToast("✨ Presente adicionado com sucesso!", "success");
      } else if (editingId !== null) {
        const giftDoc = doc(db, "gifts", editingId);
        await updateDoc(giftDoc, {
          title: formData.title,
          image: formData.image,
          price: Number(formData.price),
        });
        setGifts(
          gifts.map(gift =>
            gift.firestoreId === editingId
              ? { ...gift, ...formData, price: Number(formData.price) }
              : gift
          )
        );
        setEditingId(null);
        showToast("✏️ Presente atualizado com sucesso!", "success");
      }

      setFormData({ title: "", image: "", price: 0 });
    } catch (error) {
      console.error("Erro ao salvar presente:", error);
      showToast("Erro ao salvar presente", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({ title: "", image: "", price: 0 });
  };

  const handleDeleteClick = (firestoreId: string, title: string) => {
    setGiftToDelete({ id: firestoreId, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!giftToDelete) return;

    try {
      await deleteDoc(doc(db, "gifts", giftToDelete.id));
      setGifts(gifts.filter(gift => gift.firestoreId !== giftToDelete.id));
      showToast("🗑️ Presente deletado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao deletar presente:", error);
      showToast("Erro ao deletar presente", "error");
    } finally {
      setDeleteModalOpen(false);
      setGiftToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Paginação
  const totalPages = Math.ceil(gifts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGifts = gifts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-50 to-white py-12 px-4 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-wedding-600">Gerenciar Presentes</h1>
            <p className="text-gray-600 mt-2">Total de presentes: {gifts.length}</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={isAddingNew || editingId !== null}
            className="flex items-center gap-3 bg-[#B24C60] hover:bg-[#CE6375] disabled:opacity-50 text-white px-8 py-4 rounded-2xl transition-colors font-semibold text-lg shadow-md border border-[#B24C60] w-full md:w-auto justify-center"
          >
            <Plus size={24} />
            Adicionar Presente
          </button>
        </div>

        {/* Toast */}
        <Toast message={toast.message} type={toast.type} show={toast.show} />

        {/* Modal de Novo/Edição */}
        <GiftModal 
          isOpen={isAddingNew || editingId !== null}
          isEditing={editingId !== null}
          formData={formData}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleInputChange}
          loading={saving}
        />

        {/* Modal de Confirmação de Exclusão */}
        <DeleteConfirmModal 
          isOpen={deleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          giftTitle={giftToDelete?.title || ""}
        />

        {/* Tabela de Presentes */}
        <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden border-2 border-wedding-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b-4 border-wedding-600">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-lg text-wedding-600">ID</th>
                  <th className="px-6 py-4 text-left font-bold text-lg text-wedding-600">Título</th>
                  <th className="px-6 py-4 text-left font-bold text-lg text-wedding-600">Imagem</th>
                  <th className="px-6 py-4 text-left font-bold text-lg text-wedding-600">Preço</th>
                  <th className="px-6 py-4 text-center font-bold text-lg text-wedding-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-wedding-200">
                {paginatedGifts.map((gift, index) => (
                  <tr key={gift.firestoreId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}>
                    <td className="px-6 py-4 font-bold text-gray-900 text-lg">{gift.id}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{gift.title}</td>
                    <td className="px-6 py-4">
                      <img
                        src={gift.image}
                        alt={gift.title}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-wedding-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-bold text-lg">R$ {gift.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-3 justify-center flex-wrap">
                        <button
                          onClick={() => handleEdit(gift)}
                          disabled={isAddingNew || editingId !== null}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(gift.firestoreId, gift.title)}
                          disabled={isAddingNew || editingId !== null}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          <Trash2 size={16} />
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {gifts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Nenhum presente cadastrado</p>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-wedding-600 hover:bg-wedding-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold mx-auto"
              >
                <Plus size={20} />
                Criar Primeiro Presente
              </button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-wedding-600 hover:bg-wedding-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold"
            >
              ← Anterior
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-wedding-600 text-white'
                      : 'bg-white border-2 border-wedding-300 text-wedding-600 hover:bg-wedding-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-wedding-600 hover:bg-wedding-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold"
            >
              Próximo →
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button text="Voltar para Home" link="/" />
        </div>
      </div>
    </div>
  );
}
