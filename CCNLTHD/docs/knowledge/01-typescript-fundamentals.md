# 📘 Phần 1: TypeScript Fundamentals

> **Thời gian học:** 3-4 ngày  
> **Độ khó:** ⭐⭐ Trung bình  
> **Yêu cầu:** Biết JavaScript cơ bản

---

## 1. Types cơ bản

### 1.1 Primitive Types

```typescript
// String
let name: string = "John";

// Number (không phân biệt int/float)
let age: number = 25;
let price: number = 99.99;

// Boolean
let isActive: boolean = true;

// Null và Undefined
let nothing: null = null;
let notDefined: undefined = undefined;

// Any (tránh dùng nếu có thể)
let flexible: any = "can be anything";
```

### 1.2 Array và Tuple

```typescript
// Array - 2 cách khai báo
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Tuple - array với fixed length và types
let user: [string, number] = ["John", 25];
let rgb: [number, number, number] = [255, 128, 0];

// Destructuring
const [username, userAge] = user;
```

### 1.3 Object Types

```typescript
// Inline object type
let person: { name: string; age: number } = {
  name: "John",
  age: 25
};

// Optional properties với ?
let config: { host: string; port?: number } = {
  host: "localhost"
  // port là optional
};

// Readonly properties
let point: { readonly x: number; readonly y: number } = {
  x: 10,
  y: 20
};
// point.x = 5; // Error: Cannot assign to 'x'
```

---

## 2. Interfaces

### 2.1 Định nghĩa Interface

```typescript
// Interface cho object
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;           // Optional
  readonly createdAt: Date; // Read-only
}

// Sử dụng
const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  createdAt: new Date()
};
```

### 2.2 Extending Interfaces

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}

const employee: Employee = {
  name: "John",
  age: 30,
  employeeId: "EMP001",
  department: "Engineering"
};
```

### 2.3 Interface cho Functions

```typescript
// Function type interface
interface Calculator {
  (a: number, b: number): number;
}

const add: Calculator = (a, b) => a + b;
const subtract: Calculator = (a, b) => a - b;

// Interface với methods
interface UserService {
  findById(id: number): User;
  findAll(): User[];
  create(data: Partial<User>): User;
}
```

---

## 3. Type Aliases

### 3.1 Tạo Type Alias

```typescript
// Type alias cho primitive
type ID = number | string;

// Type alias cho object
type Point = {
  x: number;
  y: number;
};

// Type alias cho union
type Status = "pending" | "active" | "completed";

// Type alias cho function
type Callback = (error: Error | null, result?: any) => void;
```

### 3.2 Union Types

```typescript
// Union type - hoặc này hoặc kia
type StringOrNumber = string | number;

function printId(id: StringOrNumber) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // TypeScript biết id là string
  } else {
    console.log(id.toFixed(2)); // TypeScript biết id là number
  }
}

printId("abc");  // OK
printId(123);    // OK
```

### 3.3 Intersection Types

```typescript
// Intersection type - kết hợp cả hai
type Person = {
  name: string;
  age: number;
};

type ContactInfo = {
  email: string;
  phone: string;
};

type Employee = Person & ContactInfo;

const emp: Employee = {
  name: "John",
  age: 30,
  email: "john@example.com",
  phone: "123-456-7890"
};
```

---

## 4. Generics

### 4.1 Generic Functions

```typescript
// Không có generic - phải viết nhiều functions
function identityNumber(arg: number): number {
  return arg;
}
function identityString(arg: string): string {
  return arg;
}

// Với generic - 1 function cho tất cả types
function identity<T>(arg: T): T {
  return arg;
}

// Sử dụng
const num = identity<number>(42);     // T = number
const str = identity<string>("hello"); // T = string
const auto = identity(true);          // T = boolean (inferred)
```

### 4.2 Generic Interfaces

```typescript
// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Sử dụng với các types khác nhau
type UserResponse = ApiResponse<User>;
type TaskResponse = ApiResponse<Task>;
type ListResponse = ApiResponse<User[]>;

// Example
const response: ApiResponse<User> = {
  data: { id: 1, name: "John", email: "john@test.com", createdAt: new Date() },
  status: 200,
  message: "Success"
};
```

### 4.3 Generic Constraints

```typescript
// Constraint với extends
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");      // OK - string có length
logLength([1, 2, 3]);    // OK - array có length
logLength({ length: 5 }); // OK - object có length
// logLength(123);       // Error - number không có length
```

### 4.4 Generic với keyof

```typescript
// keyof - lấy tất cả keys của một type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, "name"); // OK, trả về string
const age = getProperty(user, "age");   // OK, trả về number
// getProperty(user, "email");          // Error - "email" không tồn tại
```

---

## 5. Classes

### 5.1 Class cơ bản

```typescript
class Person {
  // Properties
  name: string;
  age: number;

