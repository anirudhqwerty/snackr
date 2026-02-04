# Snackr Backend - Microservices Architecture

A scalable, modular backend for the Snackr food delivery platform built with Node.js, TypeScript, Express, PostgreSQL, and Docker.

## 📋 Architecture Overview

The Snackr backend follows a **microservices architecture** pattern with independent services that handle specific business domains.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (React Native)                      │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ├──────── /api/auth ──────────┐
                  ├──────── /api/users ─────────┤
                  ├──────── /api/restaurants ───├─→ Microservices
                  ├──────── /api/orders ────────┤
                  └──────── /api/delivery ──────┘

┌──────────────┐  ┌──────────────┐  ┌────────────────┐
│ Auth Service │  │ User Service │  │Restaurant Srvc │
├──────────────┤  ├──────────────┤  ├────────────────┤
│ PostgreSQL   │  │ PostgreSQL   │  │  PostgreSQL    │
└──────────────┘  └──────────────┘  └────────────────┘

┌──────────────┐  ┌─────────────────┐
│ Order Service│  │Delivery Service │
├──────────────┤  ├─────────────────┤
│ PostgreSQL   │  │   PostgreSQL    │
└──────────────┘  └─────────────────┘
```

## 🏗️ Service Structure

### Services

- **auth-service** (Port 3001) - Authentication & authorization
- **user-service** (Port 3002) - User profile & account management
- **restaurant-service** (Port 3003) - Restaurant data & menus
- **order-service** (Port 3004) - Order creation & management
- **delivery-service** (Port 3005) - Delivery tracking & logistics

### Database

- Each service has its own PostgreSQL database (no shared databases)
- Database name follows pattern: `{service}_db`
- Example: `auth_db`, `user_db`, `restaurant_db`, etc.

### Communication

- Services communicate via HTTP/REST using service names (Docker DNS)
- Example: `http://auth-service:3001` from another service
- All services on the same Docker network: `snackr-network`

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- npm or yarn

### Run with Docker Compose

```bash
# From backend directory
cd backend

# Start all services and databases
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Verify Services are Running

```bash
# Check health of each service
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # User Service
curl http://localhost:3003/health  # Restaurant Service
curl http://localhost:3004/health  # Order Service
curl http://localhost:3005/health  # Delivery Service
```

Expected response:

```json
{
  "status": "healthy",
  "service": "auth-service",
  "timestamp": "2024-02-04T12:00:00.000Z"
}
```

## 🛠️ Local Development (Without Docker)

### Setup Individual Service

```bash
# Navigate to service
cd auth-service

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Start service in development mode (requires local PostgreSQL)
npm run dev

# Or build and start
npm run build
npm start
```

### Environment Variables

Each service has a `.env.example` file. Copy to `.env` and configure:

```env
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost  # Use 'auth-postgres' for Docker
DB_PORT=5432
DB_NAME=auth_db
DB_USER=auth_user
DB_PASSWORD=auth_password
DB_SSL=false
```

## 📁 Project Structure

```
backend/
├── auth-service/
│   ├── src/
│   │   └── index.ts              # Express app entry point
│   ├── dist/                      # Compiled TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
│
├── user-service/
│   ├── src/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
│
├── restaurant-service/
│   ├── src/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
│
├── order-service/
│   ├── src/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
│
├── delivery-service/
│   ├── src/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
│
├── docker-compose.yml              # Orchestration config
└── README.md                        # This file
```

## 🔧 Commands

### Docker Compose

```bash
# Start services (detached)
docker-compose up -d

# Start services (foreground, see logs)
docker-compose up

# Stop services
docker-compose stop

# Remove services and volumes
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Rebuild images
docker-compose build
```

### Individual Service Commands

```bash
# Install dependencies
npm install

# Development mode (auto-reload with ts-node)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run compiled JavaScript
npm start

