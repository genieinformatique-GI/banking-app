import { useState } from "react";
import { useGetUsers, useGetUserBalances, useUpdateUserBalances } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";

export default function Balances() {
  const { data: usersData, isLoading } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // State for the edit form
  const [eur, setEur] = useState("");
  const [usd, setUsd] = useState("");
  const [btc, setBtc] = useState("");

  const updateMutation = useUpdateUserBalances({
    mutation: {
      onSuccess: () => {
        toast({ title: "Soldes mis à jour avec succès", variant: "success" });
        queryClient.invalidateQueries();
        setModalOpen(false);
      }
    }
  });

  const handleEdit = async (user: any) => {
    setSelectedUser(user);
    // Fetch current balances to pre-fill
    try {
      const res = await fetch(`/api/balances/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bob_token')}` }
      });
      const data = await res.json();
      setEur(data.balances.eur.toString());
      setUsd(data.balances.usd.toString());
      setBtc(data.balances.btc.toString());
      setModalOpen(true);
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de charger les soldes", variant: "destructive" });
    }
  };

  const handleSave = () => {
    if (selectedUser) {
      updateMutation.mutate({
        userId: selectedUser.id,
        data: {
          eur: Number(eur),
          usd: Number(usd),
          btc: Number(btc)
        }
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Gestion des Soldes</h1>
        <p className="text-muted-foreground mt-1">Créditez ou débitez manuellement les comptes clients.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Client</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-muted-foreground">#{user.id}</TableCell>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
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
        <h3 className="text-xl font-bold mb-1">Modifier les soldes</h3>
        <p className="text-muted-foreground text-sm mb-6">Client: {selectedUser?.firstName} {selectedUser?.lastName}</p>
        
        <div className="space-y-5">
          <div>
            <Label>Solde EUR (€)</Label>
            <Input type="number" step="0.01" value={eur} onChange={e => setEur(e.target.value)} />
          </div>
          <div>
            <Label>Solde USD ($)</Label>
            <Input type="number" step="0.01" value={usd} onChange={e => setUsd(e.target.value)} />
          </div>
          <div>
            <Label>Solde BTC</Label>
            <Input type="number" step="0.00000001" value={btc} onChange={e => setBtc(e.target.value)} />
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Sauvegarde..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
