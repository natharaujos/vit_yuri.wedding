import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from "../Button/Button";

type ConfirmPresenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onConfirm: (guestsCount: number, guestNames: string[]) => void;
};

export function ConfirmPresenceModal({
  isOpen,
  onClose,
  userEmail,
  onConfirm,
}: ConfirmPresenceModalProps) {
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [noExtraGuests, setNoExtraGuests] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    async function checkExistingConfirmation() {
      if (!userEmail) return;

      setLoading(true);
      try {
        const q = query(
          collection(db, "presenceConfirmations"),
          where("userEmail", "==", userEmail)
        );

        const querySnapshot = await getDocs(q);
        setAlreadyConfirmed(!querySnapshot.empty);
      } catch (error) {
        console.error("Erro ao verificar confirmação:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      checkExistingConfirmation();
    }
  }, [userEmail, isOpen]);

  // Handle change in number of guests
  const handleGuestsCountChange = (count: number) => {
    setGuestsCount(count);

    if (count > guestNames.length) {
      setGuestNames([
        ...guestNames,
        ...Array(count - guestNames.length).fill(""),
      ]);
    } else {
      setGuestNames(guestNames.slice(0, count));
    }
  };

  // Handle change in guest name
  const handleNameChange = (index: number, value: string) => {
    const updated = [...guestNames];
    updated[index] = value;
    setGuestNames(updated);
  };

  const handleConfirm = () => {
    if (alreadyConfirmed) return;
    onConfirm(guestsCount + 1, [user?.displayName || "", ...guestNames]);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "p-8 rounded-2xl shadow-2xl",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          handleConfirm();
        }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B24C60]/50"></div>
            <svg className="w-8 h-8 text-[#B24C60]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B24C60]/50"></div>
          </div>
          <h2 className="text-3xl font-bold text-[#B24C60]">
            Confirmação de Presença
          </h2>
          <p className="text-gray-500 text-sm mt-2">Por favor, preencha os dados abaixo</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#F9E8EB] to-[#F3D1D6] p-4 rounded-xl">
            <span className="text-gray-700 font-medium text-sm">Seu e-mail:</span>
            <p className="text-[#B24C60] font-semibold mt-1">{userEmail}</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F3D1D6] border-t-[#B24C60] mx-auto"></div>
              <p className="text-gray-500 mt-4">Carregando...</p>
            </div>
          ) : alreadyConfirmed ? (
            <div className="bg-gradient-to-r from-[#F9E8EB] to-[#F3D1D6] border-2 border-[#B24C60] rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-[#B24C60] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-800 font-semibold">Você já confirmou sua presença anteriormente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Number of guests */}
              <div className="w-full">
                <label
                  htmlFor="guests"
                  className="block text-gray-800 font-semibold mb-3 text-lg"
                >
                  Quantas pessoas vão na festa com você?
                </label>

                <div className="flex items-center space-x-3 w-full justify-between">
                  <input
                    id="guests"
                    type="number"
                    min={1}
                    max={10}
                    value={guestsCount}
                    disabled={noExtraGuests} // disable if checkbox checked
                    onChange={(e) =>
                      handleGuestsCountChange(Number(e.target.value))
                    }
                    className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                  />

                  <label className="flex items-center space-x-2 text-gray-700">
                    <input
                      type="checkbox"
                      checked={noExtraGuests}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNoExtraGuests(checked);
                        if (checked) {
                          setGuestsCount(0); // only the user
                          setGuestNames([""]); // just one input
                        }
                      }}
                    />
                    <span>Não vou levar ninguém</span>
                  </label>
                </div>
              </div>

              <input
                type="text"
                value={user?.displayName || ""}
                required
                disabled
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60] bg-gray-50 font-medium"
              />

              {/* Guest names */}
              {!noExtraGuests && (
                <div className="space-y-2">
                  {guestNames.map((name, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                        placeholder={`Nome do acompanhante ${index + 1}`}
                        required={guestsCount > 0} // ✅ required on each guest
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60] transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            text={alreadyConfirmed ? "Fechar" : "Cancelar"}
            variant="secondary"
          />
          {!alreadyConfirmed && (
            <Button
              type="submit"
              text="Confirmar Presença"
            />
          )}
        </div>
      </form>
    </Dialog>
  );
}
