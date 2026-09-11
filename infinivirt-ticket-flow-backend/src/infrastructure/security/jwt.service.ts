import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-ticket-flow-2026';
const JWT_EXPIRES_IN = '8h';

export class JwtService {
  public static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  public static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
}