# Chương 5: Làm việc với Dữ liệu và Database (Prisma ORM)

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ hiểu được vai trò của ORM trong phát triển ứng dụng, biết cách cài đặt và cấu hình Prisma, thiết kế schema database, thực hiện migrations, và thao tác CRUD với dữ liệu.

---

## 5.1 ORM là gì? Tại sao chọn Prisma?

### 5.1.1 Object-Relational Mapping (ORM)

Trong quá trình phát triển ứng dụng, một trong những thách thức lớn nhất mà developers thường gặp phải là khoảng cách giữa cách tổ chức code theo hướng đối tượng và cách database lưu trữ dữ liệu dưới dạng bảng quan hệ. Đây chính là lúc ORM phát huy vai trò của mình như một "cầu nối" giúp giải quyết vấn đề này một cách hiệu quả.

ORM, viết tắt của Object-Relational Mapping, là một kỹ thuật cho phép developers làm việc với database thông qua các đối tượng trong code, thay vì phải viết trực tiếp các câu lệnh SQL. Để dễ hình dung, hãy tưởng tượng ORM như một "phiên dịch viên" thông minh, tự động chuyển đổi qua lại giữa ngôn ngữ của code và ngôn ngữ của database. Khi bạn gọi một method trong code, ORM sẽ tự động sinh ra câu SQL tương ứng và gửi đến database; khi database trả về kết quả, ORM lại chuyển đổi dữ liệu thành các objects mà code có thể sử dụng trực tiếp.

Để hiểu rõ hơn sự khác biệt, hãy xem xét ví dụ sau. Khi không sử dụng ORM, bạn phải viết SQL thuần túy để thực hiện các thao tác với database:

```sql
INSERT INTO users (email, name, password) 
VALUES ('john@example.com', 'John Doe', 'hashed_password');

SELECT * FROM users WHERE id = 1;

UPDATE users SET name = 'Jane Doe' WHERE id = 1;

DELETE FROM users WHERE id = 1;
```

Trong khi đó, khi sử dụng Prisma ORM, các thao tác tương tự được thực hiện thông qua các method calls có cú pháp rõ ràng và type-safe:

```typescript
// Tạo user mới
await prisma.user.create({
  data: { email: 'john@example.com', name: 'John Doe', password: 'hashed_password' }
});

// Đọc thông tin user
await prisma.user.findUnique({ where: { id: 1 } });

// Cập nhật user
await prisma.user.update({ where: { id: 1 }, data: { name: 'Jane Doe' } });

// Xóa user
await prisma.user.delete({ where: { id: 1 } });
```

Việc sử dụng ORM mang lại nhiều lợi ích đáng kể cho quá trình phát triển phần mềm. Đầu tiên và quan trọng nhất là về Type Safety - ORM tự động sinh ra các types từ schema, giúp IDE có thể auto-complete và phát hiện lỗi ngay trong quá trình viết code. Điều này đặc biệt có giá trị trong môi trường TypeScript vì cho phép developer bắt lỗi sớm ở giai đoạn compile thay vì phải đợi đến runtime, tiết kiệm đáng kể thời gian debug.

Bên cạnh đó, ORM còn tăng đáng kể năng suất làm việc của team phát triển. Thay vì phải viết hàng trăm dòng SQL boilerplate cho các thao tác CRUD cơ bản, developer chỉ cần vài dòng code ngắn gọn và trực quan. Thời gian tiết kiệm được có thể dành để tập trung vào phần business logic - vốn là phần cốt lõi và tạo nên giá trị thực sự của ứng dụng.

Về mặt bảo trì lâu dài, code sử dụng ORM dễ đọc và dễ hiểu hơn nhiều so với các câu SQL strings nằm rải rác khắp nơi trong codebase. Khi một developer mới tham gia dự án, họ có thể nhanh chóng hiểu được luồng dữ liệu mà không cần phải phân tích các câu query phức tạp.

Một lợi ích quan trọng khác là về bảo mật. ORM tự động escape các input từ người dùng thông qua cơ chế parameterized queries, giúp giảm thiểu đáng kể rủi ro SQL Injection - một trong những lỗ hổng bảo mật phổ biến và nguy hiểm nhất trong các ứng dụng web.

Cuối cùng, ORM cung cấp một lớp abstraction cho phép ứng dụng không bị phụ thuộc quá chặt vào một database cụ thể. Nếu sau này cần chuyển từ PostgreSQL sang MySQL hay ngược lại, phần lớn code business logic vẫn giữ nguyên, chỉ cần thay đổi cấu hình connection.

### 5.1.2 Các ORM phổ biến trong NestJS

NestJS là một framework linh hoạt, không bắt buộc sử dụng một ORM cụ thể nào. Thay vào đó, NestJS cung cấp các integration packages cho nhiều ORM khác nhau, cho phép developers lựa chọn công cụ phù hợp nhất với nhu cầu dự án. Dưới đây là những ORM phổ biến nhất được sử dụng trong các dự án NestJS.

#### 5.1.2.1 TypeORM

TypeORM là ORM được tích hợp chính thức và sâu nhất với NestJS thông qua package `@nestjs/typeorm`. Ra đời năm 2016, TypeORM được thiết kế từ đầu để hỗ trợ TypeScript, sử dụng decorators để định nghĩa entities - cách tiếp cận rất tương đồng với style của NestJS.

TypeORM hỗ trợ cả hai patterns phổ biến trong ORM: Active Record và Data Mapper. Với Active Record pattern, entity class chứa cả data và các methods để tương tác với database. Với Data Mapper pattern, entities chỉ chứa data thuần túy, còn logic tương tác database được đặt trong các repository riêng biệt. Đây là pattern được khuyến khích sử dụng trong NestJS vì phù hợp với dependency injection.

Về mặt tính năng, TypeORM cung cấp đầy đủ các khả năng cần thiết bao gồm migrations, relations (one-to-one, one-to-many, many-to-many), eager và lazy loading, transactions, và query builder. TypeORM hỗ trợ rất nhiều database engines như MySQL, PostgreSQL, SQLite, Microsoft SQL Server, Oracle, và cả MongoDB.

Tuy nhiên, TypeORM cũng có một số hạn chế đáng lưu ý. Type safety không hoàn toàn chặt chẽ - khi query với select partial fields hay relations, TypeScript không đảm bảo types chính xác 100%. Ngoài ra, hệ thống migrations của TypeORM đôi khi require manual intervention và có thể gặp issues khi schema phức tạp. Một số developers cũng phản ánh rằng documentation không được cập nhật thường xuyên.

