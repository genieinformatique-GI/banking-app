import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
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

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;
