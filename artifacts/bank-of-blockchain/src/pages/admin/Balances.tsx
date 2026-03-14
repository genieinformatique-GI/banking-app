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
import { Edit2, Euro, DollarSign, Bitcoin, RefreshCw, Plus, Minus, Equal } from "lucide-react";

type OpMode = "set" | "add" | "subtract";

export default function Balances() {
  const { data: usersData, isLoading } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentBalances, setCurrentBalances] = useState<{ eur: number; usd: number; btc: number } | null>(null);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [mode, setMode] = useState<OpMode>("set");
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
    setMode("set");
    setEur("0");
    setUsd("0");
    setBtc("0");
    try {
      const res = await fetch(`/api/balances/${user.id}`);
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

  const computeNewBalances = () => {
    if (!currentBalances) return null;
    const amount = { eur: parseFloat(eur) || 0, usd: parseFloat(usd) || 0, btc: parseFloat(btc) || 0 };
    if (mode === "set") return amount;
    if (mode === "add") return {
      eur: Math.max(0, currentBalances.eur + amount.eur),
      usd: Math.max(0, currentBalances.usd + amount.usd),
      btc: Math.max(0, currentBalances.btc + amount.btc),
    };
    return {
      eur: Math.max(0, currentBalances.eur - amount.eur),
      usd: Math.max(0, currentBalances.usd - amount.usd),
      btc: Math.max(0, currentBalances.btc - amount.btc),
    };
  };

  const handleSave = () => {
    if (!selectedUser) return;
    const newBalances = computeNewBalances();
    if (!newBalances) return;
    updateMutation.mutate({
      userId: selectedUser.id,
      data: { eur: newBalances.eur, usd: newBalances.usd, btc: newBalances.btc }
    });
  };

  const preview = computeNewBalances();

  const nonAdminUsers = usersData?.users?.filter(u => u.role !== "admin") ?? [];

  const modeButtons = [
    { id: "set" as OpMode, label: "Définir", icon: <Equal className="w-3.5 h-3.5" />, color: "bg-secondary text-foreground border border-border" },
    { id: "add" as OpMode, label: "Créditer", icon: <Plus className="w-3.5 h-3.5" />, color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" },
    { id: "subtract" as OpMode, label: "Débiter", icon: <Minus className="w-3.5 h-3.5" />, color: "bg-red-500/10 text-red-400 border border-red-500/30" },
  ];

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
          <CardDescription>Cliquez sur "Éditer soldes" pour créditer ou débiter un compte.</CardDescription>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier les soldes</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div>
              <p className="text-muted-foreground text-sm mb-4">
                Client : <span className="font-semibold text-foreground">{selectedUser.firstName} {selectedUser.lastName}</span>
                <span className="ml-2 text-xs">({selectedUser.email})</span>
              </p>

              {loadingBalances ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">Chargement des soldes actuels...</span>
                </div>
              ) : (
                <>
                  {/* Current balances */}
                  {currentBalances && (
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-secondary/30 rounded-lg text-center text-sm border border-border">
                      <div><p className="text-muted-foreground text-xs mb-0.5">Solde EUR actuel</p><p className="font-bold text-base">{currentBalances.eur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p></div>
                      <div><p className="text-muted-foreground text-xs mb-0.5">Solde USD actuel</p><p className="font-bold text-base">{currentBalances.usd.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</p></div>
                      <div><p className="text-muted-foreground text-xs mb-0.5">Solde BTC actuel</p><p className="font-bold text-base">{currentBalances.btc.toFixed(6)}</p></div>
                    </div>
                  )}

                  {/* Mode selector */}
                  <div className="flex gap-2 mb-5">
                    {modeButtons.map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setMode(btn.id);
                          setEur("0"); setUsd("0"); setBtc("0");
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${mode === btn.id ? btn.color + " ring-2 ring-offset-1 ring-offset-card ring-current" : "bg-secondary/40 text-muted-foreground border border-border hover:bg-secondary"}`}
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    {mode === "set" && "Saisissez le nouveau solde absolu à affecter au compte."}
                    {mode === "add" && "Saisissez le montant à créditer (ajouter) au solde actuel."}
                    {mode === "subtract" && "Saisissez le montant à débiter (retirer) du solde actuel."}
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="bal-eur">
                        {mode === "set" ? "Nouveau solde EUR (€)" : mode === "add" ? "Montant à créditer EUR (€)" : "Montant à débiter EUR (€)"}
                      </Label>
                      <Input id="bal-eur" type="number" step="0.01" min="0" value={eur} onChange={e => setEur(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bal-usd">
                        {mode === "set" ? "Nouveau solde USD ($)" : mode === "add" ? "Montant à créditer USD ($)" : "Montant à débiter USD ($)"}
                      </Label>
                      <Input id="bal-usd" type="number" step="0.01" min="0" value={usd} onChange={e => setUsd(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bal-btc">
                        {mode === "set" ? "Nouveau solde BTC" : mode === "add" ? "Montant à créditer BTC" : "Montant à débiter BTC"}
                      </Label>
                      <Input id="bal-btc" type="number" step="0.00000001" min="0" value={btc} onChange={e => setBtc(e.target.value)} placeholder="0.00000000" />
                    </div>
                  </div>

                  {/* Preview of result */}
                  {preview && mode !== "set" && (
                    <div className={`mt-4 p-3 rounded-lg border text-sm ${mode === "add" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                      <p className={`font-semibold mb-2 text-xs uppercase tracking-wide ${mode === "add" ? "text-emerald-400" : "text-red-400"}`}>
                        {mode === "add" ? "Résultat après crédit" : "Résultat après débit"}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><p className="text-muted-foreground text-xs">EUR</p><p className="font-bold">{preview.eur.toFixed(2)} €</p></div>
                        <div><p className="text-muted-foreground text-xs">USD</p><p className="font-bold">{preview.usd.toFixed(2)} $</p></div>
                        <div><p className="text-muted-foreground text-xs">BTC</p><p className="font-bold">{preview.btc.toFixed(6)}</p></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
                    <Button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className={mode === "add" ? "bg-emerald-600 hover:bg-emerald-700" : mode === "subtract" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {updateMutation.isPending ? "Traitement..." :
                        mode === "add" ? `Créditer le compte` :
                        mode === "subtract" ? `Débiter le compte` :
                        "Enregistrer les soldes"}
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