```typescript
// Ví dụ Entity trong TypeORM
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @OneToMany(() => Task, task => task.createdBy)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
```

#### 5.1.2.2 Prisma

Prisma là ORM thế hệ mới (next-generation ORM) ra đời năm 2019, được thiết kế với triết lý hoàn toàn khác biệt so với các ORM truyền thống. Thay vì sử dụng classes và decorators trong code, Prisma áp dụng cách tiếp cận "schema-first" - toàn bộ cấu trúc database được định nghĩa trong một file schema riêng sử dụng Prisma Schema Language (PSL).

Điểm mạnh nổi bật nhất của Prisma là type safety tuyệt đối. Prisma Client được auto-generate từ schema, có nghĩa là mọi query, mọi field, mọi relation đều có types chính xác và cập nhật tự động khi schema thay đổi. IDE có thể cung cấp autocomplete chính xác đến từng field của từng model, và TypeScript sẽ báo lỗi ngay lập tức nếu truy cập field không tồn tại hoặc truyền sai kiểu dữ liệu.

Prisma bao gồm ba thành phần chính làm việc cùng nhau. Prisma Client là query builder type-safe được generate riêng cho schema của dự án. Prisma Migrate là hệ thống migrations tự động detect changes và generate SQL scripts. Prisma Studio là GUI tool trực quan để browse và edit data trong browser.

Mặc dù Prisma không có official NestJS package như TypeORM, việc tích hợp vẫn rất đơn giản thông qua một PrismaService wrapper. Prisma hỗ trợ PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, và CockroachDB.

```typescript
// Ví dụ Schema trong Prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  tasks     Task[]   @relation("CreatedTasks")
  createdAt DateTime @default(now())
  
  @@map("users")
}
```

#### 5.1.2.3 Sequelize

Sequelize là một trong những ORM lâu đời và ổn định nhất trong hệ sinh thái Node.js, ra đời từ năm 2011. NestJS cung cấp integration thông qua package `@nestjs/sequelize`. Với hơn một thập kỷ phát triển, Sequelize có cộng đồng lớn và documentation phong phú.

Sequelize theo hướng tiếp cận Active Record pattern, trong đó mỗi model class đại diện cho một bảng và các instances của class đại diện cho các rows. API của Sequelize khá trực quan và dễ học, đặc biệt phù hợp với những người mới bắt đầu với ORM.

Về mặt tính năng, Sequelize hỗ trợ đầy đủ transactions, relations, eager loading, migrations, và seeders. Nó cũng cung cấp raw query capabilities khi cần thực hiện các queries phức tạp mà ORM không cover được.

Tuy nhiên, Sequelize ban đầu được viết cho JavaScript thuần. Mặc dù đã có TypeScript support thông qua `sequelize-typescript`, việc tích hợp không seamless như TypeORM hay Prisma. Types đôi khi không chính xác 100%, đặc biệt với các queries phức tạp hoặc khi sử dụng associations.

```typescript
// Ví dụ Model trong Sequelize với TypeScript
@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column
  name: string;

  @HasMany(() => Task)
  tasks: Task[];
}
```

#### 5.1.2.4 MikroORM

MikroORM là một ORM tương đối mới hơn, ra đời năm 2018, được thiết kế với focus vào TypeScript và lấy cảm hứng từ Doctrine ORM của PHP. NestJS có thể tích hợp thông qua package `@mikro-orm/nestjs`.

MikroORM theo Data Mapper pattern với Unit of Work và Identity Map - các patterns giúp quản lý entity state hiệu quả và tối ưu performance. Thay vì save từng entity riêng lẻ, các thay đổi được track và persist trong một transaction khi gọi flush. Điều này giảm số lượng database round-trips.

Một điểm mạnh của MikroORM là hỗ trợ TypeScript rất tốt với automatic type inference. MikroORM cũng cung cấp CLI tool mạnh mẽ cho migrations, schema generation, và entity scaffolding.

MikroORM hỗ trợ nhiều database backends bao gồm PostgreSQL, MySQL, MariaDB, SQLite, và MongoDB. Tuy nhiên, vì là ORM mới hơn nên cộng đồng và ecosystem còn nhỏ hơn so với TypeORM hay Sequelize.

```typescript
// Ví dụ Entity trong MikroORM
@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  email!: string;

  @Property()
  name!: string;

  @OneToMany(() => Task, task => task.createdBy)
  tasks = new Collection<Task>(this);
}
```

#### 5.1.2.5 Mongoose (dành cho MongoDB)

Mặc dù không phải là ORM theo đúng nghĩa (mà là ODM - Object Document Mapper), Mongoose xứng đáng được đề cập vì là giải pháp phổ biến nhất khi sử dụng MongoDB với NestJS. NestJS cung cấp integration chính thức thông qua package `@nestjs/mongoose`.

Mongoose cho phép định nghĩa schemas với TypeScript decorators, tương tự như cách làm việc với NestJS decorators. Nó cung cấp validation, middleware (hooks), virtuals, và populate (tương đương với relations trong SQL databases).

Điểm mạnh của Mongoose là sự linh hoạt của MongoDB schema. Không giống như SQL databases yêu cầu schema cố định, MongoDB cho phép documents có structure khác nhau trong cùng một collection. Mongoose cung cấp một lớp schema validation để cân bằng giữa flexibility và data integrity.

Tuy nhiên, nếu dự án sử dụng relational database như PostgreSQL hay MySQL, Mongoose không phải là lựa chọn phù hợp. Mongoose chỉ hoạt động với MongoDB.

```typescript
// Ví dụ Schema trong Mongoose
@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks: Task[];
}
```

#### 5.1.2.6 Lựa chọn ORM cho đề tài

Để có cái nhìn tổng quan và so sánh trực tiếp giữa các ORM đã giới thiệu, bảng dưới đây tổng hợp các tiêu chí quan trọng:

| Tiêu chí | TypeORM | Prisma | Sequelize | MikroORM | Mongoose |
|----------|---------|--------|-----------|----------|----------|
| **Năm ra đời** | 2016 | 2019 | 2011 | 2018 | 2010 |
| **Type Safety** | Tốt | Xuất sắc | Trung bình | Tốt | Trung bình |
| **Schema Definition** | Decorators | Declarative file | Decorators | Decorators | Decorators |
| **Auto-generate Types** | Không | Có | Không | Một phần | Không |
| **Migrations** | Thủ công/Sync | Tự động | Thủ công | Tự động | Không cần |
| **NestJS Package** | Official | Community | Official | Official | Official |
| **Database Support** | SQL + MongoDB | SQL + MongoDB | SQL only | SQL + MongoDB | MongoDB only |
| **Learning Curve** | Trung bình | Thấp | Thấp | Trung bình | Thấp |
| **GUI Tool** | Không | Prisma Studio | Không | Không | Không |
| **Cộng đồng** | Lớn | Đang phát triển | Rất lớn | Nhỏ | Rất lớn |

