import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bob-blockchain-secret-2026";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface TempTokenPayload {
  userId: number;
  twoFactorPending: true;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function signTempToken(payload: TempTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10m" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyTempToken(token: string): TempTokenPayload {
  return jwt.verify(token, JWT_SECRET) as TempTokenPayload;
}
