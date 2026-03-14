import { useState } from "react";
import { useGetTransactions } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Transactions() {
  const [filter, setFilter] = useState("all");
  const { data, isLoading } = useGetTransactions({ limit: 50 });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Complété</Badge>;
      case 'pending': return <Badge variant="warning">En attente</Badge>;
      case 'processing': return <Badge variant="default" className="bg-blue-500/10 text-blue-500">En cours</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejeté</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const transactions = data?.transactions || [];
  const filteredTx = filter === "all" ? transactions : transactions.filter(t => t.status === filter);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Historique des Transactions</h1>
          <p className="text-muted-foreground mt-1">Consultez l'ensemble de vos mouvements financiers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Complétés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processing">En cours</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : filteredTx.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">Aucune transaction trouvée pour ces critères.</div>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTx.map((tx) => (
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
                    <TableCell className="text-sm">{tx.description || '-'}</TableCell>
                    <TableCell className="font-mono font-semibold">
                      {tx.type === 'debit' || tx.type.includes('transfer') ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                    </TableCell>
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