Sau khi phân tích và đánh giá các ORM phổ biến dựa trên bảng so sánh trên, nhóm đã quyết định lựa chọn **Prisma** làm ORM chính cho dự án TodoList Collaboration. Quyết định này dựa trên nhiều yếu tố quan trọng phù hợp với đặc thù của đề tài.

Trước hết, dự án sử dụng TypeScript làm ngôn ngữ chính, và Prisma cung cấp type safety vượt trội so với các ORM khác. Như đã thể hiện trong bảng so sánh, Prisma là ORM duy nhất có khả năng auto-generate types hoàn toàn từ schema. Với Prisma Client được tự động sinh ra, mọi thay đổi về cấu trúc database đều được phản ánh ngay lập tức trong types của code, giúp giảm thiểu bugs liên quan đến data layer và tăng tốc quá trình development.

Thứ hai, hệ thống migrations của Prisma Migrate hoạt động trơn tru và tự động, phù hợp với một dự án học tập cần iterate nhanh. Trong khi TypeORM và Sequelize yêu cầu viết migrations thủ công hoặc sử dụng sync (không an toàn cho production), Prisma tự động detect changes trong schema và generate các SQL scripts tương ứng. Nhóm có thể tập trung vào việc phát triển business logic thay vì lo lắng về database synchronization.

Thứ ba, Prisma Studio cung cấp một công cụ visualization trực quan - điều mà các ORM khác không có sẵn. Khả năng browse, filter, và edit data trực tiếp trong browser giúp việc debug và kiểm tra data trở nên dễ dàng hơn nhiều, đặc biệt có giá trị trong quá trình học tập và phát triển.

Thứ tư, learning curve của Prisma tương đối thấp với syntax declarative đơn giản. File schema.prisma dễ đọc và dễ hiểu, không đòi hỏi phải nắm vững nhiều concepts phức tạp như decorators, metadata reflection, hay design patterns như các ORM class-based.

Cuối cùng, mặc dù không có official NestJS package như TypeORM hay Sequelize, việc tích hợp Prisma với NestJS thông qua PrismaService vẫn rất đơn giản và clean. Documentation của Prisma cũng rất chi tiết với nhiều examples thực tế, giúp nhóm nhanh chóng làm quen và áp dụng vào dự án.

### 5.1.3 Kiến trúc và Workflow của Prisma

Để hiểu rõ hơn về cách Prisma hoạt động trong thực tế, phần này sẽ đi sâu vào kiến trúc và quy trình làm việc với Prisma.

**Kiến trúc của Prisma** bao gồm ba thành phần chính hoạt động phối hợp với nhau:

**Prisma Client** là thư viện query builder được auto-generated từ schema của bạn. Đây là phần mà developers tương tác trực tiếp trong code để thực hiện các thao tác CRUD. Điểm đặc biệt của Prisma Client là nó được "tailored" riêng cho schema của từng dự án - mỗi field, mỗi relation đều có types cụ thể, giúp IDE cung cấp autocomplete chính xác và phát hiện lỗi ngay lập tức.

**Prisma Migrate** là hệ thống quản lý database migrations. Khi bạn thay đổi schema, Prisma Migrate sẽ so sánh với trạng thái database hiện tại và tự động generate các SQL migration scripts cần thiết. Các migration files này được version control cùng với source code, cho phép team làm việc cùng nhau và đảm bảo mọi môi trường (development, staging, production) đều có cùng cấu trúc database.

**Prisma Studio** là một GUI tool cho phép browse, filter, và edit data trực tiếp trong browser. Công cụ này cực kỳ hữu ích trong quá trình development khi cần inspect data, tạo test records, hoặc debug các issues liên quan đến data. Không cần cài đặt database GUI client riêng, chỉ cần chạy lệnh `npx prisma studio` là có thể truy cập.

**Workflow làm việc với Prisma** tuân theo một quy trình rõ ràng và có thể lặp lại:

```
Schema Definition → Generate Client → Use in Code → Modify Schema → Migrate → Regenerate
```

Đầu tiên, developer định nghĩa hoặc cập nhật cấu trúc database trong file `schema.prisma`. Tiếp theo, chạy lệnh generate để Prisma tạo ra client code với đầy đủ types. Sau đó sử dụng client này trong application code để query và mutate data. Khi cần thay đổi schema, quay lại bước đầu, sửa schema, chạy migration để cập nhật database, và regenerate client. Quy trình này tạo ra một feedback loop chặt chẽ giữa schema và code.

**Prisma hỗ trợ nhiều database engines** phổ biến bao gồm PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, và CockroachDB. Điều này cho phép linh hoạt lựa chọn database phù hợp với từng dự án mà không phải học một ORM khác. Trong dự án TodoList Collaboration, chúng ta sử dụng PostgreSQL vì đây là database mạnh mẽ, miễn phí, có hỗ trợ tốt cho các tính năng như JSON columns, full-text search, và advanced indexing.

---

## 5.2 Cài đặt và Cấu hình Prisma

### 5.2.1 Cài đặt Dependencies

Để tích hợp Prisma vào một dự án NestJS, trước tiên cần cài đặt hai packages cần thiết. Package đầu tiên là `prisma` - đây là CLI tool cung cấp các lệnh để generate client, chạy migrations, và mở Prisma Studio. Vì chỉ sử dụng trong quá trình development nên package này được cài đặt như một dev dependency. Package thứ hai là `@prisma/client` - đây là thư viện runtime thực sự được sử dụng trong code để thực hiện các queries, do đó cần được cài đặt như một production dependency.

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 5.2.2 Khởi tạo Prisma

Sau khi cài đặt xong, bước tiếp theo là khởi tạo Prisma trong project bằng lệnh `npx prisma init`. Lệnh này sẽ tự động tạo ra thư mục `prisma/` chứa file `schema.prisma` - nơi định nghĩa toàn bộ cấu trúc database. Ngoài ra, nếu project chưa có file `.env`, Prisma cũng sẽ tạo file này và thêm biến môi trường `DATABASE_URL` làm mẫu.

```bash
npx prisma init
```

### 5.2.3 Cấu hình Database Connection

