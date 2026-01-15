import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import Button from "../Button/Button";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

type AddManualGuestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    adminEmail: string,
    guestName: string,
    guestsCount: number,
    guestNames: string[]
  ) => void;
};

export function AddManualGuestModal({
  isOpen,
  onClose,
  onConfirm,
}: AddManualGuestModalProps) {
  const [adminEmail, setAdminEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [noExtraGuests, setNoExtraGuests] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setAdminEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

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
    onConfirm(adminEmail, guestName, guestsCount + 1, [guestName, ...guestNames]);
    handleClose();
  };

  const handleClose = () => {
    setGuestName("");
    setGuestsCount(1);
    setGuestNames([""]);
    setNoExtraGuests(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "p-8 rounded-2xl shadow-2xl",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirm();
        }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B24C60]/50"></div>
            <svg className="w-8 h-8 text-[#B24C60]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B24C60]/50"></div>
          </div>
          <h2 className="text-3xl font-bold text-[#B24C60]">
            Adicionar Convidado Manualmente
          </h2>
          <p className="text-gray-500 text-sm mt-2">Preencha os dados do convidado</p>
        </div>

        <div className="space-y-4">
          {/* Admin email */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-gray-800 font-semibold mb-2"
            >
              Adicionado por (Admin)
            </label>
            <input
              id="admin-email"
              type="email"
              value={adminEmail}
              disabled
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Este convidado não será contabilizado na contagem total</p>
          </div>

          {/* Guest name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-800 font-semibold mb-2"
            >
              Nome do convidado
            </label>
            <input
              id="name"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Nome completo"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60] transition-all"
            />
          </div>

          {/* Number of guests */}
          <div className="w-full">
            <label
              htmlFor="guests"
              className="block text-gray-800 font-semibold mb-3 text-lg"
            >
              Quantas pessoas vão na festa com ele(a)?
            </label>

            <div className="flex items-center space-x-3 w-full justify-between">
              <input
                id="guests"
                type="number"
                min={1}
                max={10}
                value={guestsCount}
                disabled={noExtraGuests}
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
                      setGuestsCount(0);
                      setGuestNames([""]);
                    }
                  }}
                />
                <span>Não vai levar ninguém</span>
              </label>
            </div>
          </div>

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
                    required={guestsCount > 0}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60] transition-all"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleClose}
            text="Cancelar"
            variant="secondary"
          />
          <Button type="submit" text="Adicionar Convidado" />
        </div>
      </form>
    </Dialog>
  );
}
