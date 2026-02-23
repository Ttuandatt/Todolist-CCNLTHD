# ARCHITECTURE DOCUMENTATION - TÀI LIỆU KIẾN TRÚC
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Cập nhật lần cuối:** 05/02/2026

---

## 1. SYSTEM ARCHITECTURE - KIẾN TRÚC HỆ THỐNG

### 1.1. Tổng quan

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM ARCHITECTURE                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────────────────┐
    │                              CLIENT TIER                                  │
    │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐              │
    │  │   Web Browser  │  │  Mobile (PWA)  │  │   REST Client  │              │
    │  │   (React SPA)  │  │                │  │   (Postman)    │              │
    │  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘              │
    └──────────┼───────────────────┼───────────────────┼───────────────────────┘
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   │ HTTPS / WSS
                                   ▼
    ┌──────────────────────────────────────────────────────────────────────────┐
    │                              API TIER                                     │
    │                                                                          │
    │  ┌────────────────────────────────────────────────────────────────────┐  │
    │  │                        NestJS Application                          │  │
    │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
    │  │  │   REST API   │  │  WebSocket   │  │    Background Jobs       │  │  │
    │  │  │  (Express)   │  │  (Socket.io) │  │    (Bull + Redis)        │  │  │
    │  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │  │
    │  └────────────────────────────────────────────────────────────────────┘  │
    │                                                                          │
    └──────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────────────────┐
    │                              DATA TIER                                    │
    │  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────┐  │
    │  │   PostgreSQL   │  │     Redis      │  │     File Storage          │  │
    │  │   (Database)   │  │   (Cache/Queue)│  │   (Local/S3)              │  │
    │  └────────────────┘  └────────────────┘  └────────────────────────────┘  │
    └──────────────────────────────────────────────────────────────────────────┘
```

### 1.2. Component Description

| Layer | Component | Technology | Purpose |
|-------|-----------|------------|---------|
| **Client** | Web App | React + Vite | SPA frontend |
| **Client** | State Mgmt | Zustand | Client-side state |
| **API** | REST API | NestJS + Express | HTTP endpoints |
| **API** | WebSocket | Socket.io | Real-time communication |
| **API** | Jobs | Bull + Redis | Background processing |
| **Data** | Database | PostgreSQL | Primary data store |
| **Data** | Cache | Redis | Caching & queue |
| **Data** | Files | Local/S3 | File attachments |

---

## 2. MODULE ARCHITECTURE - KIẾN TRÚC MODULE

### 2.1. NestJS Backend Modules

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       NESTJS MODULE ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │    AppModule     │
                              │   (Root Module)  │
                              └────────┬─────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   Core Modules      │    │  Feature Modules     │    │  Infrastructure      │
│                     │    │                      │    │  Modules             │
│ ┌─────────────────┐ │    │ ┌──────────────────┐ │    │ ┌──────────────────┐ │
│ │  AuthModule     │ │    │ │ WorkspaceModule  │ │    │ │  PrismaModule    │ │
│ │  - JWT Strategy │ │    │ │ - CRUD           │ │    │ │  - DB Connection │ │
│ │  - OAuth        │ │    │ │ - Members        │ │    │ └──────────────────┘ │
│ │  - Guards       │ │    │ │ - Invitations    │ │    │ ┌──────────────────┐ │
│ └─────────────────┘ │    │ └──────────────────┘ │    │ │  RedisModule     │ │
│ ┌─────────────────┐ │    │ ┌──────────────────┐ │    │ │  - Cache         │ │
│ │  UserModule     │ │    │ │  ProjectModule   │ │    │ │  - Session       │ │
│ │  - Profile      │ │    │ │  - CRUD          │ │    │ └──────────────────┘ │
│ │  - Settings     │ │    │ │  - Archive       │ │    │ ┌──────────────────┐ │
│ └─────────────────┘ │    │ └──────────────────┘ │    │ │  UploadModule    │ │
│                     │    │ ┌──────────────────┐ │    │ │  - Local/S3      │ │
│                     │    │ │   TaskModule     │ │    │ │  - Validation    │ │
│                     │    │ │   - CRUD         │ │    │ └──────────────────┘ │
│                     │    │ │   - Assignment   │ │    │ ┌──────────────────┐ │
│                     │    │ │   - Status       │ │    │ │  MailModule      │ │
│                     │    │ │   - Subtasks     │ │    │ │  - Templates     │ │
│                     │    │ └──────────────────┘ │    │ │  - SMTP          │ │
│                     │    │ ┌──────────────────┐ │    │ └──────────────────┘ │
│                     │    │ │  CommentModule   │ │    │ ┌──────────────────┐ │
│                     │    │ └──────────────────┘ │    │ │  QueueModule     │ │
│                     │    │ ┌──────────────────┐ │    │ │  - Bull          │ │
│                     │    │ │NotificationModule│ │    │ │  - Jobs          │ │
│                     │    │ │  - Gateway (WS)  │ │    │ └──────────────────┘ │
│                     │    │ └──────────────────┘ │    │                      │
└─────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

### 2.2. Module Dependencies

```
                         ┌──────────────────┐
                         │   PrismaModule   │
                         │   (Global)       │
                         └────────┬─────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  AuthModule   │────────►│  UserModule   │         │ RedisModule   │
