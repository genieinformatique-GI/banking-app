import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useGetUsers, useUpdateUser, useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Shield, ShieldAlert, UserIcon, ShieldCheck, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bob_token")}` });

export default function AdminSecurity() {
  const { t } = useLanguage();
  const { data: currentUser } = useGetMe();
  const { data: usersData, isLoading } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: number, name: string, newRole: string} | null>(null);
  const [tfaPolicyLoading, setTfaPolicyLoading] = useState(false);
  type TfaStep = "idle" | "setup" | "disable";
  const [tfaStep, setTfaStep] = useState<TfaStep>("idle");
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [tfaOtpMsg, setTfaOtpMsg] = useState("");
  const [tfaVerifyCode, setTfaVerifyCode] = useState("");
  const [tfaDisableForm, setTfaDisableForm] = useState({ password: "" });
  const [tfaLoading, setTfaLoading] = useState(false);

  useEffect(() => {
    if (currentUser && "twoFactorEnabled" in currentUser) {
      setTfaEnabled(!!(currentUser as any).twoFactorEnabled);
    }
  }, [currentUser]);

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
    if (user.id === (currentUser as any)?.id) {
      toast({ title: "Action impossible", description: "Vous ne pouvez pas modifier votre propre rôle.", variant: "destructive" });
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setSelectedUser({ id: user.id, name: `${user.firstName} ${user.lastName}`, newRole });
    setConfirmOpen(true);
  };

  const confirmRoleChange = () => {
    if (selectedUser) {
      updateRoleMutation.mutate({ id: selectedUser.id, data: { role: selectedUser.newRole as 'admin' | 'user' } });
    }
  };

  const handleTfaPolicy = async (requireForAll: boolean) => {
    setTfaPolicyLoading(true);
    try {
      const res = await fetch("/api/admin/2fa-policy", { method: "POST", headers: authHeader(), body: JSON.stringify({ requireForAll }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast({ title: "Politique 2FA mise à jour", description: data.message, variant: "success" });
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setTfaPolicyLoading(false);
  };

  const startSetup2FA = async () => {
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST", headers: authHeader(), body: JSON.stringify({ method: "email" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setTfaOtpMsg(data.message);
      setTfaStep("setup");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setTfaLoading(false);
  };

  const resendOtp = async () => {
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/send-otp", { method: "POST", headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setTfaOtpMsg(data.message);
      toast({ title: "Code renvoyé" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setTfaLoading(false);
  };

  const enable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/enable", { method: "POST", headers: authHeader(), body: JSON.stringify({ code: tfaVerifyCode }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast({ title: "2FA activée par email !", variant: "success" });
      setTfaEnabled(true);
      setTfaStep("idle");
      setTfaVerifyCode("");
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast({ title: "Code invalide", description: err.message, variant: "destructive" });
    }
    setTfaLoading(false);
  };

  const disable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", { method: "POST", headers: authHeader(), body: JSON.stringify({ password: tfaDisableForm.password, code: "" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast({ title: "2FA désactivée" });
      setTfaEnabled(false);
      setTfaStep("idle");
      setTfaDisableForm({ password: "" });
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setTfaLoading(false);
  };

  const adminUsers = usersData?.users?.filter((u: any) => u.role === "admin") || [];
  const adminsWithout2FA = adminUsers.filter((u: any) => !u.twoFactorEnabled);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">{(t as any).admin.security.title}</h1>
        <p className="text-muted-foreground mt-1">Gérez les privilèges d'accès et les administrateurs de la plateforme.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Mon authentification à deux facteurs (2FA)</CardTitle>
              <CardDescription>Sécurisez votre compte administrateur avec un code envoyé par email à chaque connexion.</CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${tfaEnabled ? "bg-green-500/15 text-green-500 border border-green-500/30" : "bg-amber-500/15 text-amber-500 border border-amber-500/30"}`}>
              {tfaEnabled ? "✓ Activée" : "✗ Désactivée"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tfaStep === "idle" && (
            tfaEnabled ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-green-600">La 2FA est activée sur votre compte admin</p>
                    <p className="text-xs text-muted-foreground mt-1">Un code email vous est demandé à chaque connexion.</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setTfaStep("disable")}>
                  <Lock className="w-4 h-4 mr-2" /> Désactiver la 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-amber-600">Votre compte admin n'est pas protégé par la 2FA</p>
                    <p className="text-xs text-muted-foreground mt-1">Un code sera envoyé à <strong>{(currentUser as any)?.email}</strong> à chaque connexion.</p>
                  </div>
                </div>
                <Button onClick={startSetup2FA} disabled={tfaLoading}>
                  <Shield className="w-4 h-4 mr-2" /> {tfaLoading ? "Envoi du code..." : "Activer la 2FA par email"}
                </Button>
              </div>
            )
          )}
          {tfaStep === "setup" && (
            <div className="space-y-6 max-w-md">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{tfaOtpMsg || "Code envoyé par email"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Vérifiez : <strong>{(currentUser as any)?.email}</strong></p>
                </div>
              </div>
              <form onSubmit={enable2FA} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Code à 6 chiffres</p>
                  <Input type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                    value={tfaVerifyCode} onChange={e => setTfaVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-2xl tracking-widest font-bold" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button type="submit" disabled={tfaLoading || tfaVerifyCode.length !== 6}>{tfaLoading ? "Activation..." : "Activer la 2FA"}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={resendOtp} disabled={tfaLoading}>Renvoyer le code</Button>
                  <Button type="button" variant="outline" onClick={() => { setTfaStep("idle"); setTfaVerifyCode(""); }}>Annuler</Button>
                </div>
              </form>
            </div>
          )}
          {tfaStep === "disable" && (
            <form onSubmit={disable2FA} className="space-y-4 max-w-md">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600">Entrez votre mot de passe pour confirmer la désactivation.</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Mot de passe</p>
                <Input type="password" required value={tfaDisableForm.password} onChange={e => setTfaDisableForm({ password: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="destructive" disabled={tfaLoading}>{tfaLoading ? "Désactivation..." : "Confirmer"}</Button>
                <Button type="button" variant="outline" onClick={() => { setTfaStep("idle"); setTfaDisableForm({ password: "" }); }}>Annuler</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Politique d'authentification 2FA</CardTitle>
          <CardDescription>Définissez les règles d'authentification pour tous les administrateurs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Exiger la 2FA pour tous les admins</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {adminsWithout2FA.length > 0 ? `⚠️ ${adminsWithout2FA.length} administrateur(s) n'ont pas encore activé la 2FA` : "✓ Tous les administrateurs ont la 2FA activée"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => handleTfaPolicy(false)} disabled={tfaPolicyLoading}>Rendre optionnelle</Button>
              <Button size="sm" onClick={() => handleTfaPolicy(true)} disabled={tfaPolicyLoading} className="gap-1">
                <ShieldCheck className="w-4 h-4" /> Exiger pour tous
              </Button>
            </div>
          </div>
          {adminsWithout2FA.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Admins sans 2FA :</p>
              {adminsWithout2FA.map((u: any) => (
                <div key={u.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{u.firstName} {u.lastName}</span>
                  <span className="text-muted-foreground">— {u.email}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                      {u.role === 'admin' ? <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">Administrateur</Badge> : <Badge variant="outline">Utilisateur</Badge>}
                    </TableCell>
                    <TableCell>
                      {u.status === 'active' ? <Badge variant="success">Actif</Badge> : <Badge variant="outline">{u.status}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant={u.role === 'admin' ? "outline" : "secondary"} size="sm" onClick={() => handleToggleRole(u)}
                        disabled={u.id === (currentUser as any)?.id}
                        className={u.role === 'admin' ? "text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 border-orange-500/30" : ""}>
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
              <ShieldAlert className="w-5 h-5" /> Confirmer le changement de rôle
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              Êtes-vous sûr de vouloir {selectedUser?.newRole === 'admin' ? 'donner' : 'retirer'} les droits d'administration à <strong className="text-foreground">{selectedUser?.name}</strong> ?
              {selectedUser?.newRole === 'admin' && " Cet utilisateur aura un accès complet à la plateforme."}
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
