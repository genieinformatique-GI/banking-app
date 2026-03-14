import { useState } from "react";
import { useGetMe, useGetBankAccounts, useCreateBankAccount, useDeleteBankAccount } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Building2, Shield, User as UserIcon } from "lucide-react";

export default function Settings() {
  const { data: user } = useGetMe();
  const { data: accountsData, isLoading: accountsLoading } = useGetBankAccounts();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ beneficiaryName: '', iban: '', bic: '', bankName: '', country: '' });

  const createAccountMutation = useCreateBankAccount({
    mutation: {
      onSuccess: () => {
        toast({ title: "Compte ajouté avec succès", variant: "success" });
        setAddAccountOpen(false);
        setNewAccount({ beneficiaryName: '', iban: '', bic: '', bankName: '', country: '' });
        queryClient.invalidateQueries();
      },
      onError: (err: any) => {
        toast({ title: "Erreur", description: err.message || "Impossible d'ajouter le compte", variant: "destructive" });
      }
    }
  });

  const deleteAccountMutation = useDeleteBankAccount({
    mutation: {
      onSuccess: () => {
        toast({ title: "Compte supprimé" });
        queryClient.invalidateQueries();
      }
    }
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    createAccountMutation.mutate({ data: newAccount });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Paramètres du Compte</h1>
        <p className="text-muted-foreground mt-1">Gérez vos informations personnelles et vos coordonnées bancaires.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><UserIcon className="w-4 h-4 mr-2" /> Profil</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Shield className="w-4 h-4 mr-2" /> Sécurité</TabsTrigger>
          <TabsTrigger value="banks" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Building2 className="w-4 h-4 mr-2" /> Comptes Bancaires</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>Vos coordonnées d'identité.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input value={user?.firstName || ''} readOnly className="bg-secondary/20" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input value={user?.lastName || ''} readOnly className="bg-secondary/20" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ''} readOnly className="bg-secondary/20" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input value={user?.phone || ''} readOnly className="bg-secondary/20" />
                </div>
                <div className="space-y-2">
                  <Label>Pays</Label>
                  <Input value={user?.country || ''} readOnly className="bg-secondary/20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 max-w-md" onSubmit={(e) => { e.preventDefault(); toast({ title: "Non implémenté", description: "Cette fonctionnalité est en cours de développement." }); }}>
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le nouveau mot de passe</Label>
                  <Input type="password" />
                </div>
                <Button type="submit">Mettre à jour</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Comptes Bancaires Enregistrés</CardTitle>
                <CardDescription>Gérez vos IBAN pour les virements sortants.</CardDescription>
              </div>
              <Dialog open={addAccountOpen} onOpenChange={setAddAccountOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un compte bancaire</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAccount} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Nom du bénéficiaire</Label>
                      <Input required value={newAccount.beneficiaryName} onChange={e => setNewAccount({...newAccount, beneficiaryName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>IBAN</Label>
                      <Input required value={newAccount.iban} onChange={e => setNewAccount({...newAccount, iban: e.target.value})} placeholder="FR76..." />
                    </div>
                    <div className="space-y-2">
                      <Label>BIC / SWIFT</Label>
                      <Input required value={newAccount.bic} onChange={e => setNewAccount({...newAccount, bic: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom de la banque</Label>
                        <Input required value={newAccount.bankName} onChange={e => setNewAccount({...newAccount, bankName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Pays</Label>
                        <Input required value={newAccount.country} onChange={e => setNewAccount({...newAccount, country: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={createAccountMutation.isPending}>Ajouter le compte</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {accountsLoading ? (
                <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : !accountsData?.accounts || accountsData.accounts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Aucun compte bancaire enregistré.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bénéficiaire</TableHead>
                      <TableHead>Banque</TableHead>
                      <TableHead>IBAN</TableHead>
                      <TableHead>BIC</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsData.accounts.map(acc => (
                      <TableRow key={acc.id}>
                        <TableCell className="font-medium">{acc.beneficiaryName}</TableCell>
                        <TableCell>{acc.bankName}</TableCell>
                        <TableCell className="font-mono text-sm">{acc.iban}</TableCell>
                        <TableCell className="font-mono text-sm">{acc.bic}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => deleteAccountMutation.mutate({ id: acc.id })}
                            disabled={deleteAccountMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