└───────┬───────┘         └───────────────┘         └───────┬───────┘
        │                                                   │
        │                                                   │
        ▼                         ▲                         ▼
┌───────────────┐         ┌───────┴───────┐         ┌───────────────┐
│WorkspaceModule│────────►│  TaskModule   │◄────────│NotificationMod│
└───────┬───────┘         └───────────────┘         └───────────────┘
        │                         │
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│ ProjectModule │────────►│ CommentModule │
└───────────────┘         └───────────────┘
```

---

## 3. FRONTEND ARCHITECTURE - KIẾN TRÚC FRONTEND

### 3.1. React Application Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND ARCHITECTURE                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │     App.tsx      │
                              │   (Root Entry)   │
                              └────────┬─────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   Router Layer      │    │    State Layer       │    │   API Layer          │
│                     │    │                      │    │                      │
│ ┌─────────────────┐ │    │ ┌──────────────────┐ │    │ ┌──────────────────┐ │
│ │  React Router   │ │    │ │    Zustand       │ │    │ │  Axios + SWR     │ │
│ │  - Routes       │ │    │ │  - auth store    │ │    │ │  - API calls     │ │
│ │  - Guards       │ │    │ │  - workspace     │ │    │ │  - Interceptors  │ │
│ │  - Layouts      │ │    │ │  - tasks         │ │    │ │  - Caching       │ │
│ └─────────────────┘ │    │ │  - notifications │ │    │ └──────────────────┘ │
└─────────────────────┘    │ └──────────────────┘ │    │ ┌──────────────────┐ │
                           └──────────────────────┘    │ │  Socket.io       │ │
                                                       │ │  - Real-time     │ │
                                                       │ │  - Events        │ │
                                                       │ └──────────────────┘ │
                                                       └──────────────────────┘

                                       │
                                       ▼
    ┌──────────────────────────────────────────────────────────────────────────┐
    │                          UI COMPONENT LAYER                               │
    │                                                                          │
    │  ┌────────────────────────┐  ┌────────────────────────────────────────┐  │
    │  │     Pages/Views        │  │           Components                   │  │
    │  │  ┌──────────────────┐  │  │  ┌────────────┐  ┌──────────────────┐  │  │
    │  │  │  LoginPage       │  │  │  │  Common    │  │    Features      │  │  │
    │  │  │  DashboardPage   │  │  │  │  - Button  │  │  - TaskCard      │  │  │
    │  │  │  WorkspacePage   │  │  │  │  - Modal   │  │  - KanbanBoard   │  │  │
    │  │  │  ProjectPage     │  │  │  │  - Input   │  │  - MemberList    │  │  │
    │  │  │  TaskDetailModal │  │  │  │  - Avatar  │  │  - CommentList   │  │  │
    │  │  └──────────────────┘  │  │  └────────────┘  └──────────────────┘  │  │
    │  └────────────────────────┘  └────────────────────────────────────────┘  │
    └──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. DEPLOYMENT ARCHITECTURE - KIẾN TRÚC TRIỂN KHAI

### 4.1. Development Environment

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT ENVIRONMENT                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

    Developer Machine
    ┌──────────────────────────────────────────────────────────────────────────┐
    │                                                                          │
    │  ┌────────────────┐    ┌────────────────┐    ┌────────────────────────┐  │
    │  │ Frontend       │    │ Backend        │    │ Docker Compose         │  │
    │  │ (Vite Dev)     │    │ (NestJS Dev)   │    │                        │  │
    │  │ localhost:5173 │───►│ localhost:3000 │───►│ ┌────────────────────┐ │  │
    │  └────────────────┘    └────────────────┘    │ │ PostgreSQL: 5432   │ │  │
    │                                              │ ├────────────────────┤ │  │
    │                                              │ │ Redis: 6379        │ │  │
    │                                              │ ├────────────────────┤ │  │
    │                                              │ │ Mailhog: 1025      │ │  │
    │                                              │ └────────────────────┘ │  │
    │                                              └────────────────────────┘  │
    │                                                                          │
    └──────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Production Environment

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION ENVIRONMENT                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

                         Internet
                            │
                            ▼
                    ┌───────────────┐
                    │  Cloudflare   │  CDN + DDoS Protection
                    │    / CDN      │
                    └───────┬───────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────────┐               ┌───────────────────┐
│   Static Assets   │               │   API Gateway     │
│   (Vercel/S3)     │               │   (NGINX)         │
│   frontend.com    │               │   api.todo.com    │
└───────────────────┘               └─────────┬─────────┘
                                              │
                              ┌───────────────┴───────────────┐
                              │            Docker             │
                              │  ┌─────────────────────────┐  │
                              │  │   NestJS Container x2   │  │
                              │  │   (Load Balanced)       │  │
                              │  └────────────┬────────────┘  │
                              │               │               │
                              │  ┌────────────┴────────────┐  │
                              │  │                         │  │
                              │  ▼                         ▼  │
                              │ ┌──────────┐     ┌──────────┐ │
                              │ │PostgreSQL│     │  Redis   │ │
                              │ │ (RDS)    │     │ (Cluster)│ │
                              │ └──────────┘     └──────────┘ │
                              │                               │
                              │ ┌──────────────────────────┐  │
                              │ │      S3 Storage          │  │
                              │ │   (File Attachments)     │  │
                              │ └──────────────────────────┘  │
                              └───────────────────────────────┘
```

