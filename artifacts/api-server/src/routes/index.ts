import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import balancesRouter from "./balances.js";
import transactionsRouter from "./transactions.js";
import bankTransfersRouter from "./bank_transfers.js";
import cryptoTransfersRouter from "./crypto_transfers.js";
import bankAccountsRouter from "./bank_accounts.js";
import notificationsRouter from "./notifications.js";
import logsRouter from "./logs.js";
import adminRouter from "./admin.js";
import contentRouter from "./content.js";
import passwordResetRouter from "./password_reset.js";
import twoFactorRouter from "./two_factor.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/auth", passwordResetRouter);
router.use("/auth/2fa", twoFactorRouter);
router.use("/users", usersRouter);
router.use("/balances", balancesRouter);
router.use("/transactions", transactionsRouter);
router.use("/bank-transfers", bankTransfersRouter);
router.use("/crypto-transfers", cryptoTransfersRouter);
router.use("/bank-accounts", bankAccountsRouter);
router.use("/notifications", notificationsRouter);
router.use("/logs", logsRouter);
router.use("/admin", adminRouter);
router.use("/content", contentRouter);

export default router;
