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

    // Ordenação alfabética case-insensitive (pt-BR)
    const sortByName = (a: ConfirmedGuest, b: ConfirmedGuest) =>
        (a.userName || "").localeCompare(b.userName || "", "pt-BR", { sensitivity: "base" });

    // Agrupar convidados por tipo de pagamento.
    // Uma família é classificada como "pagante" se tiver pelo menos um membro pagante.
    // É classificada como "isenta" apenas se TODOS os membros forem cortesia.
    // Convidados antigos sem familyMembers são considerados pagantes por padrão.
    const guestsWhoPay = guests
        .filter((guest) => {
            if (guest.familyMembers && guest.familyMembers.length > 0) {
                return guest.familyMembers.some((m) => m.paymentType === "paying");
            }
            return true;
        })
        .sort(sortByName);

    const guestsDontPay = guests
        .filter((guest) => {
            if (guest.familyMembers && guest.familyMembers.length > 0) {
                return guest.familyMembers.every((m) => m.paymentType === "courtesy");
            }
            return false;
        })
        .sort(sortByName);

    // Contagens reais em PESSOAS (não em grupos/famílias)
    const countMembers = (list: ConfirmedGuest[]) =>
        list.reduce((sum, g) => {
            if (g.familyMembers && g.familyMembers.length > 0) {
                return sum + g.familyMembers.length;
            }
            return sum + (g.guestsCount || 0);
        }, 0);

    const countPayingMembers = (list: ConfirmedGuest[]) =>
        list.reduce((sum, g) => {
            if (g.familyMembers && g.familyMembers.length > 0) {
                return sum + g.familyMembers.filter((m) => m.paymentType === "paying").length;
            }
            return sum + (g.guestsCount || 0);
        }, 0);

    const countCourtesyMembers = (list: ConfirmedGuest[]) =>
        list.reduce((sum, g) => {
            if (g.familyMembers && g.familyMembers.length > 0) {
                return sum + g.familyMembers.filter((m) => m.paymentType === "courtesy").length;
            }
            return sum;
        }, 0);

    const countPaidMembers = (list: ConfirmedGuest[]) =>
        list.reduce((sum, g) => {
            if (g.familyMembers && g.familyMembers.length > 0) {
                return (
                    sum +
                    g.familyMembers.filter(
                        (m) => m.paymentType === "paying" && m.paymentStatus === "paid"
                    ).length
                );
            }
            return sum;
        }, 0);

    const countPendingMembers = (list: ConfirmedGuest[]) =>
        list.reduce((sum, g) => {
            if (g.familyMembers && g.familyMembers.length > 0) {
                return (
                    sum +
                    g.familyMembers.filter(
                        (m) => m.paymentType === "paying" && m.paymentStatus === "pending"
                    ).length
                );
            }
            // Convidados antigos sem familyMembers: considerados pagantes pendentes
            return sum + (g.guestsCount || 0);
        }, 0);

    // Totais por seção (em PESSOAS)
    const payingSectionPayingPeople = countPayingMembers(guestsWhoPay);
    const payingSectionCourtesyPeople = countCourtesyMembers(guestsWhoPay);
    const payingSectionPaid = countPaidMembers(guestsWhoPay);
    const payingSectionPending = countPendingMembers(guestsWhoPay);

    const courtesySectionPeople = countMembers(guestsDontPay);

    // Totais globais (devem fechar com o total geral)
    const totalPayingPeople = payingSectionPayingPeople; // todos os pagantes (vivem só na seção pagantes)
    const totalCourtesyPeople = payingSectionCourtesyPeople + courtesySectionPeople;
    const totalPaidPeople = payingSectionPaid;
    const totalPendingPeople = payingSectionPending;

    // ---------- Listagem plana (uma linha por PESSOA, ordem alfabética) ----------
    type FlatPerson = {
        key: string;
        name: string;
        paymentType: "paying" | "courtesy";
        paymentStatus: "paid" | "pending" | "not-required";
        guestId: string;
    };

    const allPeople: FlatPerson[] = [];
    guests.forEach((g) => {
        if (g.familyMembers && g.familyMembers.length > 0) {
            g.familyMembers.forEach((m, idx) => {
                allPeople.push({
                    key: `${g.id}-${idx}`,
                    name: m.name,
                    paymentType: m.paymentType,
                    paymentStatus: m.paymentStatus,
                    guestId: g.id,
                });
            });
        } else {
            // Legados sem familyMembers: titular + acompanhantes, todos pagantes pendentes
            allPeople.push({
                key: `${g.id}-head`,
                name: g.userName,
                paymentType: "paying",
                paymentStatus: "pending",
                guestId: g.id,
            });
            (g.otherGuests || []).forEach((n, idx) => {
                allPeople.push({
                    key: `${g.id}-other-${idx}`,
                    name: n,
                    paymentType: "paying",
                    paymentStatus: "pending",
                    guestId: g.id,
                });
            });
        }
    });

    const sortPeople = (a: FlatPerson, b: FlatPerson) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });

    const payingPeople = allPeople
        .filter((p) => p.paymentType === "paying")
        .sort(sortPeople);

    const courtesyPeople = allPeople
        .filter((p) => p.paymentType === "courtesy")
        .sort(sortPeople);

    const handlePrint = () => {
        if (!printRef.current) return;

        // CSS aplicado dentro do iframe de impressão (sem @media print,
        // pois o iframe inteiro JÁ É o conteúdo impresso).
        const printCss = `
      @page {
        margin: 0.5in;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: white;
        color: #333;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .section {
        page-break-inside: auto;
        break-inside: auto;
        margin: 0 0 24px 0;
      }

      .section.section-break {
        page-break-before: always;
        break-before: page;
        margin-top: 0;
        padding-top: 0;
      }

      .guest-item-wrapper {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .section-title {
        page-break-after: avoid;
        break-after: avoid;
        background: linear-gradient(135deg, #B24C60 0%, #CE6375 100%);
        color: white;
        padding: 12px 16px;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 16px;
        border-radius: 4px;
      }

      h1 {
        text-align: center;
        color: #333;
        margin: 0 0 30px 0;
        font-size: 28px;
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
        position: relative;
      }

      .checkbox.checked {
        background: #B24C60;
      }

      .checkbox.checked::after {
        content: '✓';
        color: white;
        position: absolute;
        top: -3px;
        left: 1px;
        font-weight: bold;
      }

      .guest-info { flex-grow: 1; }
      .guest-name { font-weight: 500; color: #333; margin-bottom: 4px; }
      .guest-details { font-size: 12px; color: #666; }

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

      .family-member:last-child { margin-bottom: 0; }

      .member-status {
        display: inline-block;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        margin-left: 4px;
        font-weight: bold;
      }

      .member-status.paid { background: #d4edda; color: #155724; }
      .member-status.pending { background: #fff3cd; color: #856404; }
      .member-status.courtesy { background: #cce5ff; color: #004085; }

      .summary {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        margin-top: 20px;
        font-size: 14px;
        page-break-inside: avoid;
        break-inside: avoid;
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

      .summary-label { font-weight: 500; color: #333; }
      .summary-value { font-weight: bold; color: #B24C60; }
    `;

        // Cria um iframe oculto, escreve só o conteúdo a imprimir e chama print() dele.
        // Isso evita que o restante da página gere páginas em branco.
        const iframe = document.createElement("iframe");
        iframe.setAttribute("aria-hidden", "true");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument;
        if (!doc) {
            document.body.removeChild(iframe);
            return;
        }

        doc.open();
        doc.write(`<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Lista de Convidados</title>
    <style>${printCss}</style>
  </head>
  <body>${printRef.current.innerHTML}</body>
</html>`);
        doc.close();

        const cleanup = () => {
            // Remove o iframe após a impressão.
            setTimeout(() => {
                if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
            }, 500);
        };

        const triggerPrint = () => {
            try {
                const win = iframe.contentWindow;
                if (!win) {
                    cleanup();
                    return;
                }
                win.focus();
                win.onafterprint = cleanup;
                win.print();
            } catch (err) {
                console.error("Erro ao imprimir:", err);
                cleanup();
            }
        };

        // Garante que o conteúdo do iframe esteja totalmente carregado antes de imprimir.
        if (doc.readyState === "complete") {
            triggerPrint();
        } else {
            iframe.onload = triggerPrint;
        }
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

                        {/* Convidados pagantes — lista plana em ordem alfabética */}
                        {payingPeople.length > 0 && (
                            <div className="section">
                                <div className="section-title">
                                    ✓ Convidados Pagantes ({payingPeople.length})
                                </div>
                                <div className="guest-list">
                                    {payingPeople.map((person) => {
                                        const statusLabel =
                                            person.paymentStatus === "paid"
                                                ? "Pago"
                                                : person.paymentStatus === "pending"
                                                    ? "Pendente"
                                                    : "Isento";
                                        const statusClass =
                                            person.paymentStatus === "paid"
                                                ? "paid"
                                                : person.paymentStatus === "pending"
                                                    ? "pending"
                                                    : "courtesy";

                                        return (
                                            <div key={person.key} className="guest-item-wrapper">
                                                <div
                                                    className="guest-item cursor-pointer hover:bg-wedding-50 transition-colors"
                                                    onClick={() => onToggleGuest(person.guestId)}
                                                >
                                                    <div
                                                        className={`checkbox ${selectedGuests.has(person.guestId) ? "checked" : ""
                                                            }`}
                                                    />
                                                    <div className="guest-info">
                                                        <div className="guest-name">
                                                            {person.name}
                                                            <span className={`member-status ${statusClass}`}>
                                                                {statusLabel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Convidados de cortesia — lista plana em ordem alfabética */}
                        {courtesyPeople.length > 0 && (
                            <div className={`section ${payingPeople.length > 0 ? "section-break" : ""}`}>
                                <div className="section-title">
                                    ◆ Convidados sem Pagamento ({courtesyPeople.length})
                                </div>
                                <div className="guest-list">
                                    {courtesyPeople.map((person) => (
                                        <div key={person.key} className="guest-item-wrapper">
                                            <div
                                                className="guest-item cursor-pointer hover:bg-amber-50 transition-colors"
                                                onClick={() => onToggleGuest(person.guestId)}
                                            >
                                                <div
                                                    className={`checkbox ${selectedGuests.has(person.guestId) ? "checked" : ""
                                                        }`}
                                                />
                                                <div className="guest-info">
                                                    <div className="guest-name">
                                                        {person.name}
                                                        <span className="member-status courtesy">Isento</span>
                                                    </div>
                                                </div>
                                            </div>
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
                                <span className="summary-label">Pagantes (pessoas):</span>
                                <span className="summary-value">{totalPayingPeople}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">— já pagaram:</span>
                                <span className="summary-value">{totalPaidPeople}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">— pendentes:</span>
                                <span className="summary-value">{totalPendingPeople}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Isentos / cortesia (pessoas):</span>
                                <span className="summary-value">{totalCourtesyPeople}</span>
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