---

## 5. DATA FLOW ARCHITECTURE

### 5.1. Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REQUEST FLOW                                           │
└─────────────────────────────────────────────────────────────────────────────────┘

  Client                   API                              Database
    │                       │                                  │
    │  1. HTTP Request      │                                  │
    │  (with JWT)           │                                  │
    │──────────────────────►│                                  │
    │                       │                                  │
    │                       │ 2. AuthGuard validates JWT       │
    │                       │─────┐                            │
    │                       │◄────┘                            │
    │                       │                                  │
    │                       │ 3. Controller receives request   │
    │                       │─────┐                            │
    │                       │◄────┘                            │
    │                       │                                  │
    │                       │ 4. Service processes logic       │
    │                       │─────┐                            │
    │                       │◄────┘                            │
    │                       │                                  │
    │                       │ 5. Prisma query                  │
    │                       │─────────────────────────────────►│
    │                       │                                  │
    │                       │ 6. Database response             │
    │                       │◄─────────────────────────────────│
    │                       │                                  │
    │                       │ 7. Transform to DTO              │
    │                       │─────┐                            │
    │                       │◄────┘                            │
    │                       │                                  │
    │  8. HTTP Response     │                                  │
    │  (JSON)               │                                  │
    │◄──────────────────────│                                  │
```

### 5.2. Real-time Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         REAL-TIME FLOW (WebSocket)                               │
└─────────────────────────────────────────────────────────────────────────────────┘

   User A                   Server                          User B
     │                        │                               │
     │ 1. Connect WebSocket   │                               │
     │  (with JWT)            │                               │
     │───────────────────────►│                               │
     │                        │                               │
     │                        │ 2. User B connects            │
     │                        │◄──────────────────────────────│
     │                        │                               │
     │                        │ 3. Both join workspace room   │
     │                        │───────┐                       │
     │                        │◄──────┘                       │
     │                        │                               │
     │ 4. Create Task (HTTP)  │                               │
     │───────────────────────►│                               │
     │                        │                               │
     │                        │ 5. Task created               │
     │                        │───────┐                       │
     │                        │◄──────┘                       │
     │                        │                               │
     │  6. Task created event │                               │
     │◄───────────────────────│                               │
     │                        │                               │
     │                        │  7. Broadcast to room         │
     │                        │──────────────────────────────►│
     │                        │                               │
     │                        │         8. Task created event │
     │                        │──────────────────────────────►│
```

