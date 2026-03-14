import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Save, Pencil, User, Shield, Eye, EyeOff, Lock, CheckCircle2, AlertTriangle, QrCode, ShieldCheck, Download } from "lucide-react";
import { exportUserActivityPDF } from "@/lib/pdf";

const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("bob_token")}` });

export default function AdminProfile() {
  const { t } = useLanguage();
  const { data: user } = useGetMe();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "", country: "", dateOfBirth: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [savingPw, setSavingPw] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);

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

  const startEditProfile = () => {
    setProfileForm({
      firstName: (user as any)?.firstName || "",
      lastName: (user as any)?.lastName || "",
      phone: (user as any)?.phone || "",
      country: (user as any)?.country || "",
      dateOfBirth: (user as any)?.dateOfBirth || "",
    });
    setEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/me", { method: "PATCH", headers: authHeader(), body: JSON.stringify(profileForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      toast({ title: "Profil mis à jour", variant: "success" });
      queryClient.invalidateQueries();
      setEditingProfile(false);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" }); return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/auth/me/password", { method: "PATCH", headers: authHeader(), body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      toast({ title: "Mot de passe mis à jour", variant: "success" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setSavingPw(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) { toast({ title: "Image trop lourde", description: "Max 1.5 MB", variant: "destructive" }); return; }
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const avatarUrl = ev.target?.result as string;
        const res = await fetch("/api/auth/me/avatar", { method: "PATCH", headers: authHeader(), body: JSON.stringify({ avatarUrl }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur");
        toast({ title: "Photo mise à jour", variant: "success" });
        queryClient.invalidateQueries();
      } catch (err: any) {
        toast({ title: "Erreur", description: err.message, variant: "destructive" });
      }
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/auth/export", { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      exportUserActivityPDF(data);
      toast({ title: "PDF généré", variant: "success" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setExporting(false);
  };

  const startSetup2FA = async () => {
    setTfaLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST", headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setTfaQr(data.qrCode); setTfaSecret(data.secret); setTfaStep("setup");
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
      toast({ title: "2FA activée !", variant: "success" });
      setTfaEnabled(true); setTfaStep("idle"); setTfaVerifyCode("");
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
      const res = await fetch("/api/auth/2fa/disable", { method: "POST", headers: authHeader(), body: JSON.stringify(tfaDisableForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast({ title: "2FA désactivée" });
      setTfaEnabled(false); setTfaStep("idle"); setTfaDisableForm({ password: "", code: "" });
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setTfaLoading(false);
  };

  const adminUser = user as any;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">{(t as any).admin.profile.title}</h1>
          <p className="text-muted-foreground mt-1">Gérez vos informations personnelles et votre sécurité.</p>
        </div>
        <Button onClick={handleExportPDF} disabled={exporting} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> {exporting ? "Génération…" : "Exporter PDF"}
        </Button>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            {adminUser?.avatarUrl
              ? <img src={adminUser.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-primary/50 group-hover:opacity-75 transition-opacity" />
              : <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary border-4 border-primary/30 group-hover:opacity-75 transition-opacity">{adminUser?.firstName?.[0]}{adminUser?.lastName?.[0]}</div>}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xl font-bold">{adminUser?.firstName} {adminUser?.lastName}</p>
              <p className="text-muted-foreground">{adminUser?.email}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border border-primary/30">⚡ Administrateur</Badge>
              {adminUser?.adminRole && <Badge variant="outline">{adminUser.adminRole}</Badge>}
              {adminUser?.twoFactorEnabled && <Badge variant="success">2FA Active</Badge>}
            </div>
            <Button size="sm" variant="outline" onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar} className="gap-1">
              <Camera className="w-3.5 h-3.5" /> {uploadingAvatar ? "Téléchargement…" : "Changer la photo"}
            </Button>
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" /> Profil</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" /> Sécurité & 2FA</TabsTrigger>
          {adminUser?.adminPermissions && <TabsTrigger value="permissions"><ShieldCheck className="w-4 h-4 mr-2" /> Mes permissions</TabsTrigger>}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Vos coordonnées modifiables.</CardDescription>
              </div>
              {!editingProfile && (
                <Button variant="outline" size="sm" onClick={startEditProfile}><Pencil className="w-4 h-4 mr-2" /> Modifier</Button>
              )}
            </CardHeader>
            <CardContent>
              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Prénom</Label>
                      <Input value={profileForm.firstName} onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))} required />
                    </div>
                    <div className="space-y-1">
                      <Label>Nom</Label>
                      <Input value={profileForm.lastName} onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))} required />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input value={adminUser?.email || ""} readOnly className="bg-secondary/20 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                      <Label>Téléphone</Label>
                      <Input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <Label>Pays</Label>
                      <Input value={profileForm.country} onChange={e => setProfileForm(p => ({ ...p, country: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <Label>Date de naissance</Label>
                      <Input type="date" value={profileForm.dateOfBirth} onChange={e => setProfileForm(p => ({ ...p, dateOfBirth: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={savingProfile}><Save className="w-4 h-4 mr-2" />{savingProfile ? "Sauvegarde…" : "Enregistrer"}</Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>Annuler</Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Prénom", value: adminUser?.firstName },
                    { label: "Nom", value: adminUser?.lastName },
                    { label: "Email", value: adminUser?.email },
                    { label: "Téléphone", value: adminUser?.phone || "—" },
                    { label: "Pays", value: adminUser?.country || "—" },
                    { label: "Date de naissance", value: adminUser?.dateOfBirth || "—" },
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

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                {[
                  { id: "current", label: "Mot de passe actuel", field: "currentPassword" as const, show: showPw.current, toggle: () => setShowPw(s => ({ ...s, current: !s.current })) },
                  { id: "new", label: "Nouveau mot de passe", field: "newPassword" as const, show: showPw.new, toggle: () => setShowPw(s => ({ ...s, new: !s.new })) },
                  { id: "confirm", label: "Confirmer", field: "confirmPassword" as const, show: showPw.confirm, toggle: () => setShowPw(s => ({ ...s, confirm: !s.confirm })) },
                ].map(({ id, label, field, show, toggle }) => (
                  <div key={id} className="space-y-1">
                    <Label>{label}</Label>
                    <div className="relative">
                      <Input type={show ? "text" : "password"} value={pwForm[field]} onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))} required />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={toggle}>
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <Button type="submit" disabled={savingPw}>{savingPw ? "Mise à jour…" : "Mettre à jour"}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Authentification 2FA</CardTitle>
                  <CardDescription>Sécurisez votre accès administrateur.</CardDescription>
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
                        <p className="font-semibold text-sm text-green-600">2FA activée sur votre compte admin</p>
                        <p className="text-xs text-muted-foreground mt-1">Votre accès administrateur est protégé.</p>
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
                        <p className="font-semibold text-sm text-amber-600">Compte admin non protégé par la 2FA</p>
                        <p className="text-xs text-muted-foreground mt-1">Il est fortement recommandé d'activer la 2FA pour les comptes administrateurs.</p>
                      </div>
                    </div>
                    <Button onClick={startSetup2FA} disabled={tfaLoading}>
                      <QrCode className="w-4 h-4 mr-2" /> {tfaLoading ? "Chargement…" : "Configurer la 2FA"}
                    </Button>
                  </div>
                )
              )}

              {tfaStep === "setup" && (
                <div className="space-y-6 max-w-md">
                  <p className="font-semibold text-sm">Étape 1 — Scannez le QR code</p>
                  <div className="bg-white p-4 rounded-xl w-fit"><img src={tfaQr} alt="QR Code 2FA" className="w-48 h-48" /></div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Ou saisissez manuellement :</p>
                    <code className="block p-2 bg-secondary rounded text-xs break-all">{tfaSecret}</code>
                  </div>
                  <form onSubmit={enable2FA} className="space-y-3">
                    <div className="space-y-1">
                      <Label>Étape 2 — Code de vérification</Label>
                      <Input value={tfaVerifyCode} onChange={e => setTfaVerifyCode(e.target.value)} placeholder="000000" maxLength={6} className="w-40 text-center text-lg tracking-widest" />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={tfaLoading || tfaVerifyCode.length !== 6}>{tfaLoading ? "Vérification…" : "Activer la 2FA"}</Button>
                      <Button type="button" variant="ghost" onClick={() => setTfaStep("idle")}>Annuler</Button>
                    </div>
                  </form>
                </div>
              )}

              {tfaStep === "disable" && (
                <form onSubmit={disable2FA} className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <Label>Mot de passe</Label>
                    <Input type="password" value={tfaDisableForm.password} onChange={e => setTfaDisableForm(p => ({ ...p, password: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Code 2FA</Label>
                    <Input value={tfaDisableForm.code} onChange={e => setTfaDisableForm(p => ({ ...p, code: e.target.value }))} placeholder="000000" maxLength={6} className="w-40 text-center text-lg tracking-widest" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="destructive" disabled={tfaLoading}>{tfaLoading ? "Désactivation…" : "Confirmer la désactivation"}</Button>
                    <Button type="button" variant="ghost" onClick={() => setTfaStep("idle")}>Annuler</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        {adminUser?.adminPermissions && (
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Mes permissions</CardTitle>
                <CardDescription>Accès accordés par le super administrateur.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(typeof adminUser.adminPermissions === "string" ? JSON.parse(adminUser.adminPermissions) : adminUser.adminPermissions).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm capitalize">{key.replace(/_/g, " ")}</span>
                      <Badge variant={val ? "success" : "outline"} className="text-xs">{val ? "✓ Accordé" : "✗ Refusé"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
