import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useGetBankTransfers, useValidateBankTransfer, useRejectBankTransfer } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, CheckCircle, XCircle, Building2 } from "lucide-react";

export default function AdminBankTransfers() {
  const { t } = useLanguage();
  const { data, isLoading } = useGetBankTransfers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const validateMutation = useValidateBankTransfer({
    mutation: {
      onSuccess: () => {
        toast({ title: "Virement validé", variant: "success" });
        queryClient.invalidateQueries();
        setDetailModalOpen(false);
      }
    }
  });

  const rejectMutation = useRejectBankTransfer({
    mutation: {
      onSuccess: () => {
        toast({ title: "Virement rejeté" });
        queryClient.invalidateQueries();
        setRejectModalOpen(false);
        setDetailModalOpen(false);
        setRejectReason("");
      }
    }
  });

  const openDetail = (t: any) => { setSelectedTransfer(t); setDetailModalOpen(true); };
  const openReject = (t: any) => { setSelectedTransfer(t); setRejectReason(""); setRejectModalOpen(true); };

  const statusBadge = (status: string) => {
    if (status === 'pending') return <Badge variant="warning">{(t as any).admin.bankTransfers.toValidate}</Badge>;
    if (status === 'completed') return <Badge variant="success">{(t as any).admin.bankTransfers.validated}</Badge>;
    return <Badge variant="destructive">{(t as any).admin.bankTransfers.rejected}</Badge>;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">{(t as any).admin.bankTransfers.title}</h1>
        <p className="text-muted-foreground mt-1">{(t as any).admin.bankTransfers.subtitle}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{(t as any).admin.bankTransfers.client}</TableHead>
                  <TableHead>{t.transfers.amount}</TableHead>
                  <TableHead>{t.transfers.beneficiary}</TableHead>
                  <TableHead>{t.transfers.iban}</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>{t.transactions.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transfers.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">#{t.id}</TableCell>
                    <TableCell className="font-medium">{t.user?.firstName} {t.user?.lastName}</TableCell>
                    <TableCell className="font-mono font-bold">{formatCurrency(t.amount, t.currency)}</TableCell>
                    <TableCell>{t.beneficiaryName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{(t.iban || '').slice(0, 12)}…</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(t.createdAt)}</TableCell>
                    <TableCell>{statusBadge(t.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openDetail(t)} title="Voir détails">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {t.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                              onClick={() => validateMutation.mutate({ id: t.id })} disabled={validateMutation.isPending}>
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Valider
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                              onClick={() => openReject(t)}>
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Rejeter
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.transfers || data.transfers.length === 0) && (
                  <TableRow><TableCell colSpan={8} className="text-center p-8 text-muted-foreground">Aucun virement trouvé.</TableCell></TableRow>
                )}
              </TableBody>
            </Table></div>
          )}
        </CardContent>
      </Card>

      {/* ── Detail Modal ── */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> Détails du virement #{selectedTransfer?.id}</DialogTitle>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="font-semibold mt-0.5">{selectedTransfer.user?.firstName} {selectedTransfer.user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{selectedTransfer.user?.email}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Montant</p>
                  <p className="font-mono font-bold text-xl mt-0.5">{formatCurrency(selectedTransfer.amount, selectedTransfer.currency)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="font-semibold text-sm">Informations bancaires</p>
                {[
                  { label: "Bénéficiaire", value: selectedTransfer.beneficiaryName },
                  { label: "IBAN", value: selectedTransfer.iban, mono: true },
                  { label: "BIC / SWIFT", value: selectedTransfer.bic || "—", mono: true },
                  { label: "Banque", value: selectedTransfer.bankName || "—" },
                  { label: "Pays", value: selectedTransfer.country || "—" },
                  { label: "Motif / Référence", value: selectedTransfer.description || selectedTransfer.reference || "—" },
                  { label: "Date de demande", value: formatDate(selectedTransfer.createdAt) },
                  { label: "Statut", value: null, badge: statusBadge(selectedTransfer.status) },
                  selectedTransfer.rejectedReason && { label: "Motif du rejet", value: selectedTransfer.rejectedReason },
                ].filter(Boolean).map((item: any) => (
                  <div key={item.label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-muted-foreground w-36 shrink-0">{item.label}</span>
                    {item.badge ? item.badge : <span className={`text-sm font-medium text-right ${item.mono ? "font-mono" : ""}`}>{item.value}</span>}
                  </div>
                ))}
              </div>

              {selectedTransfer.status === 'pending' && (
                <>
                  <Separator />
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => validateMutation.mutate({ id: selectedTransfer.id })} disabled={validateMutation.isPending}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Valider
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => { setDetailModalOpen(false); openReject(selectedTransfer); }}>
                      <XCircle className="w-4 h-4 mr-2" /> Rejeter
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Reject Modal ── */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motif du rejet — Virement #{selectedTransfer?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Raison à communiquer au client</Label>
              <Input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Ex: IBAN invalide, Solde insuffisant…" className="mt-1" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={() => selectedTransfer && rejectMutation.mutate({ id: selectedTransfer.id, data: { reason: rejectReason } })} disabled={rejectMutation.isPending || !rejectReason}>
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
