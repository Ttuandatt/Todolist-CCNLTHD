# NestJS CLI Commands Cheatsheet
## Các câu lệnh PowerShell thường dùng khi làm việc với NestJS

> **Lưu ý:** Chạy các lệnh từ thư mục `backend/`

---

## 📦 CÀI ĐẶT & KHỞI TẠO

```powershell
# Cài đặt NestJS CLI global
npm install -g @nestjs/cli

# Tạo project NestJS mới
nest new project-name

# Hoặc dùng npx (không cần cài global)
npx @nestjs/cli new project-name
```

---

## 🏃 CHẠY ỨNG DỤNG

```powershell
# Development mode (auto-reload khi code thay đổi)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug

# Build production
npm run build
```

---

## 🧩 GENERATE COMPONENTS

### Tạo Module

```powershell
# Cú pháp: npx @nestjs/cli g module <tên>
npx @nestjs/cli g module users

# Kết quả:
# CREATE src/users/users.module.ts
# UPDATE src/app.module.ts (auto import)
```

### Tạo Controller

```powershell
# Cú pháp: npx @nestjs/cli g controller <tên>
npx @nestjs/cli g controller users

# Không tạo file test (.spec.ts)
npx @nestjs/cli g controller users --no-spec

# Kết quả:
# CREATE src/users/users.controller.ts
# CREATE src/users/users.controller.spec.ts (nếu không có --no-spec)
```

### Tạo Service

```powershell
# Cú pháp: npx @nestjs/cli g service <tên>
npx @nestjs/cli g service users

# Không tạo file test
npx @nestjs/cli g service users --no-spec

# Tạo trong thư mục hiện có (không tạo subfolder)
npx @nestjs/cli g service users --flat

# Kết quả:
# CREATE src/users/users.service.ts
```

### Tạo Resource (đầy đủ CRUD)

```powershell
# Tạo module + controller + service + DTOs cùng lúc
npx @nestjs/cli g resource users

# Không tạo file test
npx @nestjs/cli g resource users --no-spec

# Kết quả (nếu chọn REST API):
# CREATE src/users/users.module.ts
# CREATE src/users/users.controller.ts
# CREATE src/users/users.service.ts
# CREATE src/users/dto/create-user.dto.ts
# CREATE src/users/dto/update-user.dto.ts
# CREATE src/users/entities/user.entity.ts
```

### Tạo các components khác

```powershell
# Guard (bảo vệ routes)
npx @nestjs/cli g guard auth/jwt-auth --no-spec

# Middleware
npx @nestjs/cli g middleware common/logger --no-spec

# Interceptor
npx @nestjs/cli g interceptor common/transform --no-spec

# Filter (xử lý exceptions)
npx @nestjs/cli g filter common/http-exception --no-spec

# Pipe (validate/transform data)
npx @nestjs/cli g pipe common/validation --no-spec

# Decorator
npx @nestjs/cli g decorator common/current-user
```

---

## 📊 PRISMA COMMANDS

```powershell
# Tạo migration mới
npx prisma migrate dev --name <tên_migration>
# Ví dụ: npx prisma migrate dev --name add_user_table

# Áp dụng migrations (production)
npx prisma migrate deploy

# Reset database (XÓA TOÀN BỘ DATA!)
npx prisma migrate reset

# Validate schema
npx prisma validate

# Generate Prisma Client
npx prisma generate

# Mở Prisma Studio (GUI quản lý database)
npx prisma studio

# Push schema trực tiếp (không tạo migration - dùng dev)
npx prisma db push

# Pull schema từ database existing
npx prisma db pull
```

---

## 📦 CÀI ĐẶT DEPENDENCIES THƯỜNG DÙNG

```powershell
# Validation (DTO validation)
npm install class-validator class-transformer

# JWT Authentication
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt

# Password hashing
npm install bcrypt
npm install -D @types/bcrypt

# Config/Environment
npm install @nestjs/config

# Swagger API Documentation
npm install @nestjs/swagger swagger-ui-express
```

---

## 🔍 KIỂM TRA & DEBUG

```powershell
# Chạy tests
npm run test

# Chạy tests với watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Lint code
npm run lint
```

---

## 📋 TẮT TẤT OPTIONS

| Flag | Ý nghĩa |
|------|---------|
| `--no-spec` | Không tạo file test (.spec.ts) |
| `--flat` | Tạo trong thư mục hiện có, không tạo subfolder |
| `--dry-run` | Xem trước kết quả, không thực sự tạo file |
| `--skip-import` | Không tự động import vào module |

---

## 💡 VÍ DỤ WORKFLOW

```powershell
# 1. Tạo module mới
npx @nestjs/cli g module workspaces

# 2. Tạo service
npx @nestjs/cli g service workspaces --no-spec

# 3. Tạo controller
npx @nestjs/cli g controller workspaces --no-spec

# 4. Tạo DTOs (thủ công)
New-Item -Path "src/workspaces/dto/create-workspace.dto.ts" -ItemType File -Force
New-Item -Path "src/workspaces/dto/update-workspace.dto.ts" -ItemType File -Force

# HOẶC tạo tất cả cùng lúc:
npx @nestjs/cli g resource workspaces --no-spec
```

---

## 🚀 SHORTCUT COMMANDS

```powershell
# Thay vì 'generate', dùng 'g'
npx @nestjs/cli g module users    # = generate module

# Thay vì 'module', dùng 'mo'
npx @nestjs/cli g mo users

# Thay vì 'controller', dùng 'co'
npx @nestjs/cli g co users

# Thay vì 'service', dùng 's'
npx @nestjs/cli g s users

# Thay vì 'resource', dùng 'res'
npx @nestjs/cli g res users
```

---

## 🛠️ TROUBLESHOOTING

### Port đang bị chiếm (EADDRINUSE)

```powershell
# Cách 1: Dùng npx kill-port
npx kill-port 3333

# Cách 2: PowerShell thuần - Kill process trên port cụ thể
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3333).OwningProcess -Force

# Cách 3: Tìm xem process nào đang dùng port
Get-NetTCPConnection -LocalPort 3333 | Select-Object OwningProcess
Get-Process -Id <PID>
```

### TypeScript lỗi trong IDE nhưng build OK

```powershell
# Restart TypeScript Server trong VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Hoặc xóa cache và build lại
Remove-Item -Recurse -Force dist
npm run build
```

### Prisma lỗi sau khi sửa schema

```powershell
# Generate lại Prisma Client
npx prisma generate

# Nếu vẫn lỗi, xóa node_modules/.prisma và generate lại
Remove-Item -Recurse -Force node_modules/.prisma
npx prisma generate
```

### Database connection lỗi

```powershell
# Kiểm tra PostgreSQL đang chạy
docker ps

# Nếu dùng Docker, start lại container
docker-compose up -d

# Kiểm tra DATABASE_URL trong .env
cat .env | Select-String "DATABASE_URL"
```

---

*Cập nhật: 03/02/2026*
