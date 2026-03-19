# Frontend Auth & User Testing App — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React SPA frontend at `/frontend` that exercises every Auth and User API endpoint on the NestJS backend (port 3333).

**Architecture:** Vite SPA with React Router (library mode, `createBrowserRouter`), Zustand for auth state with localStorage persistence, Axios instance with JWT interceptor + silent refresh. Six pages: Login, Register, Forgot Password, Reset Password, Dashboard, Profile Settings.

**Tech Stack:** Vite 6, React 19, TypeScript, Tailwind CSS v4, React Router v7 (library mode), Axios, Zustand, React Hook Form + Zod, React Hot Toast, Lucide React.

---

## File Structure

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── main.tsx                          # ReactDOM.createRoot, render <App />
│   ├── App.tsx                           # RouterProvider with createBrowserRouter
│   ├── index.css                         # Tailwind v4 import + base styles
│   ├── lib/
│   │   ├── axios.ts                      # Axios instance, interceptors (attach JWT, silent refresh)
│   │   └── validators.ts                 # Zod schemas matching backend DTOs
│   ├── stores/
│   │   └── auth.store.ts                 # Zustand store: tokens, user, login/logout/refresh actions
│   ├── types/
│   │   └── api.ts                        # ApiResponse<T>, User, AuthTokens, error types
│   ├── components/
│   │   ├── ProtectedRoute.tsx            # Redirect to /login if no token
│   │   ├── GuestRoute.tsx                # Redirect to /dashboard if logged in
│   │   └── Layout.tsx                    # Navbar + <Outlet /> + toast container
│   └── pages/
│       ├── LoginPage.tsx                 # POST /auth/login
│       ├── RegisterPage.tsx              # POST /auth/register
│       ├── ForgotPasswordPage.tsx        # POST /auth/forgot-password
│       ├── ResetPasswordPage.tsx         # POST /auth/reset-password
│       ├── DashboardPage.tsx             # GET /users/me — display profile card
│       └── ProfileSettingsPage.tsx       # PATCH /users/me, change-password, upload avatar
```

---

## Backend API Reference (exact field names)

### DTOs → Request Bodies
| Endpoint | Fields |
|----------|--------|
| POST /auth/register | `{ email, password, fullname }` |
| POST /auth/login | `{ email, password }` |
| POST /auth/refresh | `{ refreshToken }` |
| POST /auth/logout | _(empty body, needs Bearer token)_ |
| POST /auth/forgot-password | `{ email }` |
| POST /auth/reset-password | `{ token, newPassword }` |
| GET /users/me | _(no body)_ |
| PATCH /users/me | `{ displayName?, bio? }` |
| PATCH /users/me/change-password | `{ currentPassword, newPassword, confirmPassword }` |
| POST /users/me/avatar | `FormData` field name = `avatar` (max 5MB, jpg/png/gif) |

### Response Envelope
```ts
// Success
{ success: true, data: T, timestamp: string }
// Error
{ success: false, statusCode: number, message: string | string[], path: string, timestamp: string }
```

### Password Regex (register & reset)
```
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

### User Model (returned by GET /users/me)
```ts
{ id, email, name, avatar?, status, emailVerified, lastLoginAt?, createdAt, updatedAt }
```

---

## Chunk 1: Project Scaffold & Core Infrastructure

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/index.css`
- Create: `frontend/src/vite-env.d.ts`

- [ ] **Step 1: Create the Vite project**

```bash
cd D:/IT/Projects/CCNLTHD
npm create vite@latest frontend -- --template react-ts
```

- [ ] **Step 2: Install dependencies**

```bash
cd D:/IT/Projects/CCNLTHD/frontend
npm install react-router react-hot-toast axios zustand react-hook-form @hookform/resolvers zod lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Vite with Tailwind CSS v4 and proxy**

Replace `frontend/vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 4: Set up Tailwind CSS v4 in index.css**

Replace `frontend/src/index.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 5: Create minimal App.tsx placeholder**

Replace `frontend/src/App.tsx`:

```tsx
function App() {
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-2xl font-bold text-gray-900">CCNLTHD Frontend</h1>
  </div>
}

export default App
```

