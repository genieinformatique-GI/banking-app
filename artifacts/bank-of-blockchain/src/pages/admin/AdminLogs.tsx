import { useLanguage } from "@/contexts/LanguageContext";
import { useGetLogs } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function AdminLogs() {
  const { t } = useLanguage();
  const { data, isLoading } = useGetLogs({ limit: 100 });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">{t.admin.logs.title}</h1>
        <p className="text-muted-foreground mt-1">Traçabilité complète des actions d'administration.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date / Heure</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>{t.admin.logs.action}</TableHead>
                  <TableHead>{t.admin.logs.target}</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{formatDate(log.createdAt)}</TableCell>
                    <TableCell className="font-medium">{log.admin?.firstName} {log.admin?.lastName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-secondary/50 font-mono text-xs uppercase tracking-wider">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {log.target} {log.targetId ? `#${log.targetId}` : ''}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground max-w-md truncate" title={log.details}>
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.logs || data.logs.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">Aucun log enregistré.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