Connection string đến database được cấu hình trong file `.env` thông qua biến `DATABASE_URL`. Với PostgreSQL, format của connection string bao gồm các thành phần: protocol, username, password, host, port, và tên database.

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/todolist_db?schema=public"
```

Trong connection string trên, `postgresql://` chỉ định protocol kết nối, `postgres:password` là username và password của database user, `localhost:5432` là địa chỉ host và cổng của PostgreSQL server, `todolist_db` là tên database sẽ sử dụng, và `?schema=public` chỉ định schema namespace trong PostgreSQL (mặc định là public).

Cần lưu ý rằng file `.env` chứa các thông tin nhạy cảm như credentials, do đó tuyệt đối không được commit file này lên git repository. Hãy đảm bảo rằng `.env` đã được thêm vào file `.gitignore` ngay từ đầu dự án.

---

## 5.3 Schema Definition

Schema đóng vai trò như "bản thiết kế" của database, nơi định nghĩa cấu trúc các bảng (trong Prisma gọi là models), quan hệ giữa chúng, và các ràng buộc cần thiết. Một schema được thiết kế tốt là nền tảng cho việc phát triển ứng dụng thuận lợi về sau.

### 5.3.1 Cấu trúc file schema.prisma

File `schema.prisma` được tổ chức thành ba phần chính với vai trò riêng biệt. Phần đầu tiên là Generator block, nơi cấu hình cách Prisma sinh ra client code. Với setting `provider = "prisma-client-js"`, Prisma sẽ generate một TypeScript/JavaScript client có thể import và sử dụng trực tiếp trong code.

Phần thứ hai là Datasource block, nơi chỉ định loại database và connection URL. Prisma hiện hỗ trợ nhiều database engines bao gồm PostgreSQL, MySQL, SQLite, SQL Server, và MongoDB. URL được lấy từ biến môi trường thông qua hàm `env()` để tách biệt configuration khỏi code.

Phần thứ ba và cũng là phần quan trọng nhất là các Model definitions. Mỗi model trong Prisma tương ứng với một bảng trong database, và các fields trong model chính là các columns của bảng đó.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
}
```

### 5.3.2 Định nghĩa Models và Field Types

Khi định nghĩa một model trong Prisma, mỗi field được khai báo theo format: tên field, kiểu dữ liệu, các modifiers (nếu có), và các attributes. Kiểu dữ liệu trong Prisma sẽ được map sang kiểu tương ứng trong database. Ví dụ, `String` sẽ thành VARCHAR hoặc TEXT trong PostgreSQL, `Int` thành INTEGER, `DateTime` thành TIMESTAMP, và `Boolean` thành BOOLEAN.

Prisma cung cấp hai modifiers để thay đổi tính chất của field. Dấu `?` sau kiểu dữ liệu cho biết field đó có thể nhận giá trị null (optional), trong khi `[]` biểu thị một array của kiểu dữ liệu đó.

Các attributes được sử dụng để thêm các ràng buộc và behavior đặc biệt cho fields. Attribute `@id` đánh dấu field là primary key của bảng. `@default()` cho phép chỉ định giá trị mặc định, có thể là một giá trị cố định hoặc một function như `uuid()` để tự động generate UUID, hay `now()` để lấy thời gian hiện tại. Attribute `@unique` đảm bảo tất cả các giá trị trong column đều là duy nhất. `@updatedAt` là một attribute đặc biệt giúp tự động cập nhật timestamp mỗi khi record được modify.

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  avatar    String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
  @@index([email])
}
```

Ở cấp độ model, có thể sử dụng các block-level attributes. `@@map("users")` cho phép đặt tên bảng trong database khác với tên model trong code - điều này hữu ích khi làm việc với database có sẵn hoặc khi muốn tuân theo naming conventions cụ thể. `@@index([email])` tạo database index trên một hoặc nhiều columns để tối ưu hiệu năng query.

### 5.3.3 Định nghĩa Enums

Trong nhiều trường hợp, một field chỉ nên nhận một số giá trị cố định và biết trước. Ví dụ, trạng thái của một task chỉ có thể là TODO, IN_PROGRESS, REVIEW, hoặc DONE. Để enforce ràng buộc này, Prisma cho phép định nghĩa Enums.

```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum TaskPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

model Task {
  id       String       @id @default(uuid())
  title    String
  status   TaskStatus   @default(TODO)
  priority TaskPriority @default(NORMAL)
}
```

Khi sử dụng enum trong code, TypeScript sẽ chỉ cho phép các giá trị nằm trong tập hợp đã định nghĩa. Nếu cố gắng truyền một giá trị không hợp lệ, compiler sẽ báo lỗi ngay lập tức thay vì đợi đến runtime. Điều này giúp ngăn chặn các bug liên quan đến typo hay nhầm lẫn giá trị ngay từ giai đoạn development.

---

## 5.4 Relations (Quan hệ giữa các Models)

Trong database relational, sức mạnh thực sự nằm ở khả năng mô hình hóa các quan hệ giữa các entities. Prisma hỗ trợ đầy đủ ba loại quan hệ chính thường gặp trong thiết kế database.

### 5.4.1 One-to-Many (1-N)

Quan hệ One-to-Many là loại quan hệ phổ biến nhất trong hầu hết các ứng dụng. Trong quan hệ này, một record của bảng A có thể liên kết với nhiều records của bảng B, nhưng mỗi record của bảng B chỉ thuộc về một record của bảng A. Một ví dụ điển hình trong dự án TodoList là quan hệ giữa User và Task: một User có thể tạo nhiều Tasks, nhưng mỗi Task chỉ được tạo bởi một User duy nhất.

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
  tasks Task[]
}

model Task {
  id          String @id @default(uuid())
  title       String
  createdById String
  createdBy   User   @relation(fields: [createdById], references: [id])
}
```

Trong schema trên, cần phân biệt hai loại fields. Field `tasks Task[]` trong model User là một relation field - nó không thực sự tồn tại trong database mà chỉ là cách để Prisma biết cần include những tasks nào khi query user. Ngược lại, `createdById String` trong model Task là một foreign key field - đây là column thực sự được lưu trong database, chứa ID của user đã tạo task. Annotation `@relation(fields: [createdById], references: [id])` khai báo rằng field `createdById` trỏ đến field `id` của model User.

Khi làm việc với relation trong code, Prisma cung cấp các operations như `connect` để liên kết với record có sẵn, hoặc `create` để tạo record mới và liên kết trong cùng một operation.

```typescript
const task = await prisma.task.create({
  data: {
    title: 'New task',
    createdBy: { connect: { id: userId } }
  }
});

