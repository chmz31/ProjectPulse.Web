import type { AuthTokenResponse } from '../types/auth'

const sessionStorageKey = 'projectpulse.session'

export type AuthSession = AuthTokenResponse

export function getStoredSession(): AuthSession | null {
  const storedValue = localStorage.getItem(sessionStorageKey)

  if (!storedValue) {
    return null
  }

  try {
    const session = JSON.parse(storedValue) as Partial<AuthSession>

    if (session.accessToken && session.refreshToken) {
      return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      }
    }
  } catch {
    clearSession()
  }

  return null
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(sessionStorageKey, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(sessionStorageKey)
}