---

## 6. SECURITY ARCHITECTURE

### 6.1. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION SECURITY                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Login/OAuth   │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  Validate User  │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
           ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
           │  Access Token   │ │Refresh Token│ │ Store Session   │
           │  (15 min TTL)   │ │ (7 day TTL) │ │ (Redis)         │
           └────────┬────────┘ └──────┬──────┘ └─────────────────┘
                    │                 │
                    ▼                 │
           ┌─────────────────┐        │
           │  API Requests   │        │
           │  + JWT Header   │        │
           └────────┬────────┘        │
                    │                 │
                    ▼                 │
           ┌─────────────────┐        │
           │  Token Expired? │        │
           └────────┬────────┘        │
              Yes   │   No            │
                    ▼                 │
           ┌─────────────────┐        │
           │ Refresh Token   │◄───────┘
           │ Endpoint        │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ New Access Token│
           └─────────────────┘
```

### 6.2. Authorization (RBAC)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AUTHORIZATION (RBAC)                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

    Request with JWT
           │
           ▼
    ┌─────────────────┐
    │   AuthGuard     │──────► Verify JWT valid?
    └────────┬────────┘
             │ ✓
             ▼
    ┌─────────────────┐
    │ WorkspaceGuard  │──────► Check if user is member of workspace?
    └────────┬────────┘
             │ ✓
             ▼
    ┌─────────────────┐
    │   RolesGuard    │──────► Check if user has required role?
    └────────┬────────┘        (OWNER, ADMIN, MEMBER)
             │ ✓
             ▼
    ┌─────────────────┐
    │   Controller    │
    └─────────────────┘
```

---

## 7. TECHNOLOGY STACK

### 7.1. Backend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | NestJS | 10.x | API development |
| Runtime | Node.js | 20 LTS | JavaScript runtime |
| Language | TypeScript | 5.x | Type safety |
| ORM | Prisma | 6.x | Database access |
| Database | PostgreSQL | 16 | Primary database |
| Cache | Redis | 7.x | Caching, queues |
| Queue | Bull | 4.x | Background jobs |
| Auth | Passport.js | 0.7.x | Authentication |
| JWT | @nestjs/jwt | 10.x | Token management |
| WebSocket | Socket.io | 4.x | Real-time |
| Validation | class-validator | 0.14.x | DTO validation |
| Docs | Swagger | 7.x | API documentation |

### 7.2. Frontend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 18.x | UI library |
| Build Tool | Vite | 5.x | Fast bundling |
| State | Zustand | 4.x | State management |
| Routing | React Router | 6.x | Navigation |
| HTTP | Axios | 1.x | API calls |
| Styling | Tailwind CSS | 3.x | Utility CSS |
| UI Components | shadcn/ui | - | Component library |
| Icons | Lucide React | 0.x | Icon set |
| Forms | React Hook Form | 7.x | Form handling |
| Validation | Zod | 3.x | Schema validation |
| Real-time | Socket.io-client | 4.x | WebSocket client |

### 7.3. DevOps

| Category | Technology | Purpose |
|----------|------------|---------|
| Container | Docker | Containerization |
| Orchestration | Docker Compose | Local development |
| CI/CD | GitHub Actions | Automation |
| Cloud | AWS / VPS | Production hosting |
| CDN | Cloudflare | CDN + Security |

---

## 8. SUMMARY

| Aspect | Approach |
|--------|----------|
| **Architecture Style** | Modular Monolith (Backend), SPA (Frontend) |
| **API Style** | RESTful + WebSocket |
| **Authentication** | JWT + OAuth2 |
| **Authorization** | Role-Based Access Control (RBAC) |
| **Data Access** | Prisma ORM |
| **Real-time** | Socket.io |
| **Background Jobs** | Bull + Redis |
| **Deployment** | Docker containers |
