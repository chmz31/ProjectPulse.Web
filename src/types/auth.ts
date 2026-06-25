export type RegisterRequest = {
  email: string
  password: string
  displayName: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type CurrentUser = {
  id: string
  email: string
  displayName: string
  role: string
}

export type AuthTokenResponse = {
  accessToken: string
  refreshToken: string
}

export type RefreshTokenRequest = {
  refreshToken: string
}

export type LogoutRequest = RefreshTokenRequest
