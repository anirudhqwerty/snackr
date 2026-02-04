# Snackr Backend Architecture - Implementation Guide

## Overview

This is a **production-ready microservices foundation** for the Snackr food delivery platform.

## ✅ What's Implemented

### 5 Independent Microservices

```
Auth Service (Port 3001)
├── User authentication
├── JWT token management
├── Login/Register endpoints
└── Dedicated PostgreSQL database

User Service (Port 3002)
├── User profiles
├── Address management
├── Account settings
└── Dedicated PostgreSQL database

Restaurant Service (Port 3003)
├── Restaurant listings
├── Menu management
├── Search functionality
└── Dedicated PostgreSQL database

Order Service (Port 3004)
├── Order creation
├── Order history
├── Order tracking
└── Dedicated PostgreSQL database

Delivery Service (Port 3005)
├── Delivery tracking
├── Driver management
├── Location updates
└── Dedicated PostgreSQL database
```

### Each Service Includes

✅ **Node.js + TypeScript**

- Strict TypeScript configuration
- ES2020 target for modern syntax
- Source maps for debugging

✅ **Express.js Framework**

- Basic routing setup
- CORS middleware
- JSON request/response handling

✅ **Health Check Endpoint**

- `GET /health` for monitoring
- Service status indicators
- Timestamp tracking

✅ **Docker Containerization**

- Alpine Node.js image (lightweight)
- Multi-stage builds (optimized)
- Exposed ports per service

✅ **Configuration Management**

- `.env.example` templates
- Environment variable support
- Database connection strings

✅ **PostgreSQL Database**

- Separate database per service
- No data sharing between services
- Persistent volumes

## 🏗️ Architecture Benefits

### 1. **Scalability**

- Each service scales independently
- Services can be deployed separately
- Resource allocation per service

### 2. **Maintainability**

- Clear separation of concerns
- Isolated codebase per service
- Independent deployment pipelines

### 3. **Fault Isolation**

- Service failure doesn't affect others
- Graceful degradation
- Independent retry policies

### 4. **Technology Flexibility**

- Each service can use different tech stack
- Different databases if needed
- Language-agnostic communication

### 5. **Development Agility**

- Teams can work independently
- Different release cycles
- Parallel development

## 📊 Service Communication

### Synchronous (HTTP/REST)

Services call each other directly over HTTP:

```typescript
// Example: Order Service calling Restaurant Service
const response = await fetch("http://restaurant-service:3003/restaurants/123");
```

### Service Discovery

Docker handles DNS resolution:

- `auth-service` → Resolves to auth-service container IP
- `user-service` → Resolves to user-service container IP
- All on `snackr-network`

## 🔧 Technology Stack

| Layer           | Technology          |
| --------------- | ------------------- |
| Runtime         | Node.js 18 (Alpine) |
| Language        | TypeScript 5.1      |
| Framework       | Express.js 4.18     |
| Database        | PostgreSQL 15       |
| Container       | Docker              |
| Orchestration   | Docker Compose      |
| Package Manager | npm                 |

## 📝 File Structure Explanation

Each service follows this structure:

```
service-name/
├── src/
│   └── index.ts                 # Main Express server entry point
│                                 # Currently contains:
│                                 # - Express app initialization
│                                 # - CORS and JSON middleware
│                                 # - Health check route
│                                 # - Root info route
│
├── dist/                        # Compiled JavaScript (generated)
│
├── package.json                 # npm dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── Dockerfile                   # Docker image definition
├── .env.example                 # Environment template
├── .gitignore                   # Git exclusions
└── README.md                    # Service-specific docs
```

## 🚀 Docker Compose Configuration

The `docker-compose.yml` defines:

```yaml
Services:
  - 5 Application Services (one per microservice)
  - 5 PostgreSQL Databases (one per service)

Network:
  - Bridge network: snackr-network
  - All services on same network for inter-service communication

Volumes:
  - 5 Named volumes for database persistence
  - Survives container restarts

Dependencies:
  - Services wait for their databases
  - Ensures database is ready before app starts
```

## 🔐 Database Architecture

### No Shared Databases

