import { useState, useEffect } from "react";
import { useGetMe, useGetBankAccounts, useCreateBankAccount, useDeleteBankAccount } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Building2, Shield, User as UserIcon, Eye, EyeOff, Save, Pencil, QrCode, Lock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Settings() {
  const { data: user } = useGetMe();
  const { data: accountsData, isLoading: accountsLoading } = useGetBankAccounts();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ beneficiaryName: '', iban: '', bic: '', bankName: '', country: '' });

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', country: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [savingPw, setSavingPw] = useState(false);

  // 2FA state
  type TfaStep = "idle" | "setup" | "enable" | "disable";
  const [tfaStep, setTfaStep] = useState<TfaStep>("idle");
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [tfaQr, setTfaQr] = useState("");
  const [tfaSecret, setTfaSecret] = useState("");
  const [tfaVerifyCode, setTfaVerifyCode] = useState("");
  const [tfaDisableForm, setTfaDisableForm] = useState({ password: "", code: "" });
  const [tfaLoading, setTfaLoading] = useState(false);

  useEffect(() => {
    if (user && "twoFactorEnabled" in user) {
      setTfaEnabled(!!(user as any).twoFactorEnabled);
    }
  }, [user]);

  const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bob_token")}` });

  const startSetup2FA = async () => {
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST", headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setTfaQr(data.qrCode);
      setTfaSecret(data.secret);
      setTfaStep("setup");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setTfaLoading(false);
    }
  };

  const enable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/enable", { method: "POST", headers: authHeader(), body: JSON.stringify({ code: tfaVerifyCode }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast({ title: "2FA activée !", description: "L'authentification à deux facteurs est maintenant active.", variant: "success" });
      setTfaEnabled(true);
      setTfaStep("idle");
      setTfaVerifyCode("");
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast({ title: "Code invalide", description: err.message, variant: "destructive" });
    } finally {
      setTfaLoading(false);
    }
  };

  const disable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", { method: "POST", headers: authHeader(), body: JSON.stringify(tfaDisableForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast({ title: "2FA désactivée", description: "L'authentification à deux facteurs a été désactivée." });
      setTfaEnabled(false);
      setTfaStep("idle");
      setTfaDisableForm({ password: "", code: "" });
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setTfaLoading(false);
    }
  };

  const createAccountMutation = useCreateBankAccount({
    mutation: {
      onSuccess: () => {
        toast({ title: "Compte ajouté avec succès", variant: "success" });
        setAddAccountOpen(false);
        setNewAccount({ beneficiaryName: '', iban: '', bic: '', bankName: '', country: '' });
        queryClient.invalidateQueries();
      },
      onError: (err: any) => {
        toast({ title: "Erreur", description: err.message || "Impossible d'ajouter le compte", variant: "destructive" });
      }
    }
  });

  const deleteAccountMutation = useDeleteBankAccount({
    mutation: {
      onSuccess: () => {
        toast({ title: "Compte supprimé" });
        queryClient.invalidateQueries();
      }
    }
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    createAccountMutation.mutate({ data: newAccount });
  };

  const startEditProfile = () => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      country: user?.country || '',
    });
    setEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bob_token')}`
        },
        body: JSON.stringify(profileForm)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur lors de la mise à jour');
      }
      toast({ title: "Profil mis à jour avec succès", variant: "success" });
      queryClient.invalidateQueries();
      setEditingProfile(false);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast({ title: "Erreur", description: "Les nouveaux mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 8 caractères", variant: "destructive" });
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch('/api/auth/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bob_token')}`
        },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      toast({ title: "Mot de passe mis à jour", variant: "success" });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Paramètres du Compte</h1>
        <p className="text-muted-foreground mt-1">Gérez vos informations personnelles et vos coordonnées bancaires.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UserIcon className="w-4 h-4 mr-2" /> Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="w-4 h-4 mr-2" /> Sécurité
          </TabsTrigger>
          <TabsTrigger value="banks" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="w-4 h-4 mr-2" /> Comptes Bancaires
          </TabsTrigger>
        </TabsList>

        {/* === PROFILE TAB === */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>Vos coordonnées d'identité.</CardDescription>
              </div>
              {!editingProfile && (
                <Button variant="outline" size="sm" onClick={startEditProfile}>
                  <Pencil className="w-4 h-4 mr-2" /> Modifier
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user?.email || ''} readOnly className="bg-secondary/20 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input id="country" value={profileForm.country} onChange={e => setProfileForm({ ...profileForm, country: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={savingProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      {savingProfile ? "Sauvegarde..." : "Enregistrer les modifications"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>Annuler</Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Prénom", value: user?.firstName },
                    { label: "Nom", value: user?.lastName },
                    { label: "Email", value: user?.email },
                    { label: "Téléphone", value: user?.phone || "—" },
                    { label: "Pays", value: user?.country || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">{label}</Label>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SECURITY TAB === */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 max-w-md" onSubmit={handleChangePassword}>
                <div className="space-y-2">
                  <Label htmlFor="currentPw">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input id="currentPw" type={showPw.current ? "text" : "password"} value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(s => ({ ...s, current: !s.current }))}>
                      {showPw.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPw">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input id="newPw" type={showPw.new ? "text" : "password"} value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(s => ({ ...s, new: !s.new }))}>
                      {showPw.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPw">Confirmer le nouveau mot de passe</Label>
                  <div className="relative">
                    <Input id="confirmPw" type={showPw.confirm ? "text" : "password"} value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}>
                      {showPw.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={savingPw}>{savingPw ? "Mise à jour..." : "Mettre à jour le mot de passe"}</Button>
              </form>
            </CardContent>
          </Card>

          {/* === 2FA CARD === */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Authentification à deux facteurs (2FA)
                  </CardTitle>
                  <CardDescription>Protégez votre compte avec une couche de sécurité supplémentaire.</CardDescription>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${tfaEnabled ? "bg-green-500/15 text-green-500 border border-green-500/30" : "bg-amber-500/15 text-amber-500 border border-amber-500/30"}`}>
                  {tfaEnabled ? "✓ Activée" : "✗ Désactivée"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tfaStep === "idle" && (
                <div>
                  {tfaEnabled ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-green-600">La 2FA est activée sur votre compte</p>
                          <p className="text-xs text-muted-foreground mt-1">Vous devez saisir un code à chaque connexion. Votre compte bénéficie d'une protection renforcée.</p>
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
                          <p className="font-semibold text-sm text-amber-600">Votre compte n'est pas protégé par la 2FA</p>
                          <p className="text-xs text-muted-foreground mt-1">Activez l'authentification à deux facteurs pour protéger votre compte contre les accès non autorisés.</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vous aurez besoin d'une application d'authentification comme <strong>Google Authenticator</strong> ou <strong>Authy</strong>.
                      </p>
                      <Button onClick={startSetup2FA} disabled={tfaLoading}>
                        <QrCode className="w-4 h-4 mr-2" />
                        {tfaLoading ? "Chargement..." : "Configurer la 2FA"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {tfaStep === "setup" && (
                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Étape 1 — Scannez le QR code</p>
                    <p className="text-xs text-muted-foreground">Ouvrez votre application d'authentification et scannez ce code QR.</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-3 bg-white rounded-xl border shadow-sm">
                      <img src={tfaQr} alt="QR Code 2FA" className="w-44 h-44" />
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Clé manuelle (si vous ne pouvez pas scanner) :</p>
                    <code className="text-xs font-mono break-all text-foreground">{tfaSecret}</code>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Étape 2 — Vérifiez le code</p>
                    <p className="text-xs text-muted-foreground">Entrez le code à 6 chiffres affiché dans votre application pour finaliser la configuration.</p>
                  </div>
                  <form onSubmit={enable2FA} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Code de vérification</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={tfaVerifyCode}
                        onChange={e => setTfaVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="text-center text-2xl tracking-widest font-bold"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={tfaLoading || tfaVerifyCode.length !== 6}>
                        {tfaLoading ? "Activation..." : "Activer la 2FA"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setTfaStep("idle"); setTfaVerifyCode(""); }}>Annuler</Button>
                    </div>
                  </form>
                </div>
              )}

              {tfaStep === "disable" && (
                <form onSubmit={disable2FA} className="space-y-4 max-w-md">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-600">Pour confirmer la désactivation, entrez votre mot de passe et votre code 2FA actuel.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Mot de passe</Label>
                    <Input type="password" required value={tfaDisableForm.password} onChange={e => setTfaDisableForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Code 2FA actuel</Label>
                    <Input type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                      value={tfaDisableForm.code} onChange={e => setTfaDisableForm(f => ({ ...f, code: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                      className="text-center text-xl tracking-widest font-bold" />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="destructive" disabled={tfaLoading}>
                      {tfaLoading ? "Désactivation..." : "Confirmer la désactivation"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setTfaStep("idle"); setTfaDisableForm({ password: "", code: "" }); }}>Annuler</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === BANK ACCOUNTS TAB === */}
        <TabsContent value="banks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Comptes Bancaires Enregistrés</CardTitle>
                <CardDescription>Gérez vos IBAN pour les virements sortants.</CardDescription>
              </div>
              <Dialog open={addAccountOpen} onOpenChange={setAddAccountOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un compte bancaire</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAccount} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Nom du bénéficiaire</Label>
                      <Input required value={newAccount.beneficiaryName} onChange={e => setNewAccount({ ...newAccount, beneficiaryName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>IBAN</Label>
                      <Input required value={newAccount.iban} onChange={e => setNewAccount({ ...newAccount, iban: e.target.value })} placeholder="FR76..." />
                    </div>
                    <div className="space-y-2">
                      <Label>BIC / SWIFT</Label>
                      <Input required value={newAccount.bic} onChange={e => setNewAccount({ ...newAccount, bic: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom de la banque</Label>
                        <Input required value={newAccount.bankName} onChange={e => setNewAccount({ ...newAccount, bankName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Pays</Label>
                        <Input required value={newAccount.country} onChange={e => setNewAccount({ ...newAccount, country: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={createAccountMutation.isPending}>Ajouter le compte</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {accountsLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : !accountsData?.accounts || accountsData.accounts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Aucun compte bancaire enregistré.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bénéficiaire</TableHead>
                      <TableHead>Banque</TableHead>
                      <TableHead>IBAN</TableHead>
                      <TableHead>BIC</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsData.accounts.map(acc => (
                      <TableRow key={acc.id}>
                        <TableCell className="font-medium">{acc.beneficiaryName}</TableCell>
                        <TableCell>{acc.bankName}</TableCell>
                        <TableCell className="font-mono text-sm">{acc.iban}</TableCell>
                        <TableCell className="font-mono text-sm">{acc.bic}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => deleteAccountMutation.mutate({ id: acc.id })}
                            disabled={deleteAccountMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
