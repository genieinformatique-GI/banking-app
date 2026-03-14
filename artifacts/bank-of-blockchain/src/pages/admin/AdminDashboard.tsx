import { useLanguage } from "@/contexts/LanguageContext";
import { useGetAdminStats, useGetTransactions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, ArrowRightLeft, Activity } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: txData, isLoading: txLoading } = useGetTransactions({ limit: 5 });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">{t.common.status.completed}</Badge>;
      case 'pending': return <Badge variant="warning">{t.common.status.pending}</Badge>;
      case 'processing': return <Badge variant="default" className="bg-blue-500/10 text-blue-500">{t.common.status.processing}</Badge>;
      case 'rejected': return <Badge variant="destructive">{t.common.status.rejected}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (statsLoading || !stats) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">{t.admin.dashboard.title}</h1>
        <p className="text-muted-foreground mt-1">{(t as any).admin.dashboard.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">{t.admin.dashboard.activeUsers}</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">{(t as any).admin.dashboard.outOf} {stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-amber-500 text-sm font-medium">{(t as any).admin.dashboard.requiredAction}</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-amber-500">
              {stats.pendingUsers + stats.pendingBankTransfers + stats.pendingCryptoTransfers}
            </div>
            <p className="text-xs text-amber-500/70 mt-1">{(t as any).admin.dashboard.pendingItemsDesc}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">{(t as any).admin.dashboard.bankTransfersShort}</CardTitle>
            <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{stats.totalBankTransfers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">{(t as any).admin.dashboard.cryptoTransfersShort}</CardTitle>
            <Activity className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{stats.totalCryptoTransfers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{(t as any).admin.dashboard.latestTransactions}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {txLoading ? (
             <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t.admin.users.name}</TableHead>
                  <TableHead>{(t as any).common.type}</TableHead>
                  <TableHead>{t.transfers.amount}</TableHead>
                  <TableHead>{t.transactions.date}</TableHead>
                  <TableHead>{t.transactions.status}</TableHead>
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
            </Table></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