const userWithTasks = await prisma.user.findUnique({
  where: { id: userId },
  include: { tasks: true }
});
```

### 5.4.2 Many-to-Many (N-N)

Quan hệ Many-to-Many xảy ra khi một record của bảng A có thể liên kết với nhiều records của bảng B, và ngược lại, một record của bảng B cũng có thể liên kết với nhiều records của bảng A. Trong dự án TodoList, một ví dụ điển hình là quan hệ giữa Task và Label: một Task có thể được gắn nhiều Labels, và một Label cũng có thể được gắn cho nhiều Tasks.

Prisma hỗ trợ hai cách để implement quan hệ Many-to-Many. Cách đầu tiên là Implicit relation, trong đó Prisma tự động tạo và quản lý junction table ở tầng database. Cách này đơn giản và phù hợp khi không cần lưu thêm thông tin gì về quan hệ.

Cách thứ hai là Explicit relation, trong đó developer tự định nghĩa junction table (còn gọi là pivot table). Cách này được khuyến khích khi cần lưu trữ thêm metadata về quan hệ, ví dụ như thời điểm gắn label, ai là người gắn, hoặc bất kỳ thông tin bổ sung nào khác.

```prisma
model Task {
  id     String      @id @default(uuid())
  title  String
  labels TaskLabel[]
}

model Label {
  id    String      @id @default(uuid())
  name  String
  color String
  tasks TaskLabel[]
}

model TaskLabel {
  id        String   @id @default(uuid())
  taskId    String
  labelId   String
  addedAt   DateTime @default(now())
  
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  label     Label    @relation(fields: [labelId], references: [id], onDelete: Cascade)
  
  @@unique([taskId, labelId])
}
```

Trong thiết kế trên, model `TaskLabel` đóng vai trò junction table với hai foreign keys trỏ đến Task và Label. Field `addedAt` là ví dụ về metadata được lưu trữ cho mỗi quan hệ. Constraint `@@unique([taskId, labelId])` đảm bảo rằng một label không thể được gắn hai lần cho cùng một task. Option `onDelete: Cascade` chỉ định rằng khi Task hoặc Label bị xóa, các records liên quan trong TaskLabel cũng sẽ bị xóa tự động.

### 5.4.3 One-to-One (1-1)

Quan hệ One-to-One ít gặp hơn trong thực tế, thường được sử dụng khi muốn tách một số fields ra bảng riêng vì lý do về security, performance, hoặc tổ chức code. Ví dụ, có thể tách user preferences ra một bảng riêng để không phải load toàn bộ mỗi khi query user.

```prisma
model User {
  id       String       @id @default(uuid())
  email    String       @unique
  settings UserSettings?
}

