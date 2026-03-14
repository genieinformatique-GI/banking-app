import { useState } from "react";
import { useGetUsers, useUpdateUser, useGetMe } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Shield, ShieldAlert, UserIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function AdminSecurity() {
  const { data: currentUser } = useGetMe();
  const { data: usersData, isLoading } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: number, name: string, newRole: string} | null>(null);

  const updateRoleMutation = useUpdateUser({
    mutation: {
      onSuccess: () => {
        toast({ title: "Rôle mis à jour", variant: "success" });
        queryClient.invalidateQueries();
        setConfirmOpen(false);
        setSelectedUser(null);
      }
    }
  });

  const handleToggleRole = (user: any) => {
    if (user.id === currentUser?.id) {
      toast({ title: "Action impossible", description: "Vous ne pouvez pas modifier votre propre rôle.", variant: "destructive" });
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setSelectedUser({ id: user.id, name: `${user.firstName} ${user.lastName}`, newRole });
    setConfirmOpen(true);
  };

  const confirmRoleChange = () => {
    if (selectedUser) {
      updateRoleMutation.mutate({ 
        id: selectedUser.id, 
        data: { role: selectedUser.newRole as 'admin' | 'user' } 
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Sécurité & Rôles</h1>
        <p className="text-muted-foreground mt-1">Gérez les privilèges d'accès et les administrateurs de la plateforme.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle Actuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {u.role === 'admin' ? <Shield className="w-4 h-4 text-primary" /> : <UserIcon className="w-4 h-4 text-muted-foreground" />}
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.role === 'admin' ? (
                        <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">Administrateur</Badge>
                      ) : (
                        <Badge variant="outline">Utilisateur</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.status === 'active' ? <Badge variant="success">Actif</Badge> : <Badge variant="outline">{u.status}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant={u.role === 'admin' ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleRole(u)}
                        disabled={u.id === currentUser?.id}
                        className={u.role === 'admin' ? "text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 border-orange-500/30" : ""}
                      >
                        {u.role === 'admin' ? "Retirer droits admin" : "Promouvoir admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-500">
              <ShieldAlert className="w-5 h-5" /> 
              Confirmer le changement de rôle
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              Êtes-vous sûr de vouloir {selectedUser?.newRole === 'admin' ? 'donner' : 'retirer'} les droits d'administration à <strong className="text-foreground">{selectedUser?.name}</strong> ?
              {selectedUser?.newRole === 'admin' && " Cet utilisateur aura un accès complet à la plateforme, y compris à la gestion des fonds et des utilisateurs."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Annuler</Button>
            <Button variant="default" className={selectedUser?.newRole === 'admin' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''} onClick={confirmRoleChange} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? 'Mise à jour...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
