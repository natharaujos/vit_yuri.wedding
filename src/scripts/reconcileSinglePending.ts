import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

type PaymentItem = {
  giftId?: string;
  quantity?: number;
  title?: string;
  totalPrice?: number;
  unitPrice?: number;
};

type PaymentDoc = {
  amount?: number;
  buyerEmail?: string;
  buyerName?: string;
  createdAt?: Timestamp | { seconds?: number };
  giftId?: string;
  giftIds?: string[];
  giftTitle?: string;
  items?: PaymentItem[];
  mpPaymentId?: string;
  quantity?: number;
  status?: string;
};

type MercadoPagoPayment = {
  id?: number | string;
  status?: string;
  external_reference?: string;
};

const VY_API = "https://vy-backend.vercel.app";

const firebaseConfig = {
  apiKey: "AIzaSyCrzd6Llc21YyNwvmYYLweW5A5C_YlhH-Q",
  authDomain: "vitoriayuricasamento.firebaseapp.com",
  projectId: "vitoriayuricasamento",
  storageBucket: "vitoriayuricasamento.firebasestorage.app",
  messagingSenderId: "969563058642",
  appId: "1:969563058642:web:47a1dbf71c87bab912980b",
  measurementId: "G-SDCWJXJ824",
};

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function normalizeText(value: unknown): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function amountsMatch(a: unknown, b: number): boolean {
  return Math.abs(Number(a) - Number(b)) < 0.01;
}

function formatCreatedAt(value: PaymentDoc["createdAt"]): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value?.seconds) {
    return new Date(value.seconds * 1000).toISOString();
  }
  return "n/a";
}

function extractGiftIds(paymentData: PaymentDoc): string[] {
  if (Array.isArray(paymentData.giftIds) && paymentData.giftIds.length > 0) {
    return paymentData.giftIds;
  }

  if (paymentData.giftId) {
    return [paymentData.giftId];
  }

  if (Array.isArray(paymentData.items)) {
    return paymentData.items
      .map((item) => item?.giftId)
      .filter((giftId): giftId is string => Boolean(giftId));
  }

  return [];
}

async function checkStatusViaApi(paymentId: string): Promise<string> {
  const response = await fetch(
    `${VY_API}/api/payments/checkStatus?paymentId=${encodeURIComponent(paymentId)}`,
  );

  if (!response.ok) {
    throw new Error(`Falha no checkStatus: ${response.status}`);
  }

  const status = await response.json();
  return String(status);
}

async function getMercadoPagoPayment(
  paymentId: string,
  mpToken: string,
): Promise<MercadoPagoPayment> {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${mpToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Falha ao consultar MP payment ${paymentId}: ${response.status}`,
    );
  }

  return (await response.json()) as MercadoPagoPayment;
}

async function searchMercadoPagoByExternalReference(
  externalReference: string,
  mpToken: string,
): Promise<MercadoPagoPayment | null> {
  const url = new URL("https://api.mercadopago.com/v1/payments/search");
  url.searchParams.set("external_reference", externalReference);
  url.searchParams.set("sort", "date_created");
  url.searchParams.set("criteria", "desc");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${mpToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao buscar MP por external_reference=${externalReference}: ${response.status}`,
    );
  }

  const payload = (await response.json()) as { results?: MercadoPagoPayment[] };
  const first = Array.isArray(payload.results) ? payload.results[0] : null;
  return first || null;
}

