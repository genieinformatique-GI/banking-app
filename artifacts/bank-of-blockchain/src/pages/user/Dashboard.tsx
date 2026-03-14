import { useGetMyBalances, useGetTransactions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Euro, DollarSign, Bitcoin, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const { data: balancesData, isLoading: balancesLoading } = useGetMyBalances();
  const { data: transactionsData, isLoading: txLoading } = useGetTransactions({ limit: 5 });

  const balances = balancesData?.balances || { eur: 0, usd: 0, btc: 0 };
  const transactions = transactionsData?.transactions || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Complété</Badge>;
      case 'pending': return <Badge variant="warning">En attente</Badge>;
      case 'processing': return <Badge variant="default" className="bg-blue-500/10 text-blue-500">En cours</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejeté</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Vue d'ensemble</h1>
          <p className="text-muted-foreground mt-1">Gérez vos avoirs fiat et crypto en temps réel.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/transfers">
            <Button className="gap-2"><ArrowUpRight className="w-4 h-4"/> Faire un virement</Button>
          </Link>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Solde EUR</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Euro className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {balancesLoading ? (
              <div className="h-10 bg-secondary animate-pulse rounded-lg w-1/2"></div>
            ) : (
              <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                {formatCurrency(balances.eur, 'EUR')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Solde USD</CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            {balancesLoading ? (
              <div className="h-10 bg-secondary animate-pulse rounded-lg w-1/2"></div>
            ) : (
              <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                {formatCurrency(balances.usd, 'USD')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Solde BTC</CardTitle>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Bitcoin className="w-4 h-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            {balancesLoading ? (
              <div className="h-10 bg-secondary animate-pulse rounded-lg w-1/2"></div>
            ) : (
              <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                {balances.btc.toFixed(8)} <span className="text-xl text-muted-foreground">BTC</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <CardTitle>Transactions Récentes</CardTitle>
          <Link href="/dashboard/transactions">
            <Button variant="link" size="sm">Voir tout</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {txLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Aucune transaction trouvée.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type.includes('transfer') ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>
                          {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <span className="font-medium capitalize">{tx.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tx.createdAt)}</TableCell>
                    <TableCell className="font-mono font-semibold">
                      {tx.type === 'debit' || tx.type.includes('transfer') ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                    </TableCell>
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
