import { useState } from "react";
import { useGetBankTransfers, useValidateBankTransfer, useRejectBankTransfer } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminBankTransfers() {
  const { data, isLoading } = useGetBankTransfers();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const validateMutation = useValidateBankTransfer({
    mutation: {
      onSuccess: () => {
        toast({ title: "Transfert validé", variant: "success" });
        queryClient.invalidateQueries();
      }
    }
  });

  const rejectMutation = useRejectBankTransfer({
    mutation: {
      onSuccess: () => {
        toast({ title: "Transfert rejeté" });
        queryClient.invalidateQueries();
        setRejectModalOpen(false);
        setRejectReason("");
      }
    }
  });

  const handleReject = (id: number) => {
    setSelectedId(id);
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedId) {
      rejectMutation.mutate({ id: selectedId, data: { reason: rejectReason } });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Virements Bancaires</h1>
        <p className="text-muted-foreground mt-1">Validation des virements SEPA et SWIFT sortants.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Bénéficiaire</TableHead>
                  <TableHead>IBAN</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transfers.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.user?.firstName} {t.user?.lastName}</TableCell>
                    <TableCell className="font-mono font-bold text-foreground">{formatCurrency(t.amount, t.currency)}</TableCell>
                    <TableCell>{t.beneficiaryName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.iban}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(t.createdAt)}</TableCell>
                    <TableCell>
                      {t.status === 'pending' ? <Badge variant="warning">À valider</Badge> : 
                       t.status === 'completed' ? <Badge variant="success">Validé</Badge> : 
                       <Badge variant="destructive">Rejeté</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {t.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                            onClick={() => validateMutation.mutate({ id: t.id })}
                            disabled={validateMutation.isPending}
                          >
                            Valider
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                            onClick={() => handleReject(t.id)}
                          >
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <h3 className="text-xl font-bold mb-4">Motif du rejet</h3>
        <div className="space-y-4">
          <div>
            <Label>Raison à communiquer au client</Label>
            <Input 
              value={rejectReason} 
              onChange={e => setRejectReason(e.target.value)} 
              placeholder="Ex: IBAN invalide, Solde insuffisant..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={rejectMutation.isPending || !rejectReason}>
              Confirmer le rejet
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
