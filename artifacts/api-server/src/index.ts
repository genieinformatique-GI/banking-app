import app from "./app";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function ensureAdminExists() {
  try {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, "admin@blockchainbank.com")).limit(1);
    if (!existing) {
      const passwordHash = await bcrypt.hash("Adminpassword123!", 10);
      await db.insert(usersTable).values({
        email: "admin@blockchainbank.com",
        passwordHash,
        firstName: "Admin",
        lastName: "Blockchain",
        role: "admin",
        status: "active",
      });
      console.log("✅ Admin créé avec succès");
    } else {
      console.log("✅ Admin déjà existant");
    }
  } catch (err) {
    console.error("❌ Erreur création admin:", err);
  }
}

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await ensureAdminExists();
});
