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
  displayName: string | null
  bio: string | null
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

// Auth endpoint responses (matches backend auth.service return format)
export interface AuthTokensResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginResponse {
  user: Partial<User>
  tokens: AuthTokensResponse
}

export interface RegisterResponse {
  user: Partial<User>
  tokens: AuthTokensResponse
}
