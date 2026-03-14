import { useGetAdminStats, useGetTransactions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, ArrowRightLeft, Activity } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: txData, isLoading: txLoading } = useGetTransactions({ limit: 5 });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Complété</Badge>;
      case 'pending': return <Badge variant="warning">En attente</Badge>;
      case 'processing': return <Badge variant="default" className="bg-blue-500/10 text-blue-500">En cours</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejeté</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (statsLoading || !stats) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Supervision globale de la plateforme Bank Of Blockchain.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Sur {stats.totalUsers} au total</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-amber-500 text-sm font-medium">Action Requise</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-amber-500">
              {stats.pendingUsers + stats.pendingBankTransfers + stats.pendingCryptoTransfers}
            </div>
            <p className="text-xs text-amber-500/70 mt-1">Comptes et transferts en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Transf. Bancaires</CardTitle>
            <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{stats.totalBankTransfers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Transf. Crypto</CardTitle>
            <Activity className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{stats.totalCryptoTransfers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières Transactions du Système</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {txLoading ? (
             <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txData?.transactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">#{tx.id}</TableCell>
                    <TableCell className="font-medium">{tx.user?.firstName} {tx.user?.lastName}</TableCell>
                    <TableCell className="capitalize">{tx.type.replace('_', ' ')}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tx.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
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
