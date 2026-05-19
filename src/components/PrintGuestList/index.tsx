import { useRef } from "react";
import { Printer, X } from "lucide-react";
import { Dialog } from "@mui/material";
import type { ConfirmedGuest } from "../ConfirmedGuests";

interface PrintGuestListProps {
    isOpen: boolean;
    onClose: () => void;
    guests: ConfirmedGuest[];
    selectedGuests: Set<string>;
    onToggleGuest: (guestId: string) => void;
}

export function PrintGuestListModal({
    isOpen,
    onClose,
    guests,
    selectedGuests,
    onToggleGuest,
}: PrintGuestListProps) {
    const printRef = useRef<HTMLDivElement>(null);

    // Agrupar convidados por tipo de pagamento
    const guestsWhoPay = guests.filter((guest) => {
        if (guest.familyMembers && guest.familyMembers.length > 0) {
            return guest.familyMembers.some((m) => m.paymentType === "paying");
        }
        return true; // Convidados sem familyMembers são considerados pagantes por padrão
    });

    const guestsDontPay = guests.filter((guest) => {
        if (guest.familyMembers && guest.familyMembers.length > 0) {
            return guest.familyMembers.every((m) => m.paymentType === "courtesy");
        }
        return false;
    });

    const handlePrint = () => {
    if (!printRef.current) return;

    // Criar estilo para impressão que mantém só o conteúdo formatado
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        * {
          visibility: hidden;
        }
        
        .print-content-wrapper,
        .print-content-wrapper * {
          visibility: visible;
        }
        
        .print-content-wrapper {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        
        @page {
          margin: 0.5in;
        }
        
        .page-break-before {
          page-break-before: always;
          margin-top: 0;
          padding-top: 20px;
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
          font-size: 28px;
          margin-top: 0;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section-title {
          background: linear-gradient(135deg, #B24C60 0%, #CE6375 100%);
          color: white;
          padding: 12px 16px;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 16px;
          border-radius: 4px;
        }
        
        .guest-list {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .guest-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          background: #fafafa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .guest-item:last-child {
          border-bottom: none;
        }
        
        .checkbox {
          width: 18px;
          height: 18px;
          margin-right: 12px;
          border: 2px solid #B24C60;
          border-radius: 3px;
          flex-shrink: 0;
        }
        
        .checkbox.checked {
          background: #B24C60;
          position: relative;
        }
        
        .checkbox.checked::after {
          content: '✓';
          color: white;
          position: absolute;
          top: -3px;
          left: 1px;
          font-weight: bold;
        }
        
        .guest-info {
          flex-grow: 1;
        }
        
        .guest-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
        .guest-details {
          font-size: 12px;
          color: #666;
        }
        
        .family-members {
          margin-left: 30px;
          margin-top: 8px;
          padding: 8px 12px;
          background: white;
          border-left: 3px solid #B24C60;
          border-radius: 2px;
        }
        
        .family-member {
          font-size: 12px;
          color: #555;
          margin-bottom: 4px;
          padding-left: 8px;
        }
        
        .family-member:last-child {
          margin-bottom: 0;
        }
        
        .member-status {
          display: inline-block;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
          margin-left: 4px;
          font-weight: bold;
        }
        
        .member-status.paid {
          background: #d4edda;
          color: #155724;
        }
        
        .member-status.pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .member-status.courtesy {
          background: #cce5ff;
          color: #004085;
        }
        
        .summary {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 4px;
          margin-top: 20px;
          font-size: 14px;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ddd;
        }
        
        .summary-item:last-child {
          margin-bottom: 0;
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .summary-label {
          font-weight: 500;
          color: #333;
        }
        
        .summary-value {
          font-weight: bold;
          color: #B24C60;
        }
      }
    `;
    document.head.appendChild(style);

    // Adicionar classe ao printRef para identificar na impressão
    printRef.current.classList.add('print-content-wrapper');

    // Imprimir
    setTimeout(() => {
      window.print();
      // Limpar após impressão
      setTimeout(() => {
        printRef.current?.classList.remove('print-content-wrapper');
            }, 100);
        }, 100);
    };

    const selectedCount = selectedGuests.size;
    const totalGuests = guests.reduce((sum, g) => sum + g.guestsCount, 0);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "rounded-2xl",
            }}
        >
            <div className="p-6 flex flex-col h-screen max-h-96">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-wedding-600">
                        Listar para Impressão
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Preview area - scrollable */}
                <div className="mb-6 flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div ref={printRef} className="bg-white p-4">
                        <h1 className="text-2xl font-bold text-center mb-6">
                            Lista de Convidados
                        </h1>

                        {/* Convidados que pagam */}
                        {guestsWhoPay.length > 0 && (
                            <div className="section">
                                <div className="section-title">
                                    ✓ Convidados Pagantes ({guestsWhoPay.length})
                                </div>
                                <div className="guest-list">
                                    {guestsWhoPay.map((guest) => (
                                        <div key={guest.id}>
                                            <div
                                                className="guest-item cursor-pointer hover:bg-wedding-50 transition-colors"
                                                onClick={() => onToggleGuest(guest.id)}
                                            >
                                                <div
                                                    className={`checkbox ${selectedGuests.has(guest.id) ? "checked" : ""
                                                        }`}
                                                />
                                                <div className="guest-info">
                                                    <div className="guest-name">{guest.userName}</div>
                                                    <div className="guest-details">
                                                        {guest.guestsCount}{" "}
                                                        {guest.guestsCount === 1 ? "pessoa" : "pessoas"}
                                                        {!guest.addedByAdmin && (
                                                            <> • {guest.userEmail}</>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Family members if any */}
                                            {guest.familyMembers && guest.familyMembers.length > 0 && (
                                                <div className="family-members">
                                                    {guest.familyMembers.map((member, idx) => {
                                                        const statusMap = {
                                                            paid: "Pago",
                                                            pending: "Pendente",
                                                            "not-required": "Isento",
                                                        };

                                                        return (
                                                            <div key={idx} className="family-member">
                                                                • {member.name}
                                                                <span
                                                                    className={`member-status ${member.paymentStatus === "paid"
                                                                            ? "paid"
                                                                            : member.paymentStatus === "pending"
                                                                                ? "pending"
                                                                                : "courtesy"
                                                                        }`}
                                                                >
                                                                    {statusMap[member.paymentStatus]}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Convidados que não pagam */}
                        {guestsDontPay.length > 0 && (
                            <div className="section page-break-before">
                                <div className="section-title">
                                    ◆ Convidados sem Pagamento ({guestsDontPay.length})
                                </div>
                                <div className="guest-list">
                                    {guestsDontPay.map((guest) => (
                                        <div key={guest.id}>
                                            <div
                                                className="guest-item cursor-pointer hover:bg-amber-50 transition-colors"
                                                onClick={() => onToggleGuest(guest.id)}
                                            >
                                                <div
                                                    className={`checkbox ${selectedGuests.has(guest.id) ? "checked" : ""
                                                        }`}
                                                />
                                                <div className="guest-info">
                                                    <div className="guest-name">{guest.userName}</div>
                                                    <div className="guest-details">
                                                        {guest.guestsCount}{" "}
                                                        {guest.guestsCount === 1 ? "pessoa" : "pessoas"}
                                                        {!guest.addedByAdmin && (
                                                            <> • {guest.userEmail}</>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Family members if any */}
                                            {guest.familyMembers && guest.familyMembers.length > 0 && (
                                                <div className="family-members">
                                                    {guest.familyMembers.map((member, idx) => {
                                                        const statusMap = {
                                                            paid: "Pago",
                                                            pending: "Pendente",
                                                            "not-required": "Isento",
                                                        };

                                                        return (
                                                            <div key={idx} className="family-member">
                                                                • {member.name}
                                                                <span
                                                                    className={`member-status ${member.paymentStatus === "paid"
                                                                            ? "paid"
                                                                            : member.paymentStatus === "pending"
                                                                                ? "pending"
                                                                                : "courtesy"
                                                                        }`}
                                                                >
                                                                    {statusMap[member.paymentStatus]}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="summary">
                            <div className="summary-item">
                                <span className="summary-label">Total de convidados:</span>
                                <span className="summary-value">{totalGuests}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">
                                    Convidados pagantes:
                                </span>
                                <span className="summary-value">{guestsWhoPay.length}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Convidados isentos:</span>
                                <span className="summary-value">{guestsDontPay.length}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Marcados para impressão:</span>
                                <span className="summary-value">{selectedCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons - fixed at bottom */}
                <div className="flex gap-3 border-t border-gray-200 pt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#B24C60] text-white font-semibold rounded-lg hover:bg-[#CE6375] transition-colors"
                    >
                        <Printer size={20} />
                        Imprimir
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
