import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Globe, Home, Info, Phone, Building, Wrench, CheckCircle } from "lucide-react";

type ContentItem = {
  id: number;
  key: string;
  value: string;
  type: string;
  label: string;
  page: string;
};

const PAGE_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  about: <Info className="w-4 h-4" />,
  contact: <Phone className="w-4 h-4" />,
  general: <Building className="w-4 h-4" />,
  services: <Wrench className="w-4 h-4" />,
};

const PAGE_LABELS: Record<string, string> = {
  home: "Page d'accueil",
  about: "À propos",
  contact: "Contact",
  general: "Infos générales",
  services: "Services",
};

export default function AdminContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      const items: ContentItem[] = data.content || [];
      setContent(items);
      const initial: Record<string, string> = {};
      items.forEach(item => { initial[item.key] = item.value; });
      setEdits(initial);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger le contenu", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/content/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast({ title: "Contenu initialisé", description: `${data.count} éléments chargés en base.`, variant: "success" });
      fetchContent();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.entries(edits).map(([key, value]) => ({ key, value }));
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur");
      }
      setSaved(true);
      toast({ title: "Contenu sauvegardé", description: "Toutes les modifications ont été enregistrées.", variant: "success" });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const pages = [...new Set(content.map(c => c.page))].sort((a, b) => {
    const order = ["home", "about", "contact", "services", "general"];
    return order.indexOf(a) - order.indexOf(b);
  });

  const getPageContent = (page: string) => content.filter(c => c.page === page);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Contenu du Site</h1>
          <p className="text-muted-foreground mt-1">Modifiez les textes et informations affichés sur les pages publiques.</p>
        </div>
        <div className="flex gap-2">
          {content.length === 0 && (
            <Button variant="outline" onClick={handleSeed} disabled={seeding}>
              {seeding ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
              Initialiser le contenu
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className={saved ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Sauvegarde..." : saved ? "Enregistré !" : "Enregistrer tout"}
          </Button>
        </div>
      </div>

      {content.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Globe className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aucun contenu trouvé</h3>
            <p className="text-muted-foreground mb-6">Cliquez sur "Initialiser le contenu" pour charger les textes par défaut du site.</p>
            <Button onClick={handleSeed} disabled={seeding}>
              {seeding ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
              Initialiser le contenu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={pages[0] || "home"} className="space-y-6">
          <TabsList className="bg-secondary/50 p-1 rounded-xl flex-wrap h-auto gap-1">
            {pages.map(page => (
              <TabsTrigger key={page} value={page} className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
                {PAGE_ICONS[page] || <Globe className="w-4 h-4" />}
                {PAGE_LABELS[page] || page}
              </TabsTrigger>
            ))}
          </TabsList>

          {pages.map(page => (
            <TabsContent key={page} value={page}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {PAGE_ICONS[page] || <Globe className="w-5 h-5" />}
                    {PAGE_LABELS[page] || page}
                  </CardTitle>
                  <CardDescription>Modifiez les textes pour cette section du site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {getPageContent(page).map(item => (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">{item.label}</label>
                        <span className="text-xs text-muted-foreground/60 font-mono">{item.key}</span>
                      </div>
                      {item.type === "richtext" || (edits[item.key] || "").length > 80 ? (
                        <Textarea
                          value={edits[item.key] ?? item.value}
                          onChange={e => setEdits(prev => ({ ...prev, [item.key]: e.target.value }))}
                          rows={3}
                          className="font-sans text-sm"
                        />
                      ) : (
                        <Input
                          value={edits[item.key] ?? item.value}
                          onChange={e => setEdits(prev => ({ ...prev, [item.key]: e.target.value }))}
                          className="font-sans text-sm"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-4">
          <p className="text-sm text-amber-500 font-medium">
            Note : Les modifications sont enregistrées en base de données. Les pages publiques afficheront le contenu mis à jour après actualisation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
