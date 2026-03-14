import { useState } from "react";
import { useGetTransactions, useValidateTransaction, useRejectTransaction } from "@workspace/api-client-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Eye, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";

export default function AdminTransactions() {
  const [filter, setFilter] = useState("all");
  const { data, isLoading } = useGetTransactions({ limit: 100 });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const validateMutation = useValidateTransaction({
    mutation: {
      onSuccess: () => {
        toast({ title: "Transaction validée", variant: "success" });
        queryClient.invalidateQueries();
        setDetailModalOpen(false);
      }
    }
  });

  const rejectMutation = useRejectTransaction({
    mutation: {
      onSuccess: () => {
        toast({ title: "Transaction rejetée" });
        queryClient.invalidateQueries();
        setRejectModalOpen(false);
        setDetailModalOpen(false);
        setRejectReason("");
      }
    }
  });

  const openDetail = (tx: any) => { setSelectedTx(tx); setDetailModalOpen(true); };
  const openReject = (tx: any) => { setSelectedTx(tx); setRejectReason(""); setRejectModalOpen(true); };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Complété</Badge>;
      case 'pending': return <Badge variant="warning">En attente</Badge>;
      case 'processing': return <Badge variant="default" className="bg-blue-500/10 text-blue-500">En cours</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejeté</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const transactions = data?.transactions || [];
  const filteredTx = filter === "all" ? transactions : transactions.filter(t => t.status === filter);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Validation des Transactions</h1>
          <p className="text-muted-foreground mt-1">Supervisez et validez les dépôts et retraits.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processing">En cours</SelectItem>
              <SelectItem value="completed">Complétés</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTx.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">#{tx.id}</TableCell>
                    <TableCell className="font-medium">{tx.user?.firstName} {tx.user?.lastName}</TableCell>
                    <TableCell className="capitalize">{tx.type.replace('_', ' ')}</TableCell>
                    <TableCell className="font-mono font-bold text-foreground">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{tx.description || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(tx.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openDetail(tx)} title="Voir détails">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(tx.status === 'pending' || tx.status === 'processing') && (
                          <>
                            <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                              onClick={() => validateMutation.mutate({ id: tx.id })} disabled={validateMutation.isPending}>
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Valider
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                              onClick={() => openReject(tx)}>
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Rejeter
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTx.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center p-8 text-muted-foreground">Aucune transaction trouvée.</TableCell></TableRow>
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
            <DialogTitle className="flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-primary" /> Transaction #{selectedTx?.id}</DialogTitle>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="font-semibold mt-0.5">{selectedTx.user?.firstName} {selectedTx.user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{selectedTx.user?.email}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Montant</p>
                  <p className="font-mono font-bold text-xl mt-0.5">{formatCurrency(selectedTx.amount, selectedTx.currency)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {[
                  { label: "Type", value: selectedTx.type?.replace('_', ' ') },
                  { label: "Devise", value: selectedTx.currency },
                  { label: "Description", value: selectedTx.description || "—" },
                  { label: "Référence", value: selectedTx.reference || "—" },
                  { label: "Date", value: formatDate(selectedTx.createdAt) },
                  { label: "Statut", badge: getStatusBadge(selectedTx.status) },
                  ...(selectedTx.rejectedReason ? [{ label: "Motif du rejet", value: selectedTx.rejectedReason }] : []),
                ].map((item: any) => (
                  <div key={item.label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground w-28 shrink-0">{item.label}</span>
                    {item.badge ? item.badge : <span className="text-sm font-medium capitalize text-right">{item.value}</span>}
                  </div>
                ))}
              </div>

              {(selectedTx.status === 'pending' || selectedTx.status === 'processing') && (
                <>
                  <Separator />
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => validateMutation.mutate({ id: selectedTx.id })} disabled={validateMutation.isPending}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Valider
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => { setDetailModalOpen(false); openReject(selectedTx); }}>
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
            <DialogTitle>Motif du rejet — Transaction #{selectedTx?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Raison à communiquer au client</Label>
              <Input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Ex: Fonds insuffisants, informations invalides…" className="mt-1" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={() => selectedTx && rejectMutation.mutate({ id: selectedTx.id, data: { reason: rejectReason } })} disabled={rejectMutation.isPending || !rejectReason}>
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
