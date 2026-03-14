import { useGetNotifications, useMarkNotificationRead } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function UserNotifications() {
  const { data, isLoading } = useGetNotifications();
  const markRead = useMarkNotificationRead();
  const queryClient = useQueryClient();

  const notifications = data?.notifications ?? [];
  const unread = notifications.filter(n => !n.isRead);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries()
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unread.length > 0 ? `${unread.length} notification(s) non lue(s)` : "Tout est à jour."}
          </p>
        </div>
        {unread.length > 0 && (
          <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
            <Bell className="w-3.5 h-3.5 mr-1.5" />
            {unread.length} non lue(s)
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les notifications</CardTitle>
          <CardDescription>Messages de votre conseiller et alertes système.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune notification pour le moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-4 p-5 transition-colors ${!n.isRead ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-secondary/20'}`}>
                  <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{n.title}</p>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">{formatDate(n.createdAt)}</p>
                  </div>
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 text-xs"
                      onClick={() => handleMarkRead(n.id)}
                      disabled={markRead.isPending}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Marquer lu
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
