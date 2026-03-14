import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, balancesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "../lib/jwt.js";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.post("/register", async (req, res): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, country, dateOfBirth } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing) {
      res.status(400).json({ error: "Bad Request", message: "Email already registered" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      email,
      passwordHash,
      firstName,
      lastName,
      phone: phone || null,
      country: country || null,
      dateOfBirth: dateOfBirth || null,
      role: "user",
      status: "pending",
    }).returning();
    await db.insert(balancesTable).values({ userId: user.id, eur: "0", usd: "0", btc: "0" });
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;
    res.status(201).json({ token, user: { ...safeUser, role: user.role, status: user.status } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: "Registration failed" });
  }
});

router.post("/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Bad Request", message: "Email and password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: "Login failed" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(404).json({ error: "Not Found", message: "User not found" });
      return;
    }
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
