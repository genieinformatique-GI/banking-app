import { useState } from "react";
import { useGetNotifications, useCreateNotification, useGetUsers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Bell, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function AdminNotifications() {
  const { data: notificationsData, isLoading: notificationsLoading } = useGetNotifications();
  const { data: usersData } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    userId: '',
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    sendToAll: false
  });

  const createMutation = useCreateNotification({
    mutation: {
      onSuccess: () => {
        toast({ title: "Notification envoyée", variant: "success" });
        setForm({ ...form, title: '', message: '' });
        queryClient.invalidateQueries();
      },
      onError: (err: any) => {
        toast({ title: "Erreur", description: err.message, variant: "destructive" });
      }
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message || (!form.sendToAll && !form.userId)) {
      toast({ title: "Champs manquants", variant: "destructive" });
      return;
    }
    
    // Si on veut envoyer à tous, dans l'API on passe null ou un format spécifique,
    // mais selon les types, userId est optionnel.
    const payload = {
      userId: form.sendToAll ? undefined : Number(form.userId),
      title: form.title,
      message: form.message,
      type: form.type
    };

    createMutation.mutate({ data: payload });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Centre de Notifications</h1>
        <p className="text-muted-foreground mt-1">Gérez la communication ciblée avec vos clients.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Send className="w-5 h-5"/> Envoyer une notification</CardTitle>
            <CardDescription>Diffusez un message sur le dashboard client.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-5">
              <div className="flex items-center space-x-2 bg-secondary/30 p-3 rounded-lg border border-border">
                <Checkbox 
                  id="sendToAll" 
                  checked={form.sendToAll} 
                  onCheckedChange={(c) => setForm({...form, sendToAll: !!c})} 
                />
                <Label htmlFor="sendToAll" className="cursor-pointer">Envoyer à tous les utilisateurs</Label>
              </div>

              {!form.sendToAll && (
                <div className="space-y-2">
                  <Label>Utilisateur cible</Label>
                  <Select value={form.userId} onValueChange={v => setForm({...form, userId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersData?.users.map(u => (
                        <SelectItem key={u.id} value={u.id.toString()}>{u.firstName} {u.lastName} ({u.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Type de message</Label>
                <Select value={form.type} onValueChange={v => setForm({...form, type: v as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Alerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Titre</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ex: Maintenance système" />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Détail de la notification..." rows={4} />
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Envoi..." : "Envoyer la notification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique des envois</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notificationsLoading ? (
               <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Statut de lecture</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(notificationsData?.notifications ?? []).map(n => (
                    <TableRow key={n.id}>
                      <TableCell>{getTypeIcon(n.type)}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate" title={n.message}>
                        {n.title}
                      </TableCell>
                      <TableCell>
                        {n.userId ? `Utilisateur #${n.userId}` : <Badge variant="secondary">Global</Badge>}
                      </TableCell>
                      <TableCell>
                        {n.isRead ? <Badge variant="outline" className="text-muted-foreground">Lu</Badge> : <Badge variant="default" className="bg-primary/20 text-primary">Non lu</Badge>}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(n.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {(!notificationsData?.notifications || notificationsData.notifications.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">Aucune notification envoyée.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
