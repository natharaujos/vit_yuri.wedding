import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../firebase"; // certifique-se de exportar auth no seu firebase.ts
import { Dialog } from "@mui/material";
import admins from "../../constants/admins";
import Button from "../Button/Button";
import { Trash2, UserPlus } from "lucide-react";
import { AddManualGuestModal } from "../AddManualGuest";
import { saveManualPresenceConfirmation } from "../../services/saveManualPresenceConfirmation";

interface ConfirmedGuest {
  id: string;
  userName: string;
  userEmail: string;
  guestsCount: number;
  confirmedAt: Timestamp;
  status: "confirmed" | "canceled";
  otherGuests?: string[];
  addedByAdmin?: boolean;
  adminEmail?: string;
}

export function ConfirmedGuests() {
  const [guests, setGuests] = useState<ConfirmedGuest[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // controle do modal de confirmação
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  // controle do modal de adicionar convidado manual
  const [addManualGuestOpen, setAddManualGuestOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchConfirmedGuests() {
      try {
        const q = query(collection(db, "presenceConfirmations"));
        const querySnapshot = await getDocs(q);

        const confirmedGuests: ConfirmedGuest[] = [];
        let total = 0;

        querySnapshot.forEach((d) => {
          const data = d.data() as Omit<ConfirmedGuest, "id">;
          confirmedGuests.push({ id: d.id, ...data });
          total += data.guestsCount;
        });

        setGuests(confirmedGuests);
        setTotalGuests(total);
      } catch (error) {
        console.error("Error fetching confirmed guests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConfirmedGuests();
  }, []);

  const handleDelete = async () => {
    if (!selectedGuestId) return;

    try {
      const guestToDelete = guests.find((g) => g.id === selectedGuestId);
      await deleteDoc(doc(db, "presenceConfirmations", selectedGuestId));
      setGuests((prev) => prev.filter((g) => g.id !== selectedGuestId));
      
      if (guestToDelete) {
        setTotalGuests(
          (prev) => prev - (guestToDelete.guestsCount || 0)
        );
      }
    } catch (error) {
      console.error("Erro ao excluir confirmação:", error);
    } finally {
      setConfirmOpen(false);
      setSelectedGuestId(null);
    }
  };

  const handleAddManualGuest = async (
    adminEmail: string,
    guestName: string,
    guestsCount: number,
    guestNames: string[]
  ) => {
    try {
      // Gera um email único para o convidado manual baseado no nome e timestamp
      const uniqueEmail = `manual_${guestName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}@manual.guest`;
      
      await saveManualPresenceConfirmation({
        userName: guestName,
        userEmail: uniqueEmail,
        adminEmail: adminEmail,
        guestsCount: guestsCount,
        confirmedAt: new Date(),
        otherGuests: guestNames.slice(1), // Remove o primeiro nome que é o próprio convidado
        status: "confirmed",
        addedByAdmin: true,
      });

      // Recarregar a lista de convidados
      const q = query(collection(db, "presenceConfirmations"));
      const querySnapshot = await getDocs(q);

      const confirmedGuests: ConfirmedGuest[] = [];
      let total = 0;

      querySnapshot.forEach((d) => {
        const data = d.data() as Omit<ConfirmedGuest, "id">;
        confirmedGuests.push({ id: d.id, ...data });
        total += data.guestsCount;
      });

      setGuests(confirmedGuests);
      setTotalGuests(total);
    } catch (error) {
      console.error("Erro ao adicionar convidado manual:", error);
    }
  };

  const isAdmin = currentUser && admins.includes(currentUser.email || "");

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-500"></div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-wedding-500 text-center mb-8">
        Presenças Confirmadas
      </h2>

      <div className="bg-gradient-to-r from-white to-wedding-50 rounded-xl shadow-lg p-6 mb-8 border border-wedding-200">
        <div className="flex items-center justify-between">
          <p className="text-center text-lg font-medium text-gray-700 flex-1">
            Total de Convidados Confirmados:
            <span className="text-3xl font-bold text-wedding-600 ml-3 block mt-2">{totalGuests}</span>
          </p>
          
          {isAdmin && (
            <button
              onClick={() => setAddManualGuestOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B24C60] text-white font-semibold rounded-2xl shadow-md border border-[#B24C60] hover:bg-[#CE6375] transition duration-300 ease-in-out cursor-pointer"
            >
              <UserPlus size={20} />
              Adicionar Convidado
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="bg-gradient-to-r from-white to-wedding-50/30 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 relative border border-wedding-100"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-1">
                  {guest.userName}
                </p>
                {!guest.addedByAdmin && (
                  <p className="text-sm text-gray-600 mb-2">
                    {guest.userEmail}
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-3">
                  Confirmado em:{" "}
                  {guest.confirmedAt.toDate().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {guest.otherGuests && guest.otherGuests.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Acompanhantes:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {guest.otherGuests.map((name, idx) => (
                        <li key={idx}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-gradient-to-r from-wedding-100 to-wedding-200 text-wedding-700 inline-block px-4 py-1.5 rounded-full font-semibold text-sm shadow-sm">
                  {guest.guestsCount}{" "}
                  {guest.guestsCount === 1 ? "pessoa" : "pessoas"}
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    setSelectedGuestId(guest.id);
                    setConfirmOpen(true);
                  }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer"
                  title="Remover confirmação"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            
            {guest.addedByAdmin && guest.adminEmail && (
              <div className="absolute bottom-3 right-3 text-right">
                <p className="text-xs font-medium text-wedding-600 mb-0.5">
                  ✨ Adicionado por Administrador
                </p>
                <p className="text-xs text-wedding-500">
                  {guest.adminEmail}
                </p>
              </div>
            )}
          </div>
        ))}

        {guests.length === 0 && (
          <p className="text-center text-gray-500">
            Nenhuma presença confirmada ainda.
          </p>
        )}
      </div>

      {/* 🔥 Modal de confirmação */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: "p-6 rounded-lg",
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Confirmar exclusão
        </h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja remover esta confirmação? Esta ação não pode
          ser desfeita.
        </p>

        <div className="flex justify-end space-x-3">
          <Button
            text="Cancelar"
            onClick={() => setConfirmOpen(false)}
            variant="secondary"
          />
          <Button
            text="Remover"
            onClick={handleDelete}
          />
        </div>
      </Dialog>

      {/* Modal de adicionar convidado manual */}
      <AddManualGuestModal
        isOpen={addManualGuestOpen}
        onClose={() => setAddManualGuestOpen(false)}
        onConfirm={handleAddManualGuest}
      />
    </section>
  );
}