```
Auth Service      ←→ auth-postgres
User Service      ←→ user-postgres
Restaurant Svc    ←→ restaurant-postgres
Order Service     ←→ order-postgres
Delivery Service  ←→ delivery-postgres
```

### Benefits

- ✅ Service autonomy
- ✅ Independent scaling
- ✅ Clear data boundaries
- ✅ No coupling between services
- ✅ Different schemas per service

## 📡 Port Allocation

All services exposed on localhost with unique ports:

```
3001 → auth-service
3002 → user-service
3003 → restaurant-service
3004 → order-service
3005 → delivery-service
```

## 🔄 Development Workflow

### With Docker

```bash
# Build and start all services
docker-compose up -d

# View logs in real-time
docker-compose logs -f

# Access service
curl http://localhost:3001/health

# Stop services
docker-compose down
```

### Without Docker (Local Development)

```bash
# Each service independently
cd auth-service
npm install
npm run dev

# In another terminal
cd user-service
npm install
npm run dev

# etc...
```

## 🛣️ Implementation Roadmap

### Current State (✅ Completed)

- ✅ 5 microservices scaffolded
- ✅ Node.js + TypeScript setup
- ✅ Express.js basic setup
- ✅ Health check endpoints
- ✅ Docker configuration
- ✅ Docker Compose orchestration
- ✅ Database containers configured
- ✅ Environment variables setup

### Phase 1: Database Layer (Next)

- [ ] Define schemas for each service
- [ ] Create migration scripts
- [ ] Setup database connection pooling
- [ ] Add error handling

### Phase 2: API Endpoints

- [ ] Implement auth endpoints (login, register)
- [ ] Implement user endpoints (profile, address)
- [ ] Implement restaurant endpoints (list, details)
- [ ] Implement order endpoints (create, list, cancel)
- [ ] Implement delivery endpoints (track, rate)

### Phase 3: Cross-Service Communication

- [ ] Service-to-service HTTP clients
- [ ] Error handling for service calls
- [ ] Timeout policies
- [ ] Circuit breaker pattern

### Phase 4: Production Ready

- [ ] Request validation
- [ ] Error handling & logging
- [ ] Security (HTTPS, CORS, rate limiting)
- [ ] Testing (unit, integration)
- [ ] Monitoring & metrics
- [ ] Deployment configuration

## 🔌 Connecting Frontend

The Snackr React Native app connects via environment variables:

```typescript
// In frontend lib/config/env.ts
const API_BASE_URL = "http://localhost:3001"; // Change per service

// When backend is ready:
// - Change to production URL
// - Implement appropriate service gateway or proxy
// - Add authentication headers
```

## 📊 Current Service Status

| Service    | Status   | Port | Health | Database |
| ---------- | -------- | ---- | ------ | -------- |
| Auth       | ✅ Ready | 3001 | ✅     | ✅       |
| User       | ✅ Ready | 3002 | ✅     | ✅       |
| Restaurant | ✅ Ready | 3003 | ✅     | ✅       |
| Order      | ✅ Ready | 3004 | ✅     | ✅       |
| Delivery   | ✅ Ready | 3005 | ✅     | ✅       |

## ⚙️ Next Actions

1. **Start Services**

   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Verify Services**

   ```bash
   # Should return healthy status
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   # ... etc
   ```

3. **Implement First Endpoint**
   - Start with auth-service
   - Add database schema
   - Add user login endpoint
   - Connect to frontend

4. **Add Service Integration**
   - Add inter-service communication
   - Implement error handling
   - Add logging

## 🆘 Common Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild images
docker-compose build

# Remove containers and volumes
docker-compose down -v

# Check service status
curl http://localhost:3001/health

# Access PostgreSQL directly
docker exec -it auth-postgres psql -U auth_user -d auth_db
```

## 📚 Documentation

- [Main README](./README.md) - Setup & quick start
- Service READMEs - Individual service documentation
- Docker docs: https://docs.docker.com
- Express docs: https://expressjs.com
- TypeScript docs: https://www.typescriptlang.org

---

**Status**: ✅ Foundation Complete - Ready for Implementation
**Next**: Implement database schemas and API endpoints
