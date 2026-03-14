import { useState } from "react";
import { useGetUsers, useUpdateUserBalances } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2, Euro, DollarSign, Bitcoin, RefreshCw } from "lucide-react";

export default function Balances() {
  const { data: usersData, isLoading } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentBalances, setCurrentBalances] = useState<{ eur: number; usd: number; btc: number } | null>(null);
  const [loadingBalances, setLoadingBalances] = useState(false);

  const [eur, setEur] = useState("");
  const [usd, setUsd] = useState("");
  const [btc, setBtc] = useState("");

  const updateMutation = useUpdateUserBalances({
    mutation: {
      onSuccess: () => {
        toast({ title: "Soldes mis à jour avec succès", variant: "success" });
        queryClient.invalidateQueries();
        setModalOpen(false);
      },
      onError: (err: any) => {
        toast({ title: "Erreur", description: err?.message || "Impossible de mettre à jour les soldes", variant: "destructive" });
      }
    }
  });

  const handleEdit = async (user: any) => {
    setSelectedUser(user);
    setLoadingBalances(true);
    setModalOpen(true);
    try {
      const res = await fetch(`/api/balances/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bob_token')}` }
      });
      const data = await res.json();
      const b = data.balances || { eur: 0, usd: 0, btc: 0 };
      setCurrentBalances(b);
      setEur(b.eur.toString());
      setUsd(b.usd.toString());
      setBtc(b.btc.toString());
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les soldes", variant: "destructive" });
    } finally {
      setLoadingBalances(false);
    }
  };

  const handleSave = () => {
    if (!selectedUser) return;
    updateMutation.mutate({
      userId: selectedUser.id,
      data: { eur: Number(eur), usd: Number(usd), btc: Number(btc) }
    });
  };

  const nonAdminUsers = usersData?.users?.filter(u => u.role !== "admin") ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Gestion des Soldes</h1>
        <p className="text-muted-foreground mt-1">Créditez ou débitez manuellement les comptes clients.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-2">
        {[
          { label: "Total clients", value: nonAdminUsers.length.toString(), icon: <Euro className="w-5 h-5" />, color: "text-blue-400" },
          { label: "Devise EUR/USD", value: "Modifiable", icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-400" },
          { label: "Crypto BTC", value: "Modifiable", icon: <Bitcoin className="w-5 h-5" />, color: "text-amber-400" },
        ].map(({ label, value, icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`${color} bg-secondary/50 p-2 rounded-lg`}>{icon}</div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-bold text-lg">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comptes clients</CardTitle>
          <CardDescription>Cliquez sur "Éditer soldes" pour modifier les avoirs d'un client.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : nonAdminUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Aucun client trouvé.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonAdminUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-muted-foreground text-sm">#{user.id}</TableCell>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "success" : user.status === "pending" ? "warning" : "destructive"} className="capitalize">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(user)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Éditer soldes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier les soldes</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div>
              <p className="text-muted-foreground text-sm mb-6">
                Client : <span className="font-semibold text-foreground">{selectedUser.firstName} {selectedUser.lastName}</span>
                <span className="ml-2 text-xs">({selectedUser.email})</span>
              </p>

              {loadingBalances ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">Chargement des soldes...</span>
                </div>
              ) : (
                <>
                  {currentBalances && (
                    <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-secondary/30 rounded-lg text-center text-sm">
                      <div><p className="text-muted-foreground text-xs">Actuel EUR</p><p className="font-bold">{currentBalances.eur.toFixed(2)} €</p></div>
                      <div><p className="text-muted-foreground text-xs">Actuel USD</p><p className="font-bold">{currentBalances.usd.toFixed(2)} $</p></div>
                      <div><p className="text-muted-foreground text-xs">Actuel BTC</p><p className="font-bold">{currentBalances.btc.toFixed(6)}</p></div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bal-eur">Nouveau solde EUR (€)</Label>
                      <Input id="bal-eur" type="number" step="0.01" min="0" value={eur} onChange={e => setEur(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bal-usd">Nouveau solde USD ($)</Label>
                      <Input id="bal-usd" type="number" step="0.01" min="0" value={usd} onChange={e => setUsd(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bal-btc">Nouveau solde BTC</Label>
                      <Input id="bal-btc" type="number" step="0.00000001" min="0" value={btc} onChange={e => setBtc(e.target.value)} placeholder="0.00000000" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
                    <Button onClick={handleSave} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? "Sauvegarde..." : "Enregistrer les soldes"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