model UserSettings {
  id       String @id @default(uuid())
  userId   String @unique
  theme    String @default("light")
  language String @default("vi")
  user     User   @relation(fields: [userId], references: [id])
}
```

Điểm mấu chốt để tạo quan hệ 1-1 nằm ở constraint `@unique` trên foreign key field (`userId`). Constraint này đảm bảo rằng mỗi User chỉ có thể có một UserSettings, và ngược lại mỗi UserSettings chỉ thuộc về một User.

### 5.4.4 Self-Relation (Quan hệ đệ quy)

Self-Relation là trường hợp đặc biệt khi một model có quan hệ với chính nó. Đây là pattern phổ biến trong các tính năng như threaded comments (comment reply comment khác), hierarchical categories, hoặc organizational structure. Trong dự án TodoList, tính năng reply comment sử dụng self-relation để cho phép một Comment có thể là reply của Comment khác.

```prisma
model Comment {
  id        String    @id @default(uuid())
  content   String
  parentId  String?
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
}
```

Trong schema trên, một Comment có thể có một `parent` (comment mà nó reply), và đồng thời cũng có thể có nhiều `replies` (các comments reply lại nó). Field `parentId` là optional vì không phải comment nào cũng là reply - những comments ở root level sẽ có `parentId` là null. Relation name `"CommentReplies"` được sử dụng để disambiguate hai relation fields đang cùng trỏ đến model Comment.

---

## 5.5 Migrations

Migrations là cơ chế để đồng bộ schema định nghĩa trong code với cấu trúc database thực tế. Thay vì phải manually chạy các câu ALTER TABLE hay CREATE TABLE, Prisma sẽ tự động detect những thay đổi và generate các SQL statements cần thiết. Mỗi migration được lưu thành một file riêng, cho phép track history và rollback khi cần.

### 5.5.1 Tạo Migration trong Development

Trong môi trường development, lệnh `npx prisma migrate dev` là công cụ chính để làm việc với migrations. Khi chạy lệnh này với flag `--name` để đặt tên mô tả, Prisma sẽ thực hiện một chuỗi các bước: so sánh schema hiện tại trong file `schema.prisma` với trạng thái của database, generate một migration file chứa các SQL statements cần thiết để đồng bộ, apply migration đó vào database, và cuối cùng regenerate Prisma Client để reflect những thay đổi.

```bash
npx prisma migrate dev --name init
```

Các migration files được lưu trong thư mục `prisma/migrations/`, mỗi migration nằm trong một subfolder với timestamp prefix để đảm bảo thứ tự thực thi. Bên trong mỗi folder là file `migration.sql` chứa các SQL statements thực tế.

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

### 5.5.2 Workflow Migration chuẩn

Một workflow migration chuẩn trong quá trình development thường diễn ra như sau. Đầu tiên, developer sửa đổi file `schema.prisma` để thêm, sửa, hoặc xóa các fields/models theo yêu cầu. Sau đó chạy lệnh migrate dev với một tên mô tả ngắn gọn về thay đổi, ví dụ `add_avatar_to_user`. Prisma sẽ generate migration file tương ứng.

Bước quan trọng tiếp theo là review migration file đã được generate. Trong đa số trường hợp, SQL được generate sẽ chính xác, nhưng đôi khi cần adjust cho các cases đặc biệt như data migration hay thêm default values cho columns mới trong bảng đã có data. Sau khi review và test locally, migration files cần được commit lên git cùng với các thay đổi code khác.

### 5.5.3 Apply Migration trong Production

Môi trường production có workflow khác biệt với development. Ở đây sử dụng lệnh `npx prisma migrate deploy` để apply các migrations đã được tạo và test ở development. Lệnh này chỉ chạy những migrations chưa được apply, không tạo mới migrations - đảm bảo tính ổn định và reproducibility. Thông thường, lệnh này được integrate vào CI/CD pipeline và chạy tự động trước khi deploy ứng dụng mới.

```bash
npx prisma migrate deploy
```

### 5.5.4 Các lệnh Migration bổ trợ

Ngoài hai lệnh chính, Prisma còn cung cấp một số lệnh bổ trợ hữu ích. Lệnh `npx prisma migrate status` cho phép xem trạng thái hiện tại của migrations - những migrations nào đã được apply và những migrations nào đang pending. Lệnh `npx prisma migrate reset` sẽ xóa toàn bộ database và apply lại tất cả migrations từ đầu - cực kỳ hữu ích trong development nhưng không bao giờ nên sử dụng trong production. Cuối cùng, `npx prisma generate` cho phép regenerate Prisma Client mà không chạy migration, thường dùng sau khi pull code mới về hoặc khi chỉ muốn refresh types.

---

## 5.6 CRUD Operations

CRUD là viết tắt của Create, Read, Update, và Delete - bốn thao tác cơ bản mà mọi ứng dụng đều cần thực hiện với dữ liệu. Prisma Client cung cấp một API trực quan và type-safe để thực hiện tất cả các thao tác này.

### 5.6.1 Create (Tạo mới)

Để tạo một record mới trong database, sử dụng method `create()` với object `data` chứa các field values. Method này trả về record vừa được tạo với đầy đủ thông tin bao gồm cả các generated fields như `id` hay `createdAt`.

```typescript
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    password: await bcrypt.hash('password123', 10)
  }
});
```

Prisma cũng hỗ trợ tạo record cùng với các related records trong cùng một transaction thông qua nested creates. Trong ví dụ dưới đây, một User được tạo đồng thời với một Workspace mà user đó sở hữu. Option `include` cho phép chỉ định những relations nào cần được trả về trong response.

```typescript
const userWithWorkspace = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed',
    ownedWorkspaces: {
      create: {
        name: 'My Workspace',
        description: 'Default workspace'
      }
    }
  },
  include: { ownedWorkspaces: true }
});
```

Khi cần tạo nhiều records cùng lúc, method `createMany()` cho phép batch insert với hiệu năng tốt hơn so với việc gọi `create()` nhiều lần. Method này trả về số lượng records đã được tạo.

```typescript
const result = await prisma.task.createMany({
  data: [
    { title: 'Task 1', projectId: projectId },
    { title: 'Task 2', projectId: projectId },
    { title: 'Task 3', projectId: projectId }
  ]
});
// result = { count: 3 }
```

### 5.6.2 Read (Đọc dữ liệu)

Prisma cung cấp nhiều methods để query dữ liệu phù hợp với các use cases khác nhau. Method `findUnique()` được sử dụng khi biết chính xác unique identifier của record cần tìm, có thể là primary key hoặc bất kỳ field nào có constraint `@unique`. Method này trả về một record hoặc null nếu không tìm thấy.

```typescript
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
});
```

Khi cần tìm record đầu tiên thỏa mãn một số điều kiện nhất định, `findFirst()` là lựa chọn phù hợp. Method này đặc biệt hữu ích khi kết hợp với `orderBy` để lấy record "mới nhất" hoặc "cũ nhất" theo một tiêu chí nào đó.

```typescript
const oldestTodo = await prisma.task.findFirst({
  where: { status: 'TODO' },
  orderBy: { createdAt: 'asc' }
});
```

Để query nhiều records, sử dụng `findMany()`. Method này hỗ trợ đầy đủ các options cho filtering, sorting, và pagination.

```typescript
const todoTasks = await prisma.task.findMany({
  where: { 
    status: 'TODO',
    priority: { in: ['HIGH', 'URGENT'] }
  },
  skip: 0,
  take: 20,
  orderBy: { createdAt: 'desc' }
});
```

Một trong những tính năng mạnh mẽ nhất của Prisma là khả năng include related data trong cùng một query. Thay vì phải chạy nhiều queries riêng biệt rồi manually join kết quả, chỉ cần khai báo những relations cần include và Prisma sẽ handle việc join ở database level.

```typescript
const taskWithDetails = await prisma.task.findUnique({
  where: { id: taskId },
  include: {
    createdBy: true,
    project: true,
    comments: {
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    },
    labels: { include: { label: true } }
  }
});
```

Khi chỉ cần một số fields cụ thể thay vì toàn bộ record, option `select` cho phép chỉ định chính xác những fields nào cần trả về. Điều này đặc biệt quan trọng khi làm việc với những models có nhiều fields hoặc khi cần tránh expose các sensitive fields như password.

```typescript
const userEmails = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true
  }
});
```

### 5.6.3 Update (Cập nhật)

Để cập nhật một record, sử dụng method `update()` với `where` clause để xác định record cần update và `data` object chứa các giá trị mới. Method này trả về record đã được cập nhật.

```typescript
const updatedTask = await prisma.task.update({
  where: { id: taskId },
  data: { 
    title: 'Updated title',
    status: 'IN_PROGRESS'
  }
});
```

Khi cần update nhiều records thỏa mãn một điều kiện, `updateMany()` cho phép batch update. Ví dụ dưới đây đánh dấu tất cả các tasks quá hạn là URGENT.

```typescript
const result = await prisma.task.updateMany({
  where: { 
    status: 'TODO',
    dueDate: { lt: new Date() }
  },
  data: { priority: 'URGENT' }
});
// result = { count: 5 }
```

Một pattern phổ biến là "upsert" - update nếu record tồn tại, create nếu chưa có. Prisma hỗ trợ trực tiếp pattern này thông qua method `upsert()`, giúp code gọn gàng hơn thay vì phải check existence trước rồi mới quyết định create hay update.

```typescript
const user = await prisma.user.upsert({
  where: { email: 'john@example.com' },
  update: { name: 'John Updated' },
  create: {
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed'
  }
});
```

### 5.6.4 Delete (Xóa)

Method `delete()` xóa một record dựa trên unique identifier và trả về record đã bị xóa. Nếu record không tồn tại, Prisma sẽ throw error.

```typescript
const deletedTask = await prisma.task.delete({
  where: { id: taskId }
});
```

Tương tự, `deleteMany()` cho phép xóa nhiều records thỏa mãn điều kiện.

```typescript
const result = await prisma.comment.deleteMany({
  where: { taskId: taskId }
});
// result = { count: 10 }
```

Trong thực tế, nhiều ứng dụng không thực sự xóa dữ liệu mà chỉ đánh dấu là đã xóa - pattern này gọi là Soft Delete. Để implement soft delete, thêm một optional DateTime field như `deletedAt` vào model. Khi "xóa", update field này với timestamp hiện tại. Khi query, thêm điều kiện `deletedAt: null` để chỉ lấy những records chưa bị xóa. Pattern này cho phép khôi phục dữ liệu khi cần và giữ lại audit trail.

```typescript
// Soft delete
await prisma.task.update({
  where: { id: taskId },
  data: { deletedAt: new Date() }
});

