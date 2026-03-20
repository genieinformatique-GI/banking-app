import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";
import { existsSync } from "fs";
import router from "./routes";

const app: Express = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(compression());
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too Many Requests", message: "Trop de tentatives, veuillez réessayer dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api", router);

// Serve frontend static files in production
// Set FRONTEND_DIST_PATH to the absolute path of the built frontend (dist/public/)
const frontendDist = process.env.FRONTEND_DIST_PATH
  ? path.resolve(process.env.FRONTEND_DIST_PATH)
  : path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../bank-of-blockchain/dist/public");

if (process.env.NODE_ENV === "production" && existsSync(frontendDist)) {
  app.use(express.static(frontendDist, { maxAge: "7d", etag: true }));

  // SPA fallback — send index.html for all non-API routes
  app.get("/{*path}", (_req: Request, res: Response) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });

  console.log(`Serving frontend from: ${frontendDist}`);
}

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;
