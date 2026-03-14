import { useState, useRef } from "react";
import { useGetUsers, useActivateUser, useSuspendUser } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Plus, Eye, Settings2, UserPlus, ShieldCheck, Search, Euro, DollarSign, Bitcoin, ArrowRightLeft, CreditCard, Zap, KeyRound } from "lucide-react";

const ADMIN_PERMISSIONS = [
  { key: "manage_users", label: "Gestion des utilisateurs" },
  { key: "manage_transactions", label: "Valider/Rejeter transactions" },
  { key: "manage_transfers", label: "Valider/Rejeter virements" },
  { key: "manage_balances", label: "Modifier les soldes" },
  { key: "manage_notifications", label: "Envoyer des notifications" },
  { key: "manage_content", label: "Modifier le contenu du site" },
  { key: "view_logs", label: "Voir les journaux système" },
  { key: "manage_security", label: "Gestion de la sécurité" },
  { key: "create_admin", label: "Créer des sous-admins" },
];

const ADMIN_ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "manager", label: "Manager" },
  { value: "support", label: "Support client" },
  { value: "analyst", label: "Analyste" },
  { value: "compliance", label: "Conformité" },
];

const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bob_token")}` });

export default function AdminUsers() {
  const { data, isLoading } = useGetUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [newUser, setNewUser] = useState({
    email: "", password: "", firstName: "", lastName: "",
    phone: "", country: "", dateOfBirth: "", role: "user", status: "active",
    adminRole: "", adminPermissions: {} as Record<string, boolean>,
  });
  const [creating, setCreating] = useState(false);

  const [permForm, setPermForm] = useState({
    adminRole: "", permissions: {} as Record<string, boolean>, twoFactorRequired: false
  });
  const [savingPerm, setSavingPerm] = useState(false);
  const [resetPwValue, setResetPwValue] = useState("");
  const [resetPwLoading, setResetPwLoading] = useState(false);

  const activateUser = useActivateUser({ mutation: { onSuccess: () => { toast({ title: "Utilisateur activé", variant: "success" }); queryClient.invalidateQueries(); } } });
  const suspendUser = useSuspendUser({ mutation: { onSuccess: () => { toast({ title: "Utilisateur suspendu" }); queryClient.invalidateQueries(); } } });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Actif</Badge>;
      case 'pending': return <Badge variant="warning">En attente</Badge>;
      case 'suspended': return <Badge variant="destructive">Suspendu</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openDetail = async (user: any) => {
    setSelectedUser(user);
    setDetailOpen(true);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { headers: authHeader() });
      const data = await res.json();
      setSelectedUserDetail(data);
    } catch { toast({ title: "Erreur", description: "Impossible de charger les détails", variant: "destructive" }); }
    setLoadingDetail(false);
  };

  const openPermissions = (user: any) => {
    setSelectedUser(user);
    let perms: Record<string, boolean> = {};
    try { perms = typeof user.adminPermissions === "string" ? JSON.parse(user.adminPermissions) : (user.adminPermissions || {}); } catch {}
    setPermForm({ adminRole: user.adminRole || "", permissions: perms, twoFactorRequired: user.twoFactorRequired || false });
    setPermOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...newUser,
        adminPermissions: newUser.role === "admin" ? newUser.adminPermissions : undefined,
        adminRole: newUser.role === "admin" ? newUser.adminRole : undefined,
      };
      const res = await fetch("/api/users", { method: "POST", headers: authHeader(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
      toast({ title: "Compte créé avec succès", variant: "success" });
      queryClient.invalidateQueries();
      setCreateOpen(false);
      setNewUser({ email: "", password: "", firstName: "", lastName: "", phone: "", country: "", dateOfBirth: "", role: "user", status: "active", adminRole: "", adminPermissions: {} });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setCreating(false);
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setSavingPerm(true);
    try {
      const res = await fetch(`/api/users/${selectedUser.id}/permissions`, {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ adminRole: permForm.adminRole, adminPermissions: permForm.permissions, twoFactorRequired: permForm.twoFactorRequired }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Permissions mises à jour", variant: "success" });
      queryClient.invalidateQueries();
      setPermOpen(false);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setSavingPerm(false);
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !resetPwValue.trim()) return;
    setResetPwLoading(true);
    try {
      const res = await fetch(`/api/users/${selectedUser.id}/reset-password`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ newPassword: resetPwValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la réinitialisation");
      toast({ title: "Mot de passe réinitialisé", description: "L'utilisateur a été notifié.", variant: "success" });
      setResetPwValue("");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setResetPwLoading(false);
  };

  const filteredUsers = data?.users?.filter((u: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.email.toLowerCase().includes(q) || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Gérez les clients et les administrateurs.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" /> Créer un compte
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Badge variant="outline" className="text-sm">{filteredUsers.length} compte{filteredUsers.length !== 1 ? "s" : ""}</Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.avatarUrl
                          ? <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                          : <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{user.firstName?.[0]}{user.lastName?.[0]}</div>}
                        {user.firstName} {user.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.country || '—'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Badge variant="outline" className={user.role === 'admin' ? 'border-primary text-primary w-fit' : 'w-fit'}>
                          {user.role === 'admin' ? '⚡ Admin' : 'Client'}
                        </Badge>
                        {user.adminRole && <span className="text-xs text-muted-foreground">{user.adminRole}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.twoFactorEnabled
                        ? <Badge variant="success" className="text-xs">Activée</Badge>
                        : <Badge variant="outline" className="text-xs text-muted-foreground">Non</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openDetail(user)} title="Voir détails">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user.role === 'admin' && (
                          <Button size="sm" variant="ghost" onClick={() => openPermissions(user)} title="Gérer permissions">
                            <Settings2 className="w-4 h-4" />
                          </Button>
                        )}
                        {user.status !== 'active' && (
                          <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                            onClick={() => activateUser.mutate({ id: user.id })} disabled={activateUser.isPending}>
                            <CheckCircle className="w-3 h-3 mr-1" /> Activer
                          </Button>
                        )}
                        {user.status !== 'suspended' && user.role !== 'admin' && (
                          <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                            onClick={() => suspendUser.mutate({ id: user.id })} disabled={suspendUser.isPending}>
                            <XCircle className="w-3 h-3 mr-1" /> Suspendre
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          )}
        </CardContent>
      </Card>

      {/* ── Create User Modal ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Créer un compte</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Prénom *</Label>
                <Input value={newUser.firstName} onChange={e => setNewUser(p => ({ ...p, firstName: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <Label>Nom *</Label>
                <Input value={newUser.lastName} onChange={e => setNewUser(p => ({ ...p, lastName: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email *</Label>
              <Input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Mot de passe *</Label>
              <Input type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} required minLength={8} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Téléphone</Label>
                <Input value={newUser.phone} onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Pays</Label>
                <Input value={newUser.country} onChange={e => setNewUser(p => ({ ...p, country: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Date de naissance</Label>
                <Input type="date" value={newUser.dateOfBirth} onChange={e => setNewUser(p => ({ ...p, dateOfBirth: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Statut initial</Label>
                <Select value={newUser.status} onValueChange={v => setNewUser(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />
            <div className="space-y-1">
              <Label>Type de compte</Label>
              <Select value={newUser.role} onValueChange={v => setNewUser(p => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Client</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newUser.role === "admin" && (
              <div className="border border-primary/20 rounded-lg p-4 space-y-4 bg-primary/5">
                <p className="text-sm font-medium text-primary flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Configuration administrateur</p>
                <div className="space-y-1">
                  <Label>Rôle admin</Label>
                  <Select value={newUser.adminRole} onValueChange={v => setNewUser(p => ({ ...p, adminRole: v }))}>
                    <SelectTrigger><SelectValue placeholder="Choisir un rôle" /></SelectTrigger>
                    <SelectContent>
                      {ADMIN_ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Permissions accordées</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {ADMIN_PERMISSIONS.map(p => (
                      <div key={p.key} className="flex items-center justify-between">
                        <span className="text-sm">{p.label}</span>
                        <Switch
                          checked={!!newUser.adminPermissions[p.key]}
                          onCheckedChange={v => setNewUser(prev => ({ ...prev, adminPermissions: { ...prev.adminPermissions, [p.key]: v } }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={creating}>{creating ? "Création…" : "Créer le compte"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── User Detail Modal ── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : selectedUserDetail && (
            <Tabs defaultValue="profile">
              <TabsList className="w-full">
                <TabsTrigger value="profile" className="flex-1">Profil</TabsTrigger>
                <TabsTrigger value="balances" className="flex-1">Soldes</TabsTrigger>
                <TabsTrigger value="transfers" className="flex-1">Virements</TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-3 pt-2">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  {selectedUserDetail.avatarUrl
                    ? <img src={selectedUserDetail.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                    : <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">{selectedUserDetail.firstName?.[0]}{selectedUserDetail.lastName?.[0]}</div>}
                  <div>
                    <p className="font-bold text-lg">{selectedUserDetail.firstName} {selectedUserDetail.lastName}</p>
                    <p className="text-muted-foreground text-sm">{selectedUserDetail.email}</p>
                    <div className="flex gap-2 mt-1">
                      {getStatusBadge(selectedUserDetail.status)}
                      <Badge variant="outline" className={selectedUserDetail.role === 'admin' ? 'border-primary text-primary' : ''}>{selectedUserDetail.role}</Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Téléphone", value: selectedUserDetail.phone },
                    { label: "Pays", value: selectedUserDetail.country },
                    { label: "Date de naissance", value: selectedUserDetail.dateOfBirth },
                    { label: "2FA", value: selectedUserDetail.twoFactorEnabled ? "Activée" : "Non activée" },
                    { label: "Rôle admin", value: selectedUserDetail.adminRole },
                    { label: "Membre depuis", value: formatDate(selectedUserDetail.createdAt) },
                  ].map(({ label, value }) => value && (
                    <div key={label} className="bg-muted/40 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                {selectedUserDetail.bankAccounts?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Comptes bancaires enregistrés</p>
                    {selectedUserDetail.bankAccounts.map((acc: any) => (
                      <div key={acc.id} className="flex items-center gap-3 border rounded-lg p-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{acc.beneficiaryName} — {acc.bankName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{acc.iban}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-semibold flex items-center gap-2"><KeyRound className="w-4 h-4 text-primary" /> Réinitialiser le mot de passe</p>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Nouveau mot de passe..."
                      value={resetPwValue}
                      onChange={e => setResetPwValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleResetPassword}
                      disabled={resetPwLoading || resetPwValue.trim().length < 6}
                      variant="destructive"
                      size="sm"
                    >
                      {resetPwLoading ? "..." : "Réinitialiser"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Le mot de passe doit contenir au moins 6 caractères. L'utilisateur recevra une notification.</p>
                </div>
              </TabsContent>

              <TabsContent value="balances">
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {[
                    { label: "EUR", value: `€ ${selectedUserDetail.balances?.eur?.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) || "0.00"}`, icon: <Euro className="w-5 h-5" /> },
                    { label: "USD", value: `$ ${selectedUserDetail.balances?.usd?.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) || "0.00"}`, icon: <DollarSign className="w-5 h-5" /> },
                    { label: "BTC", value: `₿ ${selectedUserDetail.balances?.btc?.toFixed(6) || "0.000000"}`, icon: <Bitcoin className="w-5 h-5" /> },
                  ].map(({ label, value, icon }) => (
                    <Card key={label}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-primary mb-2">{icon}<span className="font-bold">{label}</span></div>
                        <p className="text-xl font-mono font-bold">{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="transfers" className="space-y-4 pt-2">
                <div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-1"><ArrowRightLeft className="w-4 h-4" /> Virements bancaires ({selectedUserDetail.bankTransfers?.length || 0})</p>
                  {selectedUserDetail.bankTransfers?.length === 0 ? <p className="text-sm text-muted-foreground">Aucun virement bancaire</p> : (
                    <div className="space-y-2">
                      {selectedUserDetail.bankTransfers?.map((t: any) => (
                        <div key={t.id} className="border rounded-lg p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{formatCurrency(t.amount, t.currency)}</span>
                            <Badge variant={t.status === 'completed' ? 'success' : t.status === 'rejected' ? 'destructive' : 'warning'} className="text-xs">{t.status}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p>Bénéficiaire : {t.beneficiaryName}</p>
                            <p className="font-mono">IBAN : {t.iban}</p>
                            {t.bic && <p>BIC : {t.bic}</p>}
                            {t.description && <p>Motif : {t.description}</p>}
                            <p>{formatDate(t.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-1"><Zap className="w-4 h-4" /> Transferts crypto ({selectedUserDetail.cryptoTransfers?.length || 0})</p>
                  {selectedUserDetail.cryptoTransfers?.length === 0 ? <p className="text-sm text-muted-foreground">Aucun transfert crypto</p> : (
                    <div className="space-y-2">
                      {selectedUserDetail.cryptoTransfers?.map((t: any) => (
                        <div key={t.id} className="border rounded-lg p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{t.amount} {t.cryptocurrency}</span>
                            <Badge variant={t.status === 'completed' ? 'success' : t.status === 'rejected' ? 'destructive' : 'warning'} className="text-xs">{t.status}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p className="font-mono break-all">Adresse : {t.walletAddress}</p>
                            {t.description && <p>Note : {t.description}</p>}
                            <p>{formatDate(t.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="pt-2">
                <p className="text-sm font-semibold mb-2">{selectedUserDetail.transactions?.length || 0} transaction{selectedUserDetail.transactions?.length !== 1 ? "s" : ""}</p>
                {selectedUserDetail.transactions?.length === 0 ? <p className="text-sm text-muted-foreground">Aucune transaction</p> : (
                  <div className="space-y-2">
                    {selectedUserDetail.transactions?.map((t: any) => (
                      <div key={t.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium capitalize">{t.type}</span>
                            {t.description && <span className="text-muted-foreground text-xs ml-2">— {t.description}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{formatCurrency(t.amount, t.currency)}</span>
                            <Badge variant={t.status === 'completed' ? 'success' : t.status === 'rejected' ? 'destructive' : 'warning'} className="text-xs">{t.status}</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(t.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Permissions Modal ── */}
      <Dialog open={permOpen} onOpenChange={setPermOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Permissions — {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Rôle administrateur</Label>
              <Select value={permForm.adminRole} onValueChange={v => setPermForm(p => ({ ...p, adminRole: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir un rôle" /></SelectTrigger>
                <SelectContent>
                  {ADMIN_ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>2FA obligatoire</Label>
                <p className="text-xs text-muted-foreground">Forcer l'authentification à deux facteurs</p>
              </div>
              <Switch checked={permForm.twoFactorRequired} onCheckedChange={v => setPermForm(p => ({ ...p, twoFactorRequired: v }))} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Accès par tâche</Label>
              {ADMIN_PERMISSIONS.map(p => (
                <div key={p.key} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-sm">{p.label}</span>
                  <Switch
                    checked={!!permForm.permissions[p.key]}
                    onCheckedChange={v => setPermForm(prev => ({ ...prev, permissions: { ...prev.permissions, [p.key]: v } }))}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setPermOpen(false)}>Annuler</Button>
              <Button onClick={handleSavePermissions} disabled={savingPerm}>{savingPerm ? "Sauvegarde…" : "Sauvegarder"}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