// Query only active records
const activeTasks = await prisma.task.findMany({
  where: { deletedAt: null }
});
```

---

## 5.7 Advanced Queries

### 5.7.1 Filtering với nhiều điều kiện

Prisma hỗ trợ các logical operators `AND`, `OR`, và `NOT` để xây dựng các điều kiện filter phức tạp. Trong ví dụ dưới đây, query tìm các tasks đồng thời thỏa mãn: có status là TODO và priority cao (AND), hoặc có chữ "urgent" trong title hoặc đã quá hạn (OR), và chưa bị soft delete (NOT).

```typescript
const tasks = await prisma.task.findMany({
  where: {
    AND: [
      { status: 'TODO' },
      { priority: { in: ['HIGH', 'URGENT'] } }
    ],
    OR: [
      { title: { contains: 'urgent', mode: 'insensitive' } },
      { dueDate: { lt: new Date() } }
    ],
    NOT: {
      deletedAt: { not: null }
    }
  }
});
```

### 5.7.2 Aggregation

Các operations tổng hợp dữ liệu như đếm, tính tổng, tính trung bình cũng được Prisma hỗ trợ đầy đủ. Method `count()` đếm số lượng records thỏa mãn điều kiện. Method `aggregate()` cho phép tính các giá trị thống kê như sum, average, min, max. Method `groupBy()` nhóm dữ liệu theo một hoặc nhiều fields và tính aggregate cho mỗi nhóm.

```typescript
const taskCount = await prisma.task.count({
  where: { status: 'DONE' }
});

const stats = await prisma.task.aggregate({
  _count: true,
  _avg: { estimatedHours: true },
  _sum: { actualHours: true },
  where: { projectId: projectId }
});

const tasksByStatus = await prisma.task.groupBy({
  by: ['status'],
  _count: true,
  where: { projectId: projectId }
});
```

### 5.7.3 Transactions

Khi cần đảm bảo nhiều database operations được thực hiện một cách atomic - tức là hoặc tất cả đều thành công, hoặc tất cả đều được rollback - Prisma cung cấp transactions. Trong ví dụ dưới đây, việc chuyển task sang project khác và log activity được wrap trong một transaction. Nếu bất kỳ operation nào fail, tất cả các thay đổi sẽ được rollback tự động.

```typescript
const result = await prisma.$transaction(async (tx) => {
  const task = await tx.task.update({
    where: { id: taskId },
    data: { projectId: newProjectId }
  });
  
  await tx.activityLog.create({
    data: {
      action: 'TASK_MOVED',
      entityType: 'task',
      entityId: taskId,
      userId: userId,
      workspaceId: workspaceId,
      oldValue: { projectId: oldProjectId },
      newValue: { projectId: newProjectId }
    }
  });
  
  return task;
});
```

---

## 5.8 Tích hợp Prisma với NestJS

Mặc dù Prisma không có official NestJS package như TypeORM hay Mongoose, việc tích hợp Prisma vào một application NestJS vẫn rất đơn giản và elegant. Cách tiếp cận phổ biến nhất là tạo một PrismaService để wrap Prisma Client, sau đó expose service này thông qua một global module. Phần này sẽ hướng dẫn chi tiết từng bước để setup và sử dụng Prisma trong kiến trúc NestJS.

### 5.8.1 Tạo Prisma Service

Trong triết lý của NestJS, mọi external dependency đều nên được wrap trong một injectable service. Điều này mang lại nhiều lợi ích quan trọng. Đầu tiên, việc wrap Prisma Client trong service cho phép tận dụng đầy đủ dependency injection system của NestJS. Thay vì import và sử dụng Prisma Client trực tiếp (tight coupling), các modules khác chỉ cần inject PrismaService - pattern này giúp code loosely coupled và dễ test hơn.

Thứ hai, việc có một service trung tâm cho database connection giúp quản lý lifecycle một cách nhất quán. NestJS cung cấp các lifecycle hooks như `OnModuleInit` và `OnModuleDestroy`, cho phép control chính xác khi nào connect và disconnect khỏi database. Điều này đặc biệt quan trọng để đảm bảo connections được cleanup properly khi application shutdown.

Thứ ba, trong testing, việc mock toàn bộ database layer trở nên cực kỳ đơn giản. Chỉ cần provide một mock implementation của PrismaService trong testing module, và tất cả các services sử dụng nó sẽ tự động nhận mock thay vì real database connection.

Dưới đây là implementation đầy đủ của PrismaService:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}
```

Trong implementation trên, PrismaService extends trực tiếp từ PrismaClient, có nghĩa là nó sẽ kế thừa tất cả các methods của Prisma Client như `prisma.user.create()`, `prisma.task.findMany()`, v.v. Decorator `@Injectable()` đánh dấu class này có thể được inject vào các classes khác thông qua constructor. Hai lifecycle hooks `OnModuleInit` và `OnModuleDestroy` đảm bảo connection được establish khi application khởi động và được gracefully close khi shutdown.

### 5.8.2 Tạo Prisma Module

Bước tiếp theo là tạo một module để export PrismaService. Có hai cách tiếp cận chính: local module (import ở mỗi feature module cần sử dụng) hoặc global module (import một lần ở root level và available everywhere). Với database service - một dependency được sử dụng ở hầu hết các places trong application - global module là lựa chọn phù hợp hơn.

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Decorator `@Global()` là key ở đây. Khi một module được đánh dấu global, các providers mà nó export sẽ available ở bất kỳ đâu trong application mà không cần explicit import. Tuy nhiên, PrismaModule vẫn cần được import một lần ở AppModule để register với NestJS's IoC container.

```typescript
@Module({
  imports: [
    PrismaModule,  // Import một lần ở root module
    UsersModule,
    TasksModule,
    ProjectsModule,
    // ... other feature modules
  ],
})
export class AppModule {}
```

Sau bước này, PrismaService sẽ automatically available để inject trong bất kỳ service hay controller nào của application.

### 5.8.3 Sử dụng trong Service

Với PrismaService đã được setup, việc sử dụng trong các feature services trở nên straightforward và elegant. Inject PrismaService thông qua constructor (như mọi dependency khác trong NestJS), sau đó sử dụng như một Prisma Client thông thường. Tất cả các queries đều type-safe và có đầy đủ intellisense support từ IDE.

