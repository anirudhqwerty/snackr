# Auth Service - Database Layer Documentation

## Overview

The database layer provides PostgreSQL connectivity and query functions for the Auth Service using Node.js `pg` library with TypeScript.

## Structure

```
src/db/
├── index.ts              # Connection pool and configuration
├── init.ts               # Database initialization and migrations
├── migrations/
│   └── 001_init.sql      # Initial schema (auth_users table)
└── queries/
    └── auth.queries.ts   # Query functions (no Express, just DB logic)
```

## Database Configuration

Environment variables (from `.env`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
DB_USER=auth_user
DB_PASSWORD=auth_password
```

When using Docker Compose, the service automatically connects to `auth-postgres` container:

- Host: `auth-postgres`
- Database: `auth_db`
- User: `auth_user` (set in docker-compose.yml)

## Schema

### `auth_users` table

| Column        | Type         | Constraints                  | Notes                              |
| ------------- | ------------ | ---------------------------- | ---------------------------------- |
| id            | UUID         | PRIMARY KEY                  | Auto-generated                     |
| email         | VARCHAR(255) | UNIQUE, NOT NULL             | Indexed for fast lookups           |
| password_hash | VARCHAR(255) | NOT NULL                     | Bcrypt or similar hash             |
| role          | ENUM         | NOT NULL, DEFAULT 'customer' | Values: customer, vendor, delivery |
| is_active     | BOOLEAN      | NOT NULL, DEFAULT true       | Soft delete flag                   |
| created_at    | TIMESTAMP TZ | NOT NULL, DEFAULT NOW()      | Indexed for time queries           |
| updated_at    | TIMESTAMP TZ | NOT NULL, DEFAULT NOW()      | Auto-updated on changes            |

### Features

✅ **UUID Primary Key** - Distributed system safe
✅ **Unique Email Index** - Fast email lookups
✅ **Automatic Timestamps** - Trigger updates `updated_at` on changes
✅ **Soft Delete** - `is_active` flag instead of hard delete
✅ **Timezone Support** - All timestamps are timezone-aware
✅ **Role-based** - ENUM type prevents invalid roles

## Query Functions

All in `src/db/queries/auth.queries.ts`:

### Core Functions (Required)

```typescript
// Create new user
createAuthUser(email: string, passwordHash: string, role?: 'customer' | 'vendor' | 'delivery'): Promise<AuthUser>

// Find by email (for login)
findUserByEmail(email: string): Promise<AuthUser | null>

// Find by ID (for token validation)
findUserById(id: string): Promise<AuthUser | null>

// Deactivate account (soft delete)
deactivateUser(id: string): Promise<AuthUser>
```

### Additional Functions

```typescript
// Get active users with pagination
findActiveUsers(limit?: number, offset?: number): Promise<AuthUser[]>

// Update password
updateUserPasswordHash(id: string, newPasswordHash: string): Promise<AuthUser>

// Count active users
countActiveUsers(): Promise<number>

// Hard delete (use with caution)
deleteUserById(id: string): Promise<boolean>
```

### Error Handling

All functions throw descriptive errors:

```typescript
// Duplicate email
throw new Error(`Email 'user@example.com' already exists`);

// User not found
throw new Error(`User with id 'uuid-123' not found`);

// Database error
throw new Error(`Failed to find user by email: connection timeout`);
```

## Initialization

### Automatic (on app startup)

```typescript
import { initializeDatabase } from "./db/init";

app.listen(port, async () => {
  await initializeDatabase();
  console.log("Server running");
});
```

This:

1. Tests database connection
2. Runs all SQL migrations in order (001_init.sql, etc.)
3. Is idempotent (safe to run multiple times)

### Manual Commands

```typescript
import { initializeDatabase, resetDatabase } from "./db/init";

// Initialize
await initializeDatabase();

// Reset (WARNING: deletes all data)
await resetDatabase();
```

## Usage Examples

### In Controllers (once implemented)

```typescript
import { createAuthUser, findUserByEmail } from "./db/queries/auth.queries";

// Register new user
const user = await createAuthUser(
  "user@example.com",
  "hashed_password_here",
  "customer",
);
console.log(user.id); // UUID

// Login validation
const user = await findUserByEmail("user@example.com");
if (!user) throw new Error("User not found");
if (!user.is_active) throw new Error("Account inactive");
// Verify password hash...

// Get user info
const user = await findUserById("uuid-from-token");
if (!user.is_active) throw new Error("Account deactivated");
```

## Connection Pooling

The `pg.Pool` automatically manages connections:

```typescript
import { pool } from './db/index';

// Pool configuration
- Max connections: 10 (default)
- Idle timeout: 30000ms
- Connection timeout: 0 (disabled)
- Acquires/releases connections automatically
```

## Graceful Shutdown

```typescript
import { closePool } from "./db/index";

process.on("SIGTERM", async () => {
  await closePool();
  process.exit(0);
});
```

## Testing the Database

### Using Docker Compose

```bash
# Start database
docker-compose up -d auth-postgres

# Connect to database
docker exec -it auth-postgres psql -U auth_user -d auth_db

# In psql shell
\dt                    # List tables
\d auth_users          # Describe table
SELECT * FROM auth_users;  # View data
```

### Programmatically

```bash
cd backend/auth-service
npm run dev
```

Logs show:

```
[Auth DB] Testing connection...
[Auth DB] Connection successful. Server time: 2026-02-04 10:00:00+00
[Auth DB] Running migrations...
[Auth DB] Running migration: 001_init.sql
[Auth DB] Migration completed: 001_init.sql ✓
[Auth DB] Database initialization complete ✓
```

## TypeScript Types

```typescript
interface AuthUser {
  id: string; // UUID
  email: string;
  password_hash: string;
  role: "customer" | "vendor" | "delivery";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

## Security Notes

🔒 **Password Storage**

- Passwords are NOT stored here - only password_hash
- Hashing should be done in service layer (bcrypt, argon2)
- This layer only stores and retrieves hashes

🔒 **SQL Injection**

- All queries use parameterized queries ($1, $2, etc.)
- User input never directly in SQL strings

🔒 **Soft Deletes**

- Uses `is_active` flag instead of hard delete
- Preserves audit trail
- Prevents data loss

## Next Steps

1. ✅ Database layer implemented
2. ⏳ Add service layer (business logic, password hashing)
3. ⏳ Add controllers/routes (HTTP endpoints)
4. ⏳ Add authentication middleware (JWT)
5. ⏳ Add error handling middleware

---

**Status**: ✅ Phase 1 Complete - Database Foundation Ready
