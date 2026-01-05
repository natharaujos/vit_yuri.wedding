import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

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
        className: "p-6 rounded-lg",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          handleConfirm();
        }}
      >
        <div className="text-2xl font-bold text-[#D4AF7F] text-center mb-6">
          Confirmação de Presença
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-gray-700 font-medium">Seu e-mail:</span>
            <p className="text-[#D4AF7F] mt-1">{userEmail}</p>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF7F] mx-auto"></div>
            </div>
          ) : alreadyConfirmed ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
              Você já confirmou sua presença anteriormente.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Number of guests */}
              <div className="w-full">
                <label
                  htmlFor="guests"
                  className="block text-gray-700 font-medium mb-2"
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
                    className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF7F] focus:border-[#D4AF7F] disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF7F] focus:border-[#D4AF7F]"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF7F] focus:border-[#D4AF7F]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            {alreadyConfirmed ? "Fechar" : "Cancelar"}
          </button>
          {!alreadyConfirmed && (
            <button
              type="submit" // ✅ now handled by the form
              className="px-4 py-2 text-white bg-[#D4AF7F] rounded-md hover:bg-[#F4D4C1] transition-colors duration-200 cursor-pointer"
            >
              Confirmar Presença
            </button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