- [ ] **Step 6: Verify dev server runs**

```bash
cd D:/IT/Projects/CCNLTHD/frontend
npm run dev
```

Open http://localhost:5173 — should see "CCNLTHD Frontend" with Tailwind styles applied.

- [ ] **Step 7: Commit scaffold**

```bash
cd D:/IT/Projects/CCNLTHD
git add frontend/
git commit -m "feat(frontend): scaffold Vite + React + TypeScript + Tailwind v4"
```

---

### Task 2: API types and Axios instance with JWT interceptor

**Files:**
- Create: `frontend/src/types/api.ts`
- Create: `frontend/src/lib/axios.ts`

- [ ] **Step 1: Create API types**

Create `frontend/src/types/api.ts`:

```ts
// Matches backend TransformResponseInterceptor
export interface ApiResponse<T> {
  success: true
  data: T
  timestamp: string
}

// Matches backend HttpExceptionFilter
export interface ApiError {
  success: false
  statusCode: number
  message: string | string[]
  path: string
  timestamp: string
}

// Matches Prisma User model (password excluded by backend)
export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  emailVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// Auth endpoint responses
export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}
```

- [ ] **Step 2: Create Axios instance with interceptors**

Create `frontend/src/lib/axios.ts`:

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  const state = JSON.parse(localStorage.getItem('auth-storage') || '{}')
  const token = state?.state?.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: unwrap data, handle token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token)
    else p.reject(error)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      const state = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      const refreshToken = state?.state?.refreshToken

      if (!refreshToken) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post('/api/v1/auth/refresh', { refreshToken })
        const newAccessToken = res.data.data.accessToken
        const newRefreshToken = res.data.data.refreshToken

        // Update Zustand persisted state
        const currentState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
        currentState.state.accessToken = newAccessToken
        currentState.state.refreshToken = newRefreshToken
        localStorage.setItem('auth-storage', JSON.stringify(currentState))

        processQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Clear auth state on refresh failure
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/types/ frontend/src/lib/
git commit -m "feat(frontend): add API types and Axios instance with JWT interceptor"
```

---

### Task 3: Zustand auth store

**Files:**
- Create: `frontend/src/stores/auth.store.ts`

- [ ] **Step 1: Create the auth store**

Create `frontend/src/stores/auth.store.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/axios'
import type { User, LoginResponse, RegisterResponse, ApiResponse } from '../types/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullname: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
          email,
          password,
        })
        const { user, accessToken, refreshToken } = res.data.data
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      register: async (email, password, fullname) => {
        const res = await api.post<ApiResponse<RegisterResponse>>('/auth/register', {
          email,
          password,
          fullname,
        })
        const { user, accessToken, refreshToken } = res.data.data
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch {
          // Logout even if API call fails
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      fetchUser: async () => {
        const res = await api.get<ApiResponse<User>>('/users/me')
        set({ user: res.data.data })
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isAuthenticated: true })
      },

      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
)
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/stores/
git commit -m "feat(frontend): add Zustand auth store with persist"
```

---

### Task 4: Zod validation schemas

**Files:**
- Create: `frontend/src/lib/validators.ts`

- [ ] **Step 1: Create Zod schemas matching backend DTOs exactly**

Create `frontend/src/lib/validators.ts`:

```ts
import { z } from 'zod'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Must contain uppercase, lowercase, number, and special character (@$!%*?&)',
    ),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Must contain uppercase, lowercase, number, and special character (@$!%*?&)',
    ),
})

export const updateProfileSchema = z.object({
  displayName: z.string().max(50, 'Max 50 characters').optional().or(z.literal('')),
  bio: z.string().max(160, 'Max 160 characters').optional().or(z.literal('')),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Must contain uppercase, number, and special character (@$!%*?&)',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/lib/validators.ts
git commit -m "feat(frontend): add Zod validation schemas matching backend DTOs"
```

---

## Chunk 2: Routing, Layout & Auth Pages

### Task 5: Route guards and Layout

**Files:**
- Create: `frontend/src/components/ProtectedRoute.tsx`
- Create: `frontend/src/components/GuestRoute.tsx`
- Create: `frontend/src/components/Layout.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/main.tsx`

- [ ] **Step 1: Create ProtectedRoute**

Create `frontend/src/components/ProtectedRoute.tsx`:

```tsx
import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../stores/auth.store'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
```

- [ ] **Step 2: Create GuestRoute**

Create `frontend/src/components/GuestRoute.tsx`:

```tsx
import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../stores/auth.store'

export default function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
```

- [ ] **Step 3: Create Layout with Navbar**

Create `frontend/src/components/Layout.tsx`:

```tsx
import { Link, Outlet, useNavigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '../stores/auth.store'

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            CCNLTHD
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <User size={16} />
                {user?.name || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Set up router in App.tsx**

Replace `frontend/src/App.tsx`:

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile', element: <ProfileSettingsPage /> },
        ],
      },
      { path: '/', element: <LoginPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
```

- [ ] **Step 5: Create placeholder pages (so app compiles)**

Create each page file with a minimal placeholder:

`frontend/src/pages/LoginPage.tsx`:
```tsx
export default function LoginPage() {
  return <div>Login Page (TODO)</div>
}
```

Repeat for `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`, `DashboardPage.tsx`, `ProfileSettingsPage.tsx` — same pattern, different text.

- [ ] **Step 6: Verify routing works**

```bash
cd D:/IT/Projects/CCNLTHD/frontend && npm run dev
```

Visit `/login`, `/register`, `/dashboard` — verify redirects work correctly.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): add routing, layout, route guards, and page placeholders"
```

---

### Task 6: Login page

**Files:**
- Modify: `frontend/src/pages/LoginPage.tsx`

- [ ] **Step 1: Implement LoginPage**

Replace `frontend/src/pages/LoginPage.tsx`:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'
import { loginSchema, type LoginForm } from '../lib/validators'
import { useAuthStore } from '../stores/auth.store'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Login failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <LogIn className="mx-auto mb-3 text-indigo-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500 space-y-1">
        <p>
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot your password?
          </Link>
        </p>
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify login form renders and validates**

```bash
cd D:/IT/Projects/CCNLTHD/frontend && npm run dev
```

Visit `/login`, submit empty form — validation errors should appear.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/LoginPage.tsx
git commit -m "feat(frontend): implement Login page with form validation"
```

---

### Task 7: Register page

**Files:**
- Modify: `frontend/src/pages/RegisterPage.tsx`

- [ ] **Step 1: Implement RegisterPage**

Replace `frontend/src/pages/RegisterPage.tsx`:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import { registerSchema, type RegisterForm } from '../lib/validators'
import { useAuthStore } from '../stores/auth.store'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.email, data.password, data.fullname)
      toast.success('Account created! Welcome!')
      navigate('/dashboard')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <UserPlus className="mx-auto mb-3 text-indigo-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="text-sm text-gray-500 mt-1">Start managing your tasks</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            {...register('fullname')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="John Doe"
          />
          {errors.fullname && (
            <p className="text-sm text-red-600 mt-1">{errors.fullname.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Min 8 chars, uppercase, lowercase, number, special char (@$!%*?&)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/RegisterPage.tsx
git commit -m "feat(frontend): implement Register page"
```

---

### Task 8: Forgot Password & Reset Password pages

**Files:**
- Modify: `frontend/src/pages/ForgotPasswordPage.tsx`
- Modify: `frontend/src/pages/ResetPasswordPage.tsx`

- [ ] **Step 1: Implement ForgotPasswordPage**

Replace `frontend/src/pages/ForgotPasswordPage.tsx`:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { KeyRound } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordForm } from '../lib/validators'
import api from '../lib/axios'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await api.post('/auth/forgot-password', data)
      toast.success('If the email exists, a reset link has been sent. Check your console/logs for the token.')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Request failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <KeyRound className="mx-auto mb-3 text-indigo-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset token</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Sending...' : 'Send reset token'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link to="/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
        {' · '}
        <Link to="/reset-password" className="text-indigo-600 hover:underline">
          I have a token
        </Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Implement ResetPasswordPage**

Replace `frontend/src/pages/ResetPasswordPage.tsx`:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordForm } from '../lib/validators'
import api from '../lib/axios'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function ResetPasswordPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await api.post('/auth/reset-password', data)
      toast.success('Password reset successful! Please log in.')
      navigate('/login')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Reset failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <ShieldCheck className="mx-auto mb-3 text-indigo-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your reset token and new password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
          <input
            type="text"
            {...register('token')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            placeholder="Paste your reset token here"
          />
          {errors.token && (
            <p className="text-sm text-red-600 mt-1">{errors.token.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            {...register('newPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="••••••••"
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link to="/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/ForgotPasswordPage.tsx frontend/src/pages/ResetPasswordPage.tsx
git commit -m "feat(frontend): implement Forgot Password and Reset Password pages"
```

---

## Chunk 3: Dashboard & Profile Settings Pages

### Task 9: Dashboard page (GET /users/me)

**Files:**
- Modify: `frontend/src/pages/DashboardPage.tsx`

- [ ] **Step 1: Implement DashboardPage**

Replace `frontend/src/pages/DashboardPage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Settings, Mail, Calendar, Shield } from 'lucide-react'
import { useAuthStore } from '../stores/auth.store'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, fetchUser } = useAuthStore()
  const [loading, setLoading] = useState(!user)

  useEffect(() => {
    if (!user) {
      fetchUser()
        .catch(() => toast.error('Failed to load profile'))
        .finally(() => setLoading(false))
    }
  }, [user, fetchUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!user) {
    return <p className="text-center text-gray-500 py-20">Unable to load profile.</p>
  }

  const avatarUrl = user.avatar ? `/uploads/avatars/${user.avatar}` : null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/profile"
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline"
        >
          <Settings size={16} />
          Edit Profile
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} />
                Status: <span className="font-medium">{user.status}</span>
                {user.emailVerified && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              {user.lastLoginAt && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Last login: {new Date(user.lastLoginAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Testing note:</strong> This dashboard currently tests the <code>GET /api/v1/users/me</code> endpoint.
        Workspace, Project, and Task modules are not yet implemented in the backend.
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/DashboardPage.tsx
git commit -m "feat(frontend): implement Dashboard page with user profile display"
```

---

### Task 10: Profile Settings page (update profile, change password, upload avatar)

**Files:**
- Modify: `frontend/src/pages/ProfileSettingsPage.tsx`

- [ ] **Step 1: Implement ProfileSettingsPage**

Replace `frontend/src/pages/ProfileSettingsPage.tsx`:

```tsx
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Camera, Save, Lock } from 'lucide-react'
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileForm,
  type ChangePasswordForm,
} from '../lib/validators'
import { useAuthStore } from '../stores/auth.store'
import api from '../lib/axios'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function ProfileSettingsPage() {
  const { user, fetchUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  // --- Update Profile Form ---
  const profileForm = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user?.name || '',
      bio: '',
    },
  })

  const onUpdateProfile = async (data: UpdateProfileForm) => {
    try {
      await api.patch('/users/me', data)
      await fetchUser()
      toast.success('Profile updated!')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Update failed')
    }
  }

  // --- Change Password Form ---
  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onChangePassword = async (data: ChangePasswordForm) => {
    try {
      await api.patch('/users/me/change-password', data)
      toast.success('Password changed! You may need to re-login.')
      passwordForm.reset()
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Password change failed')
    }
  }

  // --- Avatar Upload ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Only JPG, PNG, and GIF files are allowed')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    setUploading(true)
    try {
      await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchUser()
      toast.success('Avatar uploaded!')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const avatarUrl = user?.avatar ? `/uploads/avatars/${user.avatar}` : null

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

      {/* Avatar Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h2>
        <div className="flex items-center gap-5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 text-sm"
            >
              <Camera size={16} />
              {uploading ? 'Uploading...' : 'Change avatar'}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
          </div>
        </div>
      </section>

      {/* Update Profile Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Info</h2>
        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              {...profileForm.register('displayName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your display name"
            />
            {profileForm.formState.errors.displayName && (
              <p className="text-sm text-red-600 mt-1">
                {profileForm.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              {...profileForm.register('bio')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Tell us about yourself (max 160 chars)"
            />
            {profileForm.formState.errors.bio && (
              <p className="text-sm text-red-600 mt-1">
                {profileForm.formState.errors.bio.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
          >
            <Save size={16} />
            {profileForm.formState.isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Change Password Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={18} />
          Change Password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              {...passwordForm.register('currentPassword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-sm text-red-600 mt-1">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              {...passwordForm.register('newPassword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              {...passwordForm.register('confirmPassword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
          >
            <Lock size={16} />
            {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change password'}
          </button>
        </form>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/ProfileSettingsPage.tsx
git commit -m "feat(frontend): implement Profile Settings page (update profile, change password, upload avatar)"
```

---

## Chunk 4: Final Integration & Verification

### Task 11: End-to-end verification

- [ ] **Step 1: Start backend**

```bash
cd D:/IT/Projects/CCNLTHD/backend
npm run start:dev
```

Verify backend running on http://localhost:3333/api-docs

- [ ] **Step 2: Start frontend**

```bash
cd D:/IT/Projects/CCNLTHD/frontend
npm run dev
```

Verify frontend running on http://localhost:5173

- [ ] **Step 3: Test Register flow**

1. Go to http://localhost:5173/register
2. Fill: fullname="Test User", email="test@example.com", password="Test@123!"
3. Submit → should redirect to `/dashboard` with user profile displayed
4. Verify toast shows "Account created! Welcome!"

- [ ] **Step 4: Test Logout flow**

1. Click Logout in navbar
2. Should redirect to `/login`
3. Visit `/dashboard` directly → should redirect to `/login`

- [ ] **Step 5: Test Login flow**

1. Go to `/login`
2. Fill: email="test@example.com", password="Test@123!"
3. Submit → should redirect to `/dashboard`

- [ ] **Step 6: Test Profile Update**

1. Go to `/profile`
2. Change display name, add bio
3. Click "Save changes" → toast success
4. Go to `/dashboard` → verify name updated

- [ ] **Step 7: Test Avatar Upload**

1. Go to `/profile`
2. Click "Change avatar" → select a JPG/PNG < 5MB
3. Should upload and display new avatar
4. Go to `/dashboard` → avatar visible

- [ ] **Step 8: Test Change Password**

1. Go to `/profile`
2. Fill current password, new password (meeting requirements), confirm
3. Submit → toast success

- [ ] **Step 9: Test Forgot Password**

1. Logout, go to `/forgot-password`
2. Enter email → submit
3. Check backend console logs for the reset token
4. Go to `/reset-password` → paste token + new password → submit
5. Login with new password

- [ ] **Step 10: Test validation errors**

1. Try registering with invalid email → see client-side error
2. Try registering with weak password → see regex error
3. Try logging in with wrong password → see backend error toast
4. Try uploading a 10MB file → see client-side error
5. Try uploading a .txt file → see client-side error

- [ ] **Step 11: Final commit**

```bash
cd D:/IT/Projects/CCNLTHD
git add frontend/
git commit -m "feat(frontend): complete frontend app for testing Auth & User backend APIs"
```

---

## API Coverage Matrix

| Endpoint | Page | How to test |
|----------|------|-------------|
| POST /auth/register | RegisterPage | Fill form, submit |
| POST /auth/login | LoginPage | Fill form, submit |
| POST /auth/refresh | _(automatic)_ | Wait 15min or trigger 401 |
| POST /auth/logout | Layout navbar | Click Logout button |
| POST /auth/forgot-password | ForgotPasswordPage | Fill email, submit |
| POST /auth/reset-password | ResetPasswordPage | Paste token + new password |
| GET /users/me | DashboardPage | Auto-fetches on load |
| PATCH /users/me | ProfileSettingsPage | Update name/bio, save |
| PATCH /users/me/change-password | ProfileSettingsPage | Fill passwords, submit |
| POST /users/me/avatar | ProfileSettingsPage | Click "Change avatar" |

**All 10 backend endpoints are covered by this frontend.**
