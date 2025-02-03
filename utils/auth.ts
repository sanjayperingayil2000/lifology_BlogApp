import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded?.userId ? { userId: decoded.userId as number } : null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Invalid token:", error.message);
    } else {
      console.error("Invalid token:", error);
    }
    return null;
  }
};
