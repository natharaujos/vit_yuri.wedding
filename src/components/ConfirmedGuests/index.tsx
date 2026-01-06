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
import { Trash2 } from "lucide-react";

interface ConfirmedGuest {
  id: string;
  userName: string;
  userEmail: string;
  guestsCount: number;
  confirmedAt: Timestamp;
  status: "confirmed" | "canceled";
  otherGuests?: string[];
}

export function ConfirmedGuests() {
  const [guests, setGuests] = useState<ConfirmedGuest[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // controle do modal de confirmação
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

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
      await deleteDoc(doc(db, "presenceConfirmations", selectedGuestId));
      setGuests((prev) => prev.filter((g) => g.id !== selectedGuestId));
      setTotalGuests(
        (prev) =>
          prev -
          (guests.find((g) => g.id === selectedGuestId)?.guestsCount || 0)
      );
    } catch (error) {
      console.error("Erro ao excluir confirmação:", error);
    } finally {
      setConfirmOpen(false);
      setSelectedGuestId(null);
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
        <p className="text-center text-lg font-medium text-gray-700">
          Total de Convidados Confirmados:
          <span className="text-3xl font-bold text-wedding-600 ml-3 block mt-2">{totalGuests}</span>
        </p>
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
                <p className="text-sm text-gray-600 mb-2">
                  {guest.userEmail}
                </p>
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
    </section>
  );
}