# Lint code
npm run lint
```

## 📡 API Endpoints

### Health Check

Every service exposes a health check endpoint:

```
GET /health
```

### Root Endpoint

```
GET /
```

Response:

```json
{
  "service": "auth-service",
  "version": "1.0.0",
  "description": "Authentication Service for Snackr Platform"
}
```

## 🐳 Docker Details

### Image Base

- `node:18-alpine` - Lightweight Node.js image

### Port Mapping

| Service    | Internal | External |
| ---------- | -------- | -------- |
| Auth       | 3001     | 3001     |
| User       | 3002     | 3002     |
| Restaurant | 3003     | 3003     |
| Order      | 3004     | 3004     |
| Delivery   | 3005     | 3005     |

### Network

- Network name: `snackr-network`
- Driver: `bridge`
- Services can communicate via: `http://{service-name}:{port}`

### Volumes (Data Persistence)

- `auth-db-data` → `/var/lib/postgresql/data`
- `user-db-data` → `/var/lib/postgresql/data`
- `restaurant-db-data` → `/var/lib/postgresql/data`
- `order-db-data` → `/var/lib/postgresql/data`
- `delivery-db-data` → `/var/lib/postgresql/data`

## 📊 Database Configuration

### PostgreSQL Setup

Each service has an independent PostgreSQL instance:

| Service    | Database      | User            | Password            | Container           |
| ---------- | ------------- | --------------- | ------------------- | ------------------- |
| Auth       | auth_db       | auth_user       | auth_password       | auth-postgres       |
| User       | user_db       | user_user       | user_password       | user-postgres       |
| Restaurant | restaurant_db | restaurant_user | restaurant_password | restaurant-postgres |
| Order      | order_db      | order_user      | order_password      | order-postgres      |
| Delivery   | delivery_db   | delivery_user   | delivery_password   | delivery-postgres   |

**Important**: These are default credentials for development. Change in production!

## 🔐 Security Notes

- ⚠️ Default passwords are for development only
- In production:
  - Use strong, unique passwords
  - Use environment variables from secrets management
  - Enable DB SSL connections
  - Implement API authentication/authorization
  - Add rate limiting
  - Use HTTPS for all communications
  - Add request validation

## 📝 Next Steps

### Before Running

1. ✅ Docker & Docker Compose installed
2. ✅ Backend directory structure created
3. ✅ All services scaffolded
4. ✅ docker-compose.yml configured
5. ⏳ Ready to implement business logic

### Implementation Roadmap

#### Phase 1: Database Layer

- [ ] Create database schemas for each service
- [ ] Setup migrations
- [ ] Add connection pooling (pg pool)

#### Phase 2: Authentication

- [ ] JWT token generation
- [ ] Token validation middleware
- [ ] Login/Register endpoints
- [ ] Token refresh logic

#### Phase 3: Service Implementation

- [ ] User profile endpoints
- [ ] Restaurant CRUD operations
- [ ] Order management
- [ ] Delivery tracking

#### Phase 4: Inter-Service Communication

- [ ] Service-to-service HTTP calls
- [ ] Event-based messaging (optional)
- [ ] Error handling across services

#### Phase 5: Testing & Deployment

- [ ] Unit tests for each service
- [ ] Integration tests
- [ ] Docker build optimization
- [ ] Production deployment setup

## 📦 Dependencies

### Core

- `express` - Web framework
- `typescript` - Type safety
- `pg` - PostgreSQL client

### Development

- `ts-node` - Run TypeScript directly
- `@types/express` - Type definitions
- `@types/node` - Node.js types

## 🆘 Troubleshooting

### Services won't start

```bash
# Check if ports are in use
lsof -i :3001  # Check specific port

# Check docker logs
docker-compose logs [service-name]

# Rebuild images
docker-compose build --no-cache
```

### Database connection errors

```bash
# Verify database containers are running
docker ps | grep postgres

# Check database credentials
docker-compose logs auth-postgres
```

### Port already in use

```bash
# Kill process on port
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Or change port in docker-compose.yml
# Change "3001:3001" to "3010:3001"
```

## 📚 Resources

- [Express.js Docs](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Docker Docs](https://docs.docker.com)
- [Docker Compose Docs](https://docs.docker.com/compose)

## 📄 License

Snackr Backend - Open Source Food Delivery Platform

---

**Status**: ✅ Foundation Scaffolding Complete
**Version**: 1.0.0
**Created**: 2024
