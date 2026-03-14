import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable, usersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res): Promise<void> => {
  try {
    const isAdmin = req.userRole === "admin";
    const rows = isAdmin
      ? await db.select().from(notificationsTable).orderBy(desc(notificationsTable.createdAt)).limit(100)
      : await db.select().from(notificationsTable).where(eq(notificationsTable.userId, req.userId!)).orderBy(desc(notificationsTable.createdAt)).limit(50);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { userId, title, message, type, sendToAll } = req.body;
    if (!title || !message || !type) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }
    if (sendToAll) {
      const users = await db.select({ id: usersTable.id }).from(usersTable);
      const notifs = await db.insert(notificationsTable).values(
        users.map(u => ({ userId: u.id, title, message, type, isRead: false }))
      ).returning();
      res.status(201).json(notifs[0]);
      return;
    }
    if (!userId) {
      res.status(400).json({ error: "Bad Request", message: "userId or sendToAll required" });
      return;
    }
    const [notif] = await db.insert(notificationsTable).values({ userId, title, message, type, isRead: false }).returning();
    res.status(201).json(notif);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/read", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params["id"]!);
    await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, id));
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
