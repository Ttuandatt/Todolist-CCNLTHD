import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

// Lazy import to avoid circular dependency (auth.store ↔ axios)
const getApi = () => import('../lib/axios').then((m) => m.default)

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const api = await getApi()
        const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
          email,
          password,
        })
        const { user, tokens } = res.data.data
        set({
          user: user as User | null,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        })
      },

      register: async (email, password, fullname) => {
        const api = await getApi()
        const res = await api.post<ApiResponse<RegisterResponse>>('/auth/register', {
          email,
          password,
          fullname,
        })
        const { user, tokens } = res.data.data
        set({
          user: user as User | null,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        })
      },

      logout: async () => {
        try {
          const api = await getApi()
          await api.post('/auth/logout')
        } catch {
          // Logout even if API call fails
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      fetchUser: async () => {
        const api = await getApi()
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
