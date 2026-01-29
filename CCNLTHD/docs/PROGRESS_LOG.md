# 📝 PROGRESS LOG - TodoList Collaboration

> File này ghi lại quá trình xây dựng project để phục vụ viết báo cáo

---

## 📅 22/01/2026

### Session 1: Environment Setup (10:26 - 10:58)

#### Đã làm:
1. **Cài đặt Node.js v24.12.0**
   - npm v11.6.2

2. **Setup PostgreSQL với Docker**
   ```bash
   docker run --name todolist-postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres123 \
     -e POSTGRES_DB=ccnlthd_todolist_db \
     -p 5432:5432 -d postgres:16-alpine
   ```

3. **Cài đặt NestJS CLI v11.0.16**
   - Lưu ý: Dùng `npx @nestjs/cli` thay vì `nest` (lỗi PATH trên Windows)

4. **Khởi tạo Backend project**
   ```bash
   npx @nestjs/cli new backend
   ```
   - Package manager: npm
   - NestJS version: 11

5. **Cài đặt Prisma ORM**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

6. **Push lên GitHub**
   - Repo: https://github.com/Ttuandatt/Todolist-CCNLTHD

#### Files đã tạo:
- `docs/SETUP_GUIDE.md` - Hướng dẫn setup môi trường
- `docs/CHECKPOINTS.md` - Tracking tiến độ theo phases
- `backend/` - NestJS project

#### Ghi chú kỹ thuật:
- Windows có lỗi PATH với global npm packages → dùng `npx`
- Docker Desktop v29.1.3 đã có sẵn Redis container

---

## 🔜 NEXT STEPS

- [ ] Phase 1: Tạo Prisma Schema
- [ ] Phase 2: Authentication Module

---

## 📊 KIẾN THỨC ĐÃ ÁP DỤNG

| Chương báo cáo | Kiến thức | Áp dụng thực tế |
|----------------|-----------|-----------------|
| Chương 3 | Cài đặt môi trường | Node.js, Docker, NestJS CLI, Prisma |
| - | - | - |

---

## 🐛 ISSUES & SOLUTIONS

| Vấn đề | Giải pháp |
|--------|-----------|
| `nest` command not found | Dùng `npx @nestjs/cli` |
| Git push rejected | `git pull --rebase` trước |

---

*File này sẽ được cập nhật liên tục trong quá trình phát triển*
