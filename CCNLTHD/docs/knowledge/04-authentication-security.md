# 📘 Phần 4: Authentication & Security

> **Thời gian học:** 4-5 ngày  
> **Độ khó:** ⭐⭐⭐⭐ Khó  
> **Yêu cầu:** NestJS Core, HTTP basics

---

## 1. JWT (JSON Web Token)

### 1.1 JWT Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

┌─────────────┐.┌─────────────┐.┌─────────────┐
│   HEADER    │ │   PAYLOAD   │ │  SIGNATURE  │
└─────────────┘ └─────────────┘ └─────────────┘
```

| Part | Mô tả | Nội dung |
|------|-------|----------|
| **Header** | Metadata | Algorithm, Type |
| **Payload** | Claims/Data | userId, email, exp, iat |
| **Signature** | Verification | HMAC(header + payload, secret) |

### 1.2 Cài đặt

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

### 1.3 JWT Module Configuration

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 2. Authentication Flow

### 2.1 Register

```typescript
// auth/auth.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  private excludePassword(user: User) {
    const { password, ...result } = user;
    return result;
  }
}
```

### 2.2 Login

```typescript
async login(dto: LoginDto) {
  // Find user
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Generate tokens
  const tokens = await this.generateTokens(user);

  // Save refresh token hash in database
  await this.updateRefreshToken(user.id, tokens.refreshToken);

  return {
    user: this.excludePassword(user),
    ...tokens,
  };
}
```

### 2.3 Refresh Token

```typescript
async refreshTokens(userId: number, refreshToken: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user || !user.refreshToken) {
    throw new ForbiddenException('Access denied');
  }

  // Verify refresh token
  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) {
    throw new ForbiddenException('Access denied');
  }

  // Generate new tokens
  const tokens = await this.generateTokens(user);
  await this.updateRefreshToken(user.id, tokens.refreshToken);

  return tokens;
}

private async updateRefreshToken(userId: number, refreshToken: string) {
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: hashedToken },
  });
}
```

---

## 3. Passport Strategies

### 3.1 JWT Strategy

```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, avatarUrl: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;  // Attached to request.user
  }
}
```

### 3.2 Local Strategy (Username/Password)

```typescript
// auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',  // Use email instead of username
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

### 3.3 Refresh Token Strategy

```typescript
// auth/strategies/refresh-token.strategy.ts
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,  // Pass request to validate
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
```

---

## 4. Guards

### 4.1 JWT Auth Guard

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

// Public decorator
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### 4.2 Roles Guard

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Usage
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles(Role.ADMIN)
  getAdminData() {
    return 'Admin only data';
  }
}
```

### 4.3 Workspace Member Guard

```typescript
// workspace/guards/workspace-member.guard.ts
@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const workspaceId = parseInt(request.params.workspaceId);

    if (!workspaceId) return true;

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    // Attach member to request for later use
    request.workspaceMember = member;
    return true;
  }
}
```

---

## 5. OAuth 2.0

### 5.1 Google OAuth Strategy

```bash
npm install passport-google-oauth20
npm install -D @types/passport-google-oauth20
```

```typescript
// auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { emails, displayName, photos } = profile;
    
    const user = await this.authService.validateOAuthUser({
      email: emails[0].value,
      name: displayName,
      avatarUrl: photos[0]?.value,
      provider: 'GOOGLE',
      providerId: profile.id,
    });

    done(null, user);
  }
}
```

### 5.2 OAuth Controller

```typescript
// auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.generateTokens(req.user);
    
    // Redirect to frontend with tokens
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
    );
  }
}
```

### 5.3 GitHub OAuth Strategy

```typescript
// auth/strategies/github.strategy.ts
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET'),
      callbackURL: config.get('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { emails, displayName, photos, id } = profile;
    
    return this.authService.validateOAuthUser({
      email: emails[0].value,
      name: displayName,
      avatarUrl: photos[0]?.value,
      provider: 'GITHUB',
      providerId: id,
    });
  }
}
```

---

## 6. Security Best Practices

### 6.1 Password Hashing

```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash password
const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

// Compare password
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### 6.2 Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 1 minute
      limit: 10,   // 10 requests per minute
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

// Custom rate limit for specific routes
@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 attempts per minute
  login() {}
}
```

### 6.3 Helmet (Security Headers)

```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet());
  
  await app.listen(3000);
}
```

### 6.4 CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,  // Allow cookies
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### 6.5 Input Validation

```typescript
// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    { message: 'Password must contain uppercase, lowercase, number and special character' }
  )
  password: string;
}
```

---

## 7. Custom Decorators

### 7.1 Current User Decorator

```typescript
// common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// Usage
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}

@Get('my-id')
getMyId(@CurrentUser('id') userId: number) {
  return userId;
}
```

### 7.2 Auth Decorator (Combined)

```typescript
// common/decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(...roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

// Usage
@Controller('admin')
export class AdminController {
  @Get()
  @Auth(Role.ADMIN)
  getAdminData() {}
}
```

---

## 📚 Tài liệu tham khảo

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [OWASP Security Guidelines](https://owasp.org/)
