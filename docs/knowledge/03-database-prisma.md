# 📘 Phần 3: Database & Prisma ORM

> **Thời gian học:** 4-5 ngày  
> **Độ khó:** ⭐⭐⭐ Trung bình  
> **Yêu cầu:** SQL cơ bản, TypeScript

---

## 1. PostgreSQL Fundamentals

### 1.1 Tại sao chọn PostgreSQL?

| Feature | PostgreSQL | MySQL |
|---------|------------|-------|
| JSONB | Native, indexed ✅ | JSON (limited) |
| Full-text search | Built-in ✅ | Plugin |
| Arrays | Native ✅ | No |
| CTEs (WITH) | Full support ✅ | Limited |
| ACID | Full ✅ | Full |

### 1.2 Data Types quan trọng

```sql
-- Numeric
INTEGER, BIGINT, DECIMAL(10,2), REAL, DOUBLE PRECISION

-- String
VARCHAR(255), TEXT, CHAR(10)

-- Date/Time
DATE, TIME, TIMESTAMP, TIMESTAMPTZ, INTERVAL

-- Boolean
BOOLEAN

-- JSON
JSON, JSONB (binary, indexed - recommended)

-- Arrays
INTEGER[], TEXT[], VARCHAR(255)[]

-- UUID
UUID
```

### 1.3 Relationships

```sql
-- One-to-Many: User has many Tasks
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Many-to-Many: Tasks have many Labels
CREATE TABLE labels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE task_labels (
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);
```

### 1.4 Indexes

```sql
-- Single column index
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Composite index
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Partial index
CREATE INDEX idx_active_tasks ON tasks(user_id) WHERE status = 'active';

-- GIN index for JSONB
CREATE INDEX idx_tasks_metadata ON tasks USING GIN(metadata);

-- Full-text search index
CREATE INDEX idx_tasks_search ON tasks USING GIN(to_tsvector('english', title || ' ' || description));
```

### 1.5 Transactions

```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Rollback on error
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  -- Error occurs
ROLLBACK;
```

---

## 2. Prisma ORM

### 2.1 Cài đặt Prisma

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Tạo file: prisma/schema.prisma và .env
```

### 2.2 Prisma Schema

```prisma
// prisma/schema.prisma

// Database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Generate Prisma Client
generator client {
  provider = "prisma-client-js"
}

// Models
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  tasks        Task[]
  comments     Comment[]
  workspaces   WorkspaceMember[]
  
  @@map("users")  // Table name
}

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(NORMAL)
  dueDate     DateTime?  @map("due_date")
  position    Int        @default(0)
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  // Relations
  projectId   Int        @map("project_id")
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  createdById Int        @map("created_by_id")
  createdBy   User       @relation(fields: [createdById], references: [id])
  
  parentId    Int?       @map("parent_id")
  parent      Task?      @relation("Subtasks", fields: [parentId], references: [id])
  subtasks    Task[]     @relation("Subtasks")
  
  comments    Comment[]
  labels      TaskLabel[]
  assignees   TaskAssignee[]
  attachments Attachment[]

  @@index([projectId])
  @@index([createdById])
  @@map("tasks")
}

// Enums
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

### 2.3 Migrations

```bash
# Tạo migration từ schema changes
npx prisma migrate dev --name init

# Tạo migration cho production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Xem status
npx prisma migrate status

# Generate Prisma Client
npx prisma generate
```

### 2.4 Prisma Service trong NestJS

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 3. CRUD Operations

### 3.1 Create

```typescript
// Create single record
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    password: hashedPassword,
  },
});

// Create with relations
const task = await prisma.task.create({
  data: {
    title: 'New Task',
    description: 'Task description',
    project: {
      connect: { id: projectId },  // Connect to existing
    },
    createdBy: {
      connect: { id: userId },
    },
    labels: {
      create: [                    // Create new related records
        { label: { connect: { id: 1 } } },
        { label: { connect: { id: 2 } } },
      ],
    },
  },
  include: {
    project: true,
    createdBy: true,
    labels: { include: { label: true } },
  },
});

// Create many
const users = await prisma.user.createMany({
  data: [
    { email: 'a@test.com', name: 'A', password: 'hash1' },
    { email: 'b@test.com', name: 'B', password: 'hash2' },
  ],
  skipDuplicates: true,  // Skip on unique constraint violation
});
```

### 3.2 Read

```typescript
// Find by ID
const user = await prisma.user.findUnique({
  where: { id: 1 },
});

// Find by unique field
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' },
});

// Find first matching
const task = await prisma.task.findFirst({
  where: { 
    projectId: 1,
    status: 'TODO',
  },
  orderBy: { position: 'asc' },
});

// Find many with filtering
const tasks = await prisma.task.findMany({
  where: {
    projectId: 1,
    status: { in: ['TODO', 'IN_PROGRESS'] },
    dueDate: { lte: new Date() },
    title: { contains: 'urgent', mode: 'insensitive' },
  },
  orderBy: [
    { priority: 'desc' },
    { createdAt: 'asc' },
  ],
  skip: 0,     // Pagination offset
  take: 10,    // Pagination limit
});

// With relations (include)
const task = await prisma.task.findUnique({
  where: { id: 1 },
  include: {
    project: true,
    createdBy: {
      select: { id: true, name: true, avatarUrl: true },  // Partial select
    },
    comments: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    labels: {
      include: { label: true },
    },
  },
});

// Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // password excluded
  },
});
```

### 3.3 Update

```typescript
// Update single
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Jane Doe' },
});

// Update with nested relations
const task = await prisma.task.update({
  where: { id: 1 },
  data: {
    title: 'Updated Title',
    labels: {
      deleteMany: {},  // Remove all existing
      create: [
        { label: { connect: { id: 3 } } },
      ],
    },
  },
});

// Update many
const result = await prisma.task.updateMany({
  where: { projectId: 1, status: 'TODO' },
  data: { status: 'IN_PROGRESS' },
});
// result.count = number of updated records

// Upsert (update or create)
const user = await prisma.user.upsert({
  where: { email: 'john@example.com' },
  update: { name: 'John Updated' },
  create: { email: 'john@example.com', name: 'John', password: 'hash' },
});
```

### 3.4 Delete

```typescript
// Delete single
const user = await prisma.user.delete({
  where: { id: 1 },
});

// Delete many
const result = await prisma.task.deleteMany({
  where: { 
    projectId: 1,
    status: 'DONE',
  },
});
```

---

## 4. Advanced Queries

### 4.1 Filtering

```typescript
const tasks = await prisma.task.findMany({
  where: {
    // Equality
    status: 'TODO',
    
    // Not equal
    status: { not: 'DONE' },
    
    // In list
    status: { in: ['TODO', 'IN_PROGRESS'] },
    
    // Not in list
    status: { notIn: ['DONE'] },
    
    // Comparison
    position: { gt: 0 },     // greater than
    position: { gte: 1 },    // greater than or equal
    position: { lt: 10 },    // less than
    position: { lte: 9 },    // less than or equal
    
    // String operations
    title: { contains: 'urgent' },
    title: { startsWith: 'Task' },
    title: { endsWith: 'important' },
    title: { contains: 'URGENT', mode: 'insensitive' },  // Case insensitive
    
    // Null checks
    dueDate: null,
    dueDate: { not: null },
    
    // AND (implicit)
    projectId: 1,
    status: 'TODO',
    
    // OR
    OR: [
      { status: 'TODO' },
      { priority: 'URGENT' },
    ],
    
    // NOT
    NOT: { status: 'DONE' },
    
    // Relation filtering
    project: { workspaceId: 1 },
    labels: { some: { label: { name: 'bug' } } },
    comments: { none: {} },  // Tasks without comments
  },
});
```

### 4.2 Aggregations

```typescript
// Count
const count = await prisma.task.count({
  where: { projectId: 1 },
});

// Aggregate
const stats = await prisma.task.aggregate({
  where: { projectId: 1 },
  _count: true,
  _avg: { position: true },
  _max: { position: true },
  _min: { position: true },
});

// Group by
const grouped = await prisma.task.groupBy({
  by: ['status'],
  where: { projectId: 1 },
  _count: true,
});
// [{ status: 'TODO', _count: 5 }, { status: 'DONE', _count: 3 }]
```

### 4.3 Transactions

```typescript
// Sequential transaction
const result = await prisma.$transaction([
  prisma.task.update({
    where: { id: 1 },
    data: { status: 'DONE' },
  }),
  prisma.task.update({
    where: { id: 2 },
    data: { position: 1 },
  }),
]);

// Interactive transaction
const result = await prisma.$transaction(async (tx) => {
  // Deduct from sender
  const sender = await tx.account.update({
    where: { id: 1 },
    data: { balance: { decrement: 100 } },
  });
  
  if (sender.balance < 0) {
    throw new Error('Insufficient balance');
  }
  
  // Add to receiver
  const receiver = await tx.account.update({
    where: { id: 2 },
    data: { balance: { increment: 100 } },
  });
  
  return { sender, receiver };
});
```

### 4.4 Raw Queries

```typescript
// Raw query
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;

// Raw execute
await prisma.$executeRaw`
  UPDATE tasks SET position = position + 1 WHERE project_id = ${projectId}
`;
```

---

## 5. Service Pattern với Prisma

```typescript
// tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(projectId: number, filter: TaskFilterDto) {
    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(filter.status && { status: filter.status }),
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.search && {
        OR: [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          createdBy: { select: { id: true, name: true, avatarUrl: true } },
          assignees: { include: { user: { select: { id: true, name: true } } } },
          labels: { include: { label: true } },
          _count: { select: { comments: true, subtasks: true } },
        },
        orderBy: { position: 'asc' },
        skip: filter.skip || 0,
        take: filter.take || 20,
      }),
      this.prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        createdBy: true,
        assignees: { include: { user: true } },
        labels: { include: { label: true } },
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
        subtasks: true,
        attachments: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async create(userId: number, projectId: number, dto: CreateTaskDto) {
    // Get max position
    const maxPosition = await this.prisma.task.aggregate({
      where: { projectId },
      _max: { position: true },
    });

    return this.prisma.task.create({
      data: {
        ...dto,
        position: (maxPosition._max.position || 0) + 1,
        project: { connect: { id: projectId } },
        createdBy: { connect: { id: userId } },
        ...(dto.labelIds && {
          labels: {
            create: dto.labelIds.map(labelId => ({
              label: { connect: { id: labelId } },
            })),
          },
        }),
      },
      include: {
        createdBy: true,
        labels: { include: { label: true } },
      },
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.labelIds && {
          labels: {
            deleteMany: {},
            create: dto.labelIds.map(labelId => ({
              label: { connect: { id: labelId } },
            })),
          },
        }),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }

  async reorder(taskId: number, newPosition: number) {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });
      if (!task) throw new NotFoundException();

      const oldPosition = task.position;
      const projectId = task.projectId;

      if (newPosition > oldPosition) {
        // Moving down
        await tx.task.updateMany({
          where: {
            projectId,
            position: { gt: oldPosition, lte: newPosition },
          },
          data: { position: { decrement: 1 } },
        });
      } else {
        // Moving up
        await tx.task.updateMany({
          where: {
            projectId,
            position: { gte: newPosition, lt: oldPosition },
          },
          data: { position: { increment: 1 } },
        });
      }

      return tx.task.update({
        where: { id: taskId },
        data: { position: newPosition },
      });
    });
  }
}
```

---

## 📚 Tài liệu tham khảo

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
