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
import RemoveButton from "../RemoveButton";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF7F]"></div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-[#D4AF7F] text-center mb-8">
        Presenças Confirmadas
      </h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <p className="text-center text-lg font-medium text-gray-700">
          Total de Convidados Confirmados:
          <span className="text-[#D4AF7F] ml-2">{totalGuests}</span>
        </p>
      </div>

      <div className="grid gap-4">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white rounded-lg shadow p-4 relative"
          >
            <p className="font-medium text-gray-700">
              Confirmação feita por {guest.userName} - {guest.userEmail}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Em:{" "}
              {guest.confirmedAt.toDate().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {guest.otherGuests && guest.otherGuests.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 mb-2">
                {guest.otherGuests.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            )}

            <div className="bg-pink-100 text-pink-600 inline-block px-3 py-1 rounded-full font-medium">
              {guest.guestsCount}{" "}
              {guest.guestsCount === 1 ? "pessoa" : "pessoas"}
            </div>

            {isAdmin && (
              <RemoveButton
                onClick={() => {
                  setSelectedGuestId(guest.id);
                  setConfirmOpen(true);
                }}
              />
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
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Remover
          </button>
        </div>
      </Dialog>
    </section>
  );
}
