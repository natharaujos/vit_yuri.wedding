import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../firebase"; // certifique-se de exportar auth no seu firebase.ts
import { Dialog } from "@mui/material";
import admins from "../../constants/admins";
import Button from "../Button/Button";
import { Trash2, UserPlus } from "lucide-react";
import { AddManualGuestModal } from "../AddManualGuest";
import type { ManualGuestMemberInput } from "../AddManualGuest";
import { saveManualPresenceConfirmation } from "../../services/saveManualPresenceConfirmation";
import type { FamilyMemberPayment, PaymentStatus } from "../../types/presence";

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
  familyMembers?: FamilyMemberPayment[];
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
    members: ManualGuestMemberInput[]
  ) => {
    try {
      const primaryGuest = members[0]?.name?.trim();
      if (!primaryGuest) {
        return;
      }

      const familyMembers: FamilyMemberPayment[] = members.map((member) => ({
        name: member.name.trim(),
        paymentType: member.paymentType,
        paymentStatus:
          member.paymentType === "courtesy"
            ? "not-required"
            : member.hasPaid
              ? "paid"
              : "pending",
      }));

      // Gera um email único para o convidado manual baseado no nome e timestamp
      const uniqueEmail = `manual_${primaryGuest.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}@manual.guest`;
      
      await saveManualPresenceConfirmation({
        userName: primaryGuest,
        userEmail: uniqueEmail,
        adminEmail: adminEmail,
        guestsCount: familyMembers.length,
        confirmedAt: new Date(),
        otherGuests: familyMembers.slice(1).map((member) => member.name),
        status: "confirmed",
        addedByAdmin: true,
        familyMembers,
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

  const handleManualMemberPaymentToggle = async (
    guestId: string,
    memberIndex: number,
    isPaid: boolean
  ) => {
    const guest = guests.find((item) => item.id === guestId);
    const currentMembers = guest?.familyMembers;

    if (!guest || !currentMembers || !currentMembers[memberIndex]) {
      return;
    }

    const member = currentMembers[memberIndex];
    if (member.paymentType !== "paying") {
      return;
    }

    const updatedMembers: FamilyMemberPayment[] = currentMembers.map((item, index) => {
      if (index !== memberIndex) return item;

      return {
        ...item,
        paymentStatus: (isPaid ? "paid" : "pending") as PaymentStatus,
      };
    });

    try {
      await updateDoc(doc(db, "presenceConfirmations", guestId), {
        familyMembers: updatedMembers,
      });

      setGuests((prev) =>
        prev.map((item) =>
          item.id === guestId ? { ...item, familyMembers: updatedMembers } : item
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status de pagamento:", error);
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
    <section className="max-w-4xl mx-auto px-3 sm:px-4 pt-20 pb-10 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-wedding-500 text-center mb-6 sm:mb-8">
        Presenças Confirmadas
      </h2>

      <div className="bg-gradient-to-r from-white to-wedding-50 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-wedding-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-lg font-medium text-gray-700 sm:flex-1">
            Total de Convidados Confirmados:
            <span className="text-3xl font-bold text-wedding-600 ml-3 block mt-2">{totalGuests}</span>
          </p>
          
          {isAdmin && (
            <button
              onClick={() => setAddManualGuestOpen(true)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 bg-[#B24C60] text-white font-semibold rounded-2xl shadow-md border border-[#B24C60] hover:bg-[#CE6375] transition duration-300 ease-in-out cursor-pointer"
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
            className="bg-gradient-to-r from-white to-wedding-50/30 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-5 relative border border-wedding-100"
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

                {guest.otherGuests &&
                  guest.otherGuests.length > 0 &&
                  !(guest.addedByAdmin && guest.familyMembers && guest.familyMembers.length > 0) && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Acompanhantes:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {guest.otherGuests.map((name, idx) => (
                        <li key={idx}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {guest.addedByAdmin && guest.familyMembers && guest.familyMembers.length > 0 && (
                  <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Controle de pagamento da familia
                    </p>
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-[#B24C60]/10 px-2.5 py-1 font-semibold text-[#B24C60]">
                        Pagantes: {guest.familyMembers.filter((member) => member.paymentType === "paying").length}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-700">
                        Pagos: {guest.familyMembers.filter((member) => member.paymentStatus === "paid").length}
                      </span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-700">
                        Isentos: {guest.familyMembers.filter((member) => member.paymentType === "courtesy").length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {guest.familyMembers.map((member, index) => {
                        const isPaying = member.paymentType === "paying";
                        const isPaid = member.paymentStatus === "paid";

                        return (
                          <div
                            key={`${guest.id}-member-${index}`}
                            className="grid grid-cols-1 gap-2 rounded-md border border-gray-200 bg-white p-2.5 sm:p-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-medium text-gray-700">{member.name}</p>
                              <p className="text-xs text-gray-500">
                                {isPaying ? "Convidado pagante" : "Convidado isento (gratuidade)"}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  isPaying
                                    ? "bg-[#B24C60]/10 text-[#B24C60]"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {isPaying ? "Pagante" : "Gratuidade"}
                              </span>

                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  member.paymentStatus === "paid"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : member.paymentStatus === "pending"
                                      ? "bg-slate-100 text-slate-700"
                                      : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {member.paymentStatus === "paid"
                                  ? "Pago"
                                  : member.paymentStatus === "pending"
                                    ? "Pendente"
                                    : "Isento"}
                              </span>

                              {isPaying ? (
                                <button
                                  type="button"
                                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    isPaid
                                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                                  }`}
                                  onClick={() =>
                                    handleManualMemberPaymentToggle(
                                      guest.id,
                                      index,
                                      !isPaid
                                    )
                                  }
                                >
                                  {isPaid ? "Marcar pendente" : "Marcar como pago"}
                                </button>
                              ) : (
                                <span className="text-xs font-semibold text-amber-700">
                                  Isento
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
              <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-3 sm:right-3 text-left sm:text-right">
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
