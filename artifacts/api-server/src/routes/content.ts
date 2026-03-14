import { Router } from "express";
import { db } from "@workspace/db";
import { siteContentTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";

const router = Router();

const DEFAULT_CONTENT: Array<{ key: string; value: string; type: string; label: string; page: string }> = [
  // Home
  { key: "home.hero.title", value: "La Banque du Futur,\nAccessible Aujourd'hui", type: "text", label: "Titre principal", page: "home" },
  { key: "home.hero.subtitle", value: "Gérez vos actifs numériques et traditionnels avec la sécurité et la puissance d'une banque institutionnelle.", type: "text", label: "Sous-titre", page: "home" },
  { key: "home.hero.cta", value: "Ouvrir un Compte", type: "text", label: "Bouton CTA principal", page: "home" },
  { key: "home.stats.clients", value: "50 000+", type: "text", label: "Statistique clients", page: "home" },
  { key: "home.stats.assets", value: "2,1 Md€", type: "text", label: "Statistique actifs", page: "home" },
  { key: "home.stats.countries", value: "42", type: "text", label: "Statistique pays", page: "home" },
  { key: "home.stats.satisfaction", value: "98,7%", type: "text", label: "Taux de satisfaction", page: "home" },
  // About
  { key: "about.title", value: "La Banque de Blockchain", type: "text", label: "Titre page À propos", page: "about" },
  { key: "about.description", value: "Pionnier de la finance numérique depuis 2017, Bank of Blockchain réconcilie l'excellence bancaire traditionnelle avec les innovations de la blockchain.", type: "text", label: "Description", page: "about" },
  { key: "about.founded", value: "2017", type: "text", label: "Année de fondation", page: "about" },
  { key: "about.employees", value: "320+", type: "text", label: "Nombre d'employés", page: "about" },
  // Contact
  { key: "contact.email", value: "contact@bankofblockchain.com", type: "text", label: "Email de contact", page: "contact" },
  { key: "contact.phone", value: "+33 1 23 45 67 89", type: "text", label: "Téléphone", page: "contact" },
  { key: "contact.address", value: "15 Rue de la Paix, 75001 Paris, France", type: "text", label: "Adresse", page: "contact" },
  { key: "contact.hours", value: "Lun-Ven : 9h-18h | Sam : 9h-13h", type: "text", label: "Horaires d'ouverture", page: "contact" },
  // Company info
  { key: "company.name", value: "Bank of Blockchain", type: "text", label: "Nom de la société", page: "general" },
  { key: "company.tagline", value: "La Banque du Futur", type: "text", label: "Slogan", page: "general" },
  { key: "company.registration", value: "Registre du Commerce : FR 123 456 789", type: "text", label: "N° d'immatriculation", page: "general" },
  { key: "company.amf", value: "Agréé AMF — Numéro : GP-2017-XXX", type: "text", label: "Agrément AMF", page: "general" },
  { key: "company.sec", value: "SEC Registration: 802-XXXXX", type: "text", label: "Enregistrement SEC", page: "general" },
  // Services
  { key: "services.staking.rate", value: "Jusqu'à 12% de rendement annuel", type: "text", label: "Taux de staking", page: "services" },
  { key: "services.insurance.coverage", value: "Couverture jusqu'à 500 000€", type: "text", label: "Couverture assurance", page: "services" },
  { key: "services.trading.description", value: "Accédez aux marchés mondiaux avec notre licence de trading institutionnel.", type: "text", label: "Description trading", page: "services" },
];

router.get("/", async (req, res): Promise<void> => {
  try {
    const rows = await db.select().from(siteContentTable);
    if (rows.length === 0) {
      res.json({ content: DEFAULT_CONTENT.map((d, i) => ({ id: i + 1, ...d, updatedAt: new Date() })) });
      return;
    }
    res.json({ content: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { updates } = req.body || {};
    if (!Array.isArray(updates)) {
      res.status(400).json({ error: "updates array is required" });
      return;
    }

    const results = [];
    for (const { key, value } of updates) {
      if (!key || typeof value !== "string") continue;
      const existing = await db.select().from(siteContentTable).where(eq(siteContentTable.key, key)).limit(1);
      if (existing.length > 0) {
        const [updated] = await db.update(siteContentTable).set({ value, updatedAt: new Date() }).where(eq(siteContentTable.key, key)).returning();
        results.push(updated);
      } else {
        const defaults = DEFAULT_CONTENT.find(d => d.key === key);
        const [inserted] = await db.insert(siteContentTable).values({
          key,
          value,
          type: defaults?.type ?? "text",
          label: defaults?.label ?? key,
          page: defaults?.page ?? "general",
        }).returning();
        results.push(inserted);
      }
    }
    res.json({ updated: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/seed", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    for (const item of DEFAULT_CONTENT) {
      const existing = await db.select().from(siteContentTable).where(eq(siteContentTable.key, item.key)).limit(1);
      if (existing.length === 0) {
        await db.insert(siteContentTable).values(item);
      }
    }
    const rows = await db.select().from(siteContentTable);
    res.json({ message: "Contenu initialisé avec succès", count: rows.length, content: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
