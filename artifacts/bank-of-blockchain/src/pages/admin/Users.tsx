import { useState } from "react";
import { useGetUsers, useActivateUser, useSuspendUser } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminUsers() {
  const { data, isLoading } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activateUser = useActivateUser({
    mutation: {
      onSuccess: () => {
        toast({ title: "Utilisateur activé" });
        queryClient.invalidateQueries();
      }
    }
  });

  const suspendUser = useSuspendUser({
    mutation: {
      onSuccess: () => {
        toast({ title: "Utilisateur suspendu", variant: "destructive" });
        queryClient.invalidateQueries();
      }
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Actif</Badge>;
      case 'pending': return <Badge variant="warning">En attente</Badge>;
      case 'suspended': return <Badge variant="destructive">Suspendu</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">Approuvez, suspendez ou modifiez les comptes clients.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.country || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.role === 'admin' ? 'border-primary text-primary' : ''}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user.status !== 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                            onClick={() => activateUser.mutate({ id: user.id })}
                            disabled={activateUser.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Activer
                          </Button>
                        )}
                        {user.status !== 'suspended' && user.role !== 'admin' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                            onClick={() => suspendUser.mutate({ id: user.id })}
                            disabled={suspendUser.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Suspendre
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
