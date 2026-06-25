import { apiRequest } from './httpClient'
import type {
  AuthTokenResponse,
  CurrentUser,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '../types/auth'

export function register(request: RegisterRequest) {
  return apiRequest<CurrentUser>('/auth/register', {
    method: 'POST',
    body: request,
  })
}

export function login(request: LoginRequest) {
  return apiRequest<AuthTokenResponse>('/auth/login', {
    method: 'POST',
    body: request,
  })
}

export function refreshToken(request: RefreshTokenRequest) {
  return apiRequest<AuthTokenResponse>('/auth/refresh', {
    method: 'POST',
    body: request,
  })
}

export function logout(request: LogoutRequest) {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
    body: request,
  })
}