async function main(): Promise<void> {
  const paymentDocId = getArg("--paymentDocId");
  const giftTitle = getArg("--giftTitle");
  const buyerEmail = getArg("--buyerEmail");
  const amountArg = getArg("--amount");
  const mpToken =
    getArg("--mpToken") || process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
  const dryRun = hasFlag("--dryRun");

  if (!paymentDocId && (!giftTitle || !buyerEmail || !amountArg)) {
    console.error(
      "Uso por id: tsx src/scripts/reconcileSinglePending.ts --paymentDocId <id> [--dryRun] [--mpToken <token>]",
    );
    console.error(
      'Uso por filtros: tsx src/scripts/reconcileSinglePending.ts --giftTitle "..." --buyerEmail "..." --amount 63.99 [--dryRun] [--mpToken <token>]',
    );
    process.exit(1);
  }

  const amount = amountArg
    ? Number(String(amountArg).replace(",", "."))
    : undefined;
  if (amountArg && !Number.isFinite(amount)) {
    console.error("Valor --amount invalido.");
    process.exit(1);
  }

  console.log("[reconcile] iniciando");
  console.log(
    JSON.stringify(
      {
        mode: paymentDocId ? "paymentDocId" : "filters",
        paymentDocId: paymentDocId || null,
        filters: {
          giftTitle: giftTitle || null,
          buyerEmail: buyerEmail || null,
          amount: amount ?? null,
        },
        dryRun,
        hasMpToken: Boolean(mpToken),
      },
      null,
      2,
    ),
  );

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let candidates: Array<{ id: string; data: PaymentDoc }> = [];

  if (paymentDocId) {
    const paymentRef = doc(db, "payments", paymentDocId);
    const snap = await getDoc(paymentRef);
    if (!snap.exists()) {
      console.log(`[reconcile] payment nao encontrado: ${paymentDocId}`);
      return;
    }

    candidates = [{ id: snap.id, data: snap.data() as PaymentDoc }];
  } else {
    const snapshot = await getDocs(collection(db, "payments"));
    console.log(`[reconcile] total em payments: ${snapshot.size}`);

    candidates = snapshot.docs
      .map((d) => ({ id: d.id, data: d.data() as PaymentDoc }))
      .filter(({ data }) => {
        return (
          normalizeText(data.status) === "pending" &&
          normalizeText(data.buyerEmail) === normalizeText(buyerEmail) &&
          normalizeText(data.giftTitle) === normalizeText(giftTitle) &&
          amountsMatch(data.amount, amount as number)
        );
      });
  }

  console.log(`[reconcile] candidatos encontrados: ${candidates.length}`);

  if (candidates.length === 0) {
    return;
  }

  for (const candidate of candidates) {
    const payment = candidate.data;
    const docId = candidate.id;

    console.log("[reconcile] pagamento alvo", {
      paymentId: docId,
      buyerEmail: payment.buyerEmail,
      giftTitle: payment.giftTitle,
      amount: payment.amount,
      status: payment.status,
      mpPaymentId: payment.mpPaymentId || "",
      createdAt: formatCreatedAt(payment.createdAt),
    });

    let resolvedMpPaymentId = String(payment.mpPaymentId || "");
    let resolvedStatus = "";

    if (!resolvedMpPaymentId) {
      console.log(
        "[reconcile] mpPaymentId vazio. Tentando buscar por external_reference...",
      );

      if (!mpToken) {
        console.log(
          "[reconcile] token do MP nao informado. Use --mpToken ou MERCADO_PAGO_ACCESS_TOKEN para resolver por external_reference.",
        );
        continue;
      }

      const found = await searchMercadoPagoByExternalReference(docId, mpToken);
      if (!found?.id) {
        console.log(
          "[reconcile] nenhum pagamento localizado no MP por external_reference.",
        );
        continue;
      }

      resolvedMpPaymentId = String(found.id);
      const mpPayment = await getMercadoPagoPayment(
        resolvedMpPaymentId,
        mpToken,
      );
      resolvedStatus = String(mpPayment.status || "");

      console.log("[reconcile] pagamento encontrado no MP", {
        mpPaymentId: resolvedMpPaymentId,
        status: resolvedStatus,
      });
    } else {
      console.log(
        "[reconcile] mpPaymentId ja existe. Consultando status pela API.",
      );
      resolvedStatus = await checkStatusViaApi(resolvedMpPaymentId);
      console.log("[reconcile] status retornado pela API", {
        mpPaymentId: resolvedMpPaymentId,
        status: resolvedStatus,
      });
    }

    if (!resolvedStatus) {
      console.log("[reconcile] status nao resolvido, pulando.");
      continue;
    }

    if (dryRun) {
      console.log("[reconcile] dry-run ativo, sem gravar.");
      continue;
    }

    const currentStatus = String(payment.status || "");
    const needsUpdate =
      currentStatus !== resolvedStatus ||
      String(payment.mpPaymentId || "") !== resolvedMpPaymentId;

    if (!needsUpdate) {
      console.log("[reconcile] pagamento ja consistente.");
      continue;
    }

    await updateDoc(doc(db, "payments", docId), {
      status: resolvedStatus,
      mpPaymentId: resolvedMpPaymentId,
      updatedAt: new Date(),
    });

    console.log("[reconcile] payment atualizado", {
      docId,
      oldStatus: currentStatus,
      newStatus: resolvedStatus,
      mpPaymentId: resolvedMpPaymentId,
    });

    if (resolvedStatus === "approved") {
      const giftIds = extractGiftIds(payment);
      console.log("[reconcile] atualizando gifts aprovados", { giftIds });

      await Promise.all(
        giftIds.map((giftId) =>
          updateDoc(doc(db, "gifts", String(giftId)), {
            buyedBy: payment.buyerEmail || "anonymous",
          }),
        ),
      );

      console.log("[reconcile] gifts atualizados");
    }
  }

  console.log("[reconcile] concluido");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[reconcile] erro:", message);
  process.exit(1);
});