Dưới đây là ví dụ một TaskService hoàn chỉnh với các operations phổ biến:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        createdById: userId
      },
      include: {
        createdBy: { select: { id: true, name: true, avatar: true } },
        project: { select: { id: true, name: true } }
      }
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId, deletedAt: null },
      include: {
        assignments: { include: { user: true } },
        labels: { include: { label: true } },
        subtasks: true
      },
      orderBy: { position: 'asc' }
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: true,
        project: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        createdBy: { select: { id: true, name: true } },
        assignments: { include: { user: true } }
      }
    });
  }

  async remove(id: string) {
    // Soft delete
    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
```

Trong ví dụ trên, có thể thấy một số patterns quan trọng. Option `include` được sử dụng xuyên suốt để eager load các related data cần thiết, tránh N+1 query problem. Option `select` trong nested includes cho phép chọn chỉ những fields cần thiết từ related records, giảm data transfer và improve performance. Error handling với NotFoundException đảm bảo API trả về response phù hợp khi resource không tồn tại. Soft delete pattern được implement bằng cách update `deletedAt` thay vì xóa thực sự, và filter `deletedAt: null` trong queries đảm bảo chỉ lấy active records.

---

## 5.9. Lỗi thường gặp và Trade-offs (bổ sung)

Khi làm việc với Prisma ORM và cơ sở dữ liệu, nhóm đã nhận diện được một số vấn đề về hiệu năng và những đánh đổi thiết kế quan trọng cần cân nhắc trong quá trình phát triển.

### 5.9.1. Vấn đề N+1 Query — Cạm bẫy phổ biến nhất

Vấn đề N+1 Query là một trong những cạm bẫy phổ biến nhất khi làm việc với ORM. Vấn đề xảy ra khi lấy danh sách các bản ghi kèm theo dữ liệu quan hệ: hệ thống thực hiện 1 query để lấy danh sách chính, sau đó thực hiện thêm N query riêng lẻ cho từng bản ghi để lấy dữ liệu liên quan. Đoạn code dưới đây minh họa cách viết dẫn đến N+1 queries:

```typescript
// Cách viết gây ra N+1 queries — không nên sử dụng
const tasks = await this.prisma.task.findMany({ where: { projectId } });
for (const task of tasks) {
  task.assignees = await this.prisma.taskAssignment.findMany({
    where: { taskId: task.id }
  });
}
```

Giải pháp đúng là sử dụng tùy chọn `include` của Prisma để framework tự động thực hiện join trong một query duy nhất, giảm đáng kể số lần truy vấn đến cơ sở dữ liệu:

```typescript
// Cách viết tối ưu — chỉ 1 query duy nhất
const tasks = await this.prisma.task.findMany({
  where: { projectId },
  include: {
    assignments: {
      include: { user: { select: { id: true, name: true, avatar: true } } }
    },
    labels: { include: { label: true } },
    _count: { select: { subtasks: true } }
  }
});
```

### 5.9.2. Trade-off: include vs select

Prisma cung cấp hai cơ chế để kiểm soát dữ liệu trả về: `include` và `select`. Tùy chọn `include` cho phép thêm toàn bộ dữ liệu của các relation vào kết quả, phù hợp khi cần lấy đầy đủ thông tin của các bản ghi liên quan. Ngược lại, `select` chỉ lấy những fields cụ thể được chỉ định, giúp tối ưu hiệu năng bằng cách giảm lượng dữ liệu truyền tải.

Trong đồ án, cả hai cơ chế đều được sử dụng tùy theo ngữ cảnh. Ví dụ, khi lấy danh sách task kèm assignees, nhóm dùng `include` để eager load toàn bộ thông tin người được giao. Trong khi đó, hàm `getProfile()` của UserService sử dụng `select` để loại bỏ field password khỏi kết quả trả về, đảm bảo thông tin nhạy cảm không bị lộ ra ngoài.

### 5.9.3. Khi nào KHÔNG nên dùng Prisma Migrate

Mặc dù Prisma Migrate là công cụ hữu ích cho việc quản lý schema database, có một số tình huống cần đặc biệt thận trọng. Đối với production database chứa dữ liệu quan trọng, luôn phải thực hiện backup trước khi chạy migration. Khi cần đổi tên column, Prisma sẽ thực hiện thao tác DROP rồi ADD thay vì RENAME, dẫn đến mất dữ liệu. Trong trường hợp này, cần tạo migration rỗng và viết SQL tùy chỉnh:

```bash
# Tạo migration rỗng để viết SQL tùy chỉnh
npx prisma migrate dev --name rename_column --create-only
# Sau đó chỉnh sửa file migration.sql trước khi apply
```

Ngoài ra, một số tính năng đặc thù của database như partitioning hay triggers cũng cần được xử lý bằng raw SQL thay vì thông qua Prisma schema.

---

## 5.10. Tổng kết

Chương này đã trình bày toàn diện về việc làm việc với database trong ứng dụng NestJS sử dụng Prisma ORM. Hành trình bắt đầu từ việc tìm hiểu khái niệm ORM và vai trò của nó như cầu nối giữa thế giới hướng đối tượng trong code và thế giới quan hệ trong database. Sau khi khảo sát các ORM phổ biến trong hệ sinh thái NestJS bao gồm TypeORM, Sequelize, MikroORM, và Mongoose, chúng ta đã lựa chọn Prisma vì những ưu điểm vượt trội về type safety, developer experience, và khả năng tự động hóa migrations.

Về mặt kỹ thuật, chương đã đi sâu vào kiến trúc ba thành phần của Prisma gồm Prisma Client, Prisma Migrate, và Prisma Studio. Quy trình làm việc với Prisma Schema Language để định nghĩa models, field types, enums, và các loại relations (One-to-Many, Many-to-Many, One-to-One, Self-Relation) đã được minh họa chi tiết với các ví dụ thực tế từ dự án TodoList Collaboration.

Phần thực hành đã cover toàn bộ các thao tác CRUD cơ bản cùng với những advanced queries như filtering phức tạp, aggregation, và transactions. Cuối cùng, việc tích hợp Prisma vào kiến trúc NestJS thông qua PrismaService và PrismaModule đảm bảo rằng database layer được quản lý một cách nhất quán và tận dụng được dependency injection system của framework.

Với nền tảng kiến thức này, chúng ta đã sẵn sàng để xây dựng tầng data access hoàn chỉnh cho ứng dụng TodoList Collaboration, đảm bảo việc tương tác với database được thực hiện một cách hiệu quả, an toàn, và dễ bảo trì trong dài hạn.
