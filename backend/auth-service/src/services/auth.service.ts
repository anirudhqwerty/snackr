import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    createAuthUser,
    findUserByEmail,
    findUserById,
} from "../db/queries/auth.queries";

// JWT configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "customer" | "vendor" | "delivery";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Failed to hash password: ${error}`);
  }
}

/**
 * Compare password with hash
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error(`Failed to compare password: ${error}`);
  }
}

/**
 * Generate access and refresh tokens
 */
export function generateTokens(payload: TokenPayload): AuthTokens {
  try {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Calculate expiry in seconds (15 minutes = 900 seconds)
    const expiresIn = 15 * 60;

    return { accessToken, refreshToken, expiresIn };
  } catch (error) {
    throw new Error(`Failed to generate tokens: ${error}`);
  }
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  role: "customer" | "vendor" | "delivery" = "customer",
): Promise<{ user: any; tokens: AuthTokens }> {
  // Validate inputs
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user in database
  const user = await createAuthUser(email, passwordHash, role);

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
    },
    tokens,
  };
}

/**
 * Login user with email and password
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: any; tokens: AuthTokens }> {
  // Validate inputs
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user is active
  if (!user.is_active) {
    throw new Error("Account has been deactivated");
  }

  // Compare passwords
  const passwordMatch = await comparePassword(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
    },
    tokens,
  };
}

/**
 * Verify JWT token and get user
 */
export async function verifyJWT(token: string): Promise<any> {
  // Remove 'Bearer ' prefix if present
  const cleanToken = token.replace(/^Bearer\s+/i, "");

  // Verify token
  const payload = verifyToken(cleanToken);
  if (!payload) {
    throw new Error("Invalid or expired token");
  }

  // Get fresh user data from database
  const user = await findUserById(payload.userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.is_active) {
    throw new Error("User account is inactive");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthTokens> {
  // Remove 'Bearer ' prefix if present
  const cleanToken = refreshToken.replace(/^Bearer\s+/i, "");

  // Verify refresh token
  const payload = verifyToken(cleanToken);
  if (!payload) {
    throw new Error("Invalid or expired refresh token");
  }

  // Get user from database
  const user = await findUserById(payload.userId);
  if (!user || !user.is_active) {
    throw new Error("User not found or inactive");
  }

  // Generate new tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return tokens;
}