  // Constructor
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Method
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const person = new Person("John", 30);
console.log(person.greet());
```

### 5.2 Access Modifiers

```typescript
class Employee {
  public name: string;        // Accessible everywhere (default)
  private salary: number;     // Only accessible within class
  protected department: string; // Accessible within class and subclasses
  readonly id: string;        // Cannot be modified after initialization

  constructor(name: string, salary: number, dept: string) {
    this.name = name;
    this.salary = salary;
    this.department = dept;
    this.id = `EMP-${Date.now()}`;
  }

  // Shorthand constructor (tự động tạo properties)
  // constructor(
  //   public name: string,
  //   private salary: number,
  //   protected department: string
  // ) {}
}
```

### 5.3 Inheritance

```typescript
class Animal {
  constructor(public name: string) {}

  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name); // Gọi constructor của parent
  }

  bark(): void {
    console.log("Woof!");
  }

  // Override parent method
  move(distance: number): void {
    console.log("Running...");
    super.move(distance); // Gọi method của parent
  }
}
```

### 5.4 Abstract Classes

```typescript
abstract class Shape {
  abstract area(): number;      // Must be implemented by subclasses
  abstract perimeter(): number;

  // Concrete method
  describe(): string {
    return `Area: ${this.area()}, Perimeter: ${this.perimeter()}`;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}
```

---

## 6. Decorators

> ⚠️ **Quan trọng:** Decorators là nền tảng của NestJS!

### 6.1 Enabling Decorators

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 6.2 Class Decorator

```typescript
// Decorator factory
function Logger(prefix: string) {
  return function (constructor: Function) {
    console.log(`${prefix}: ${constructor.name} class created`);
  };
}

@Logger("LOG")
class UserService {
  // ...
}
// Output: "LOG: UserService class created"
```

### 6.3 Method Decorator

```typescript
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// Output:
// Calling add with args: [2, 3]
// Result: 5
```

### 6.4 Property Decorator

```typescript
function MinLength(min: number) {
  return function (target: any, propertyKey: string) {
    let value: string;

    const getter = () => value;
    const setter = (newVal: string) => {
      if (newVal.length < min) {
        throw new Error(`${propertyKey} must be at least ${min} characters`);
      }
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    });
  };
}

class User {
  @MinLength(3)
  name: string;
}
```

### 6.5 Parameter Decorator

```typescript
function Required(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} of ${propertyKey} is required`);
}

class UserController {
  createUser(@Required name: string, age?: number) {
    // ...
  }
}
```

---

## 7. Async/Await và Promises

### 7.1 Promises với TypeScript

```typescript
// Promise với type
function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "John", email: "john@test.com", createdAt: new Date() });
      } else {
        reject(new Error("Invalid ID"));
      }
    }, 1000);
  });
}

// Sử dụng với .then()
fetchUser(1)
  .then((user) => console.log(user.name)) // TypeScript biết user là User
  .catch((error) => console.error(error));
```

### 7.2 Async/Await

```typescript
// Async function
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const user: User = await response.json();
  return user;
}

// Error handling với try/catch
async function getUserSafe(id: number): Promise<User | null> {
  try {
    const user = await getUser(id);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

// Multiple async operations
async function getUserWithTasks(userId: number) {
  const [user, tasks] = await Promise.all([
    getUser(userId),
    getTasks(userId)
  ]);
  return { user, tasks };
}
```

---

## 8. Utility Types

TypeScript cung cấp nhiều utility types hữu ích:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial<T> - tất cả properties trở thành optional
type UpdateUserDto = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string }

// Required<T> - tất cả properties trở thành required
type RequiredUser = Required<Partial<User>>;

// Pick<T, K> - chọn một số properties
type UserCredentials = Pick<User, "email" | "password">;
// { email: string; password: string }

// Omit<T, K> - loại bỏ một số properties
type PublicUser = Omit<User, "password">;
// { id: number; name: string; email: string }

// Record<K, T> - tạo object type với keys K và values T
type UserRoles = Record<string, "admin" | "user" | "guest">;
// { [key: string]: "admin" | "user" | "guest" }

// Readonly<T> - tất cả properties trở thành readonly
type ImmutableUser = Readonly<User>;
```

---

## 📝 Bài tập thực hành

### Bài 1: Tạo Interface cho Todo App
```typescript
// Tạo interfaces cho: User, Task, Project, Comment
// Với đầy đủ relationships
```

### Bài 2: Generic Repository
```typescript
// Tạo generic interface Repository<T> với methods:
// - findAll(): Promise<T[]>
// - findById(id: number): Promise<T | null>
// - create(data: Partial<T>): Promise<T>
// - update(id: number, data: Partial<T>): Promise<T>
// - delete(id: number): Promise<void>
```

### Bài 3: Validation Decorator
```typescript
// Tạo decorator @IsEmail() để validate email format
// Tạo decorator @MinLength(n) để validate độ dài tối thiểu
```

---

## 📚 Tài liệu tham khảo

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript)
- [TypeScript Playground](https://www.typescriptlang.org/play)
