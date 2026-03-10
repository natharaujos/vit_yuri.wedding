import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import Button from "../Button/Button";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { FamilyMemberPayment } from "../../types/presence";

export interface ManualGuestMemberInput {
  name: string;
  paymentType: "paying" | "courtesy";
  hasPaid: boolean;
}

type AddManualGuestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminEmail: string, members: ManualGuestMemberInput[]) => void;
};

export function AddManualGuestModal({
  isOpen,
  onClose,
  onConfirm,
}: AddManualGuestModalProps) {
  const [adminEmail, setAdminEmail] = useState("");
  const [guestsCountInput, setGuestsCountInput] = useState("1");
  const [members, setMembers] = useState<ManualGuestMemberInput[]>([
    { name: "", paymentType: "paying", hasPaid: false },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setAdminEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGuestsCountChange = (count: number) => {
    const nextCount = Math.min(10, Math.max(1, count));
    setGuestsCountInput(String(nextCount));

    setMembers((prev) => {
      if (nextCount > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: nextCount - prev.length }, () => ({
            name: "",
            paymentType: "paying" as const,
            hasPaid: false,
          })),
        ];
      }

      return prev.slice(0, nextCount);
    });
  };

  const handleMemberChange = (
    index: number,
    field: keyof ManualGuestMemberInput,
    value: string | boolean
  ) => {
    setMembers((prev) =>
      prev.map((member, i) => {
        if (i !== index) return member;

        const updated = {
          ...member,
          [field]: value,
        } as ManualGuestMemberInput;

        if (field === "paymentType" && value === "courtesy") {
          updated.hasPaid = false;
        }

        return updated;
      })
    );
  };

  const buildFamilyMembers = (): FamilyMemberPayment[] => {
    return members.map((member) => {
      const paymentStatus =
        member.paymentType === "courtesy"
          ? "not-required"
          : member.hasPaid
            ? "paid"
            : "pending";

      return {
        name: member.name.trim(),
        paymentType: member.paymentType,
        paymentStatus,
      };
    });
  };

  const hasEmptyNames = members.some((member) => !member.name.trim());

  const handleConfirm = () => {
    if (hasEmptyNames) {
      return;
    }

    onConfirm(adminEmail, members.map((m) => ({ ...m, name: m.name.trim() })));
    handleClose();
  };

  const handleClose = () => {
    setGuestsCountInput("1");
    setMembers([{ name: "", paymentType: "paying", hasPaid: false }]);
    onClose();
  };

  const familyMembersPreview = buildFamilyMembers();
  const payingCount = familyMembersPreview.filter((m) => m.paymentType === "paying").length;
  const paidCount = familyMembersPreview.filter((m) => m.paymentStatus === "paid").length;
  const courtesyCount = familyMembersPreview.filter((m) => m.paymentType === "courtesy").length;

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
          <p className="text-gray-500 text-sm mt-2">Defina quem paga, quem e gratuidade e quem ja quitou</p>
        </div>

        <div className="space-y-4">
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
          </div>

          <div>
            <label
              htmlFor="family-size"
              className="block text-gray-800 font-semibold mb-2"
            >
              Quantas pessoas tem nessa familia?
            </label>
            <input
              id="family-size"
              type="text"
              inputMode="numeric"
              value={guestsCountInput}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setGuestsCountInput(digitsOnly);

                if (digitsOnly === "") {
                  return;
                }

                handleGuestsCountChange(Number(digitsOnly));
              }}
              onBlur={() => {
                if (!guestsCountInput) {
                  handleGuestsCountChange(1);
                  return;
                }

                handleGuestsCountChange(Number(guestsCountInput));
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60] transition-all"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-[#B24C60]/10 text-[#B24C60] font-medium">
                Pagantes: {payingCount}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                Ja pagaram: {paidCount}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                Gratuidade: {courtesyCount}
              </span>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">
                      {index === 0 ? "Pessoa principal" : `Pessoa ${index + 1}`}
                    </p>
                    {member.paymentType === "courtesy" ? (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                        Gratuidade
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#B24C60] bg-[#B24C60]/10 px-2.5 py-1 rounded-full">
                        Pagante
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                    placeholder="Nome completo"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B24C60] focus:border-[#B24C60] transition-all"
                  />

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name={`payment-type-${index}`}
                          checked={member.paymentType === "paying"}
                          onChange={() => handleMemberChange(index, "paymentType", "paying")}
                        />
                        Pagante
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name={`payment-type-${index}`}
                          checked={member.paymentType === "courtesy"}
                          onChange={() => handleMemberChange(index, "paymentType", "courtesy")}
                        />
                        Gratuidade
                      </label>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={member.hasPaid}
                        disabled={member.paymentType === "courtesy"}
                        onChange={(e) => handleMemberChange(index, "hasPaid", e.target.checked)}
                      />
                      {member.paymentType === "courtesy" ? "Nao aplicavel" : "Ja pagou"}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleClose}
            text="Cancelar"
            variant="secondary"
          />
          <Button type="submit" text="Adicionar Familia" />
        </div>
      </form>
    </Dialog>
  );
}
