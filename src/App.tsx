import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { login, logout, register } from './api/authApi'
import { ApiError } from './api/httpClient'
import {
  clearSession,
  getStoredSession,
  saveSession,
  type AuthSession,
} from './api/session'
import './App.css'

type AuthMode = 'login' | 'register'

const features = [
  {
    title: 'Authentication',
    description: 'Sign in to protect each user account.',
  },
  {
    title: 'Project dashboard',
    description: 'A focused workspace for tracking user-owned projects.',
  },
  {
    title: 'API integration',
    description: 'Connection points for the secure ProjectPulse API.',
  },
]

function App() {
  const [session, setSession] = useState<AuthSession | null>(() =>
    getStoredSession(),
  )
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isRegisterMode = mode === 'register'
  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return isRegisterMode ? 'Creating account...' : 'Signing in...'
    }

    return isRegisterMode ? 'Register' : 'Login'
  }, [isRegisterMode, isSubmitting])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (isRegisterMode) {
        await register({ email, password, displayName })
      }

      const tokens = await login({ email, password })
      saveSession(tokens)
      setSession(tokens)
      setPassword('')
    } catch (error) {
      setErrorMessage(getReadableError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    const refreshToken = session?.refreshToken

    clearSession()
    setSession(null)
    setErrorMessage('')

    if (refreshToken) {
      try {
        await logout({ refreshToken })
      } catch {
        // Local logout should still succeed if token revocation fails.
      }
    }
  }

  if (session) {
    return (
      <main className="app-shell">
        <section className="dashboard-panel" aria-labelledby="dashboard-title">
          <p className="eyebrow">Signed in</p>
          <h1 id="dashboard-title">ProjectPulse Web</h1>
          <p className="subtitle">
            Your authenticated dashboard is ready for the next ProjectPulse
            features.
          </p>
          <p className="intro">
            Project CRUD screens are not wired yet. For now, this confirms that
            the frontend can keep a local session and protect the app shell.
          </p>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="landing-layout" aria-labelledby="page-title">
        <div className="hero-section">
          <p className="eyebrow">ProjectPulse frontend</p>
          <h1 id="page-title">ProjectPulse Web</h1>
          <p className="subtitle">
            A React + TypeScript frontend for the ProjectPulse API.
          </p>
          <p className="intro">
            This app will manage user-owned projects through a secure backend
            API, giving each user a clear place to create, review, and organize
            their work.
          </p>

          <div className="cta-panel" aria-label="Choose authentication mode">
            <button
              type="button"
              className={mode === 'login' ? undefined : 'secondary-button'}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? undefined : 'secondary-button'}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isRegisterMode ? 'Register' : 'Login'}</p>
            <h2>{isRegisterMode ? 'Create an account' : 'Welcome back'}</h2>
          </div>

          {isRegisterMode && (
            <label>
              Display name
              <input
                autoComplete="name"
                disabled={isSubmitting}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                type="text"
                value={displayName}
              />
            </label>
          )}

          <label>
            Email
            <input
              autoComplete="email"
              disabled={isSubmitting}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              disabled={isSubmitting}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </button>
        </form>
      </section>

      <section className="feature-grid" aria-label="Planned features">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

function getReadableError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return 'Invalid email or password.'
    }

    return `${error.message} (${error.status})`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

export default App
