import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const GOLD = [246, 168, 33] as [number, number, number];
const NAVY = [7, 14, 26] as [number, number, number];
const GRAY = [100, 116, 139] as [number, number, number];

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 28, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 28, 210, 2, "F");
  doc.setTextColor(246, 168, 33);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Bank of Blockchain", 14, 12);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(title, 14, 21);
  doc.setTextColor(...GRAY);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`, 210 - 14, 21, { align: "right" });
}

function addSection(doc: jsPDF, title: string, y: number): number {
  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, y);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 196, y + 2);
  return y + 8;
}

export function exportUserActivityPDF(data: {
  user: {
    firstName: string; lastName: string; email: string;
    phone?: string | null; country?: string | null;
    dateOfBirth?: string | null; createdAt: string;
  };
  balances: { eur: number; usd: number; btc: number };
  transactions: Array<{ id: number; type: string; amount: string; currency: string; status: string; description?: string | null; createdAt: string }>;
  bankTransfers: Array<{ id: number; amount: string; currency: string; beneficiaryName: string; iban: string; status: string; createdAt: string }>;
  cryptoTransfers: Array<{ id: number; amount: string; cryptocurrency: string; walletAddress: string; status: string; createdAt: string }>;
  exportedAt: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  addHeader(doc, `Relevé d'activité — ${data.user.firstName} ${data.user.lastName}`);

  let y = 40;

  y = addSection(doc, "Informations personnelles", y);
  const profileRows = [
    ["Nom complet", `${data.user.firstName} ${data.user.lastName}`],
    ["Email", data.user.email],
    ["Téléphone", data.user.phone || "—"],
    ["Pays", data.user.country || "—"],
    ["Date de naissance", data.user.dateOfBirth || "—"],
    ["Membre depuis", new Date(data.user.createdAt).toLocaleDateString("fr-FR")],
  ];
  autoTable(doc, {
    startY: y,
    body: profileRows,
    theme: "plain",
    styles: { fontSize: 9, textColor: [30, 30, 30], cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", textColor: GRAY, cellWidth: 45 }, 1: { cellWidth: 140 } },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  y = addSection(doc, "Soldes actuels", y);
  autoTable(doc, {
    startY: y,
    head: [["Devise", "Solde"]],
    body: [
      ["Euro (EUR)", `€ ${data.balances.eur.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`],
      ["Dollar US (USD)", `$ ${data.balances.usd.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`],
      ["Bitcoin (BTC)", `₿ ${data.balances.btc.toFixed(8)}`],
    ],
    theme: "grid",
    headStyles: { fillColor: NAVY, textColor: GOLD, fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  if (data.transactions.length > 0) {
    if (y > 220) { doc.addPage(); addHeader(doc, `Relevé d'activité — ${data.user.firstName} ${data.user.lastName}`); y = 40; }
    y = addSection(doc, "Transactions", y);
    autoTable(doc, {
      startY: y,
      head: [["#", "Type", "Montant", "Statut", "Description", "Date"]],
      body: data.transactions.map(t => [
        `#${t.id}`,
        t.type,
        `${parseFloat(t.amount).toLocaleString("fr-FR")} ${t.currency}`,
        t.status,
        t.description || "—",
        new Date(t.createdAt).toLocaleDateString("fr-FR"),
      ]),
      theme: "striped",
      headStyles: { fillColor: NAVY, textColor: GOLD, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  if (data.bankTransfers.length > 0) {
    if (y > 220) { doc.addPage(); addHeader(doc, `Relevé d'activité — ${data.user.firstName} ${data.user.lastName}`); y = 40; }
    y = addSection(doc, "Virements Bancaires", y);
    autoTable(doc, {
      startY: y,
      head: [["#", "Montant", "Bénéficiaire", "IBAN", "Statut", "Date"]],
      body: data.bankTransfers.map(t => [
        `#${t.id}`,
        `${parseFloat(t.amount).toLocaleString("fr-FR")} ${t.currency}`,
        t.beneficiaryName,
        t.iban.length > 20 ? t.iban.substring(0, 20) + "…" : t.iban,
        t.status,
        new Date(t.createdAt).toLocaleDateString("fr-FR"),
      ]),
      theme: "striped",
      headStyles: { fillColor: NAVY, textColor: GOLD, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  if (data.cryptoTransfers.length > 0) {
    if (y > 220) { doc.addPage(); addHeader(doc, `Relevé d'activité — ${data.user.firstName} ${data.user.lastName}`); y = 40; }
    y = addSection(doc, "Transferts Crypto", y);
    autoTable(doc, {
      startY: y,
      head: [["#", "Montant", "Crypto", "Adresse", "Statut", "Date"]],
      body: data.cryptoTransfers.map(t => [
        `#${t.id}`,
        parseFloat(t.amount).toFixed(6),
        t.cryptocurrency,
        t.walletAddress.length > 20 ? t.walletAddress.substring(0, 20) + "…" : t.walletAddress,
        t.status,
        new Date(t.createdAt).toLocaleDateString("fr-FR"),
      ]),
      theme: "striped",
      headStyles: { fillColor: NAVY, textColor: GOLD, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });
  }

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} / ${pageCount} — Confidentiel`, 105, 290, { align: "center" });
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 287, 196, 287);
  }

  const fileName = `BOB_Releve_${data.user.lastName}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
