import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { login, logout, register } from './api/authApi'
import { ApiError } from './api/httpClient'
import { createProject, getProjects } from './api/projectsApi'
import {
  clearSession,
  getStoredSession,
  saveSession,
  type AuthSession,
} from './api/session'
import type { ProjectDto } from './types/project'
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
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [projectsError, setProjectsError] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [createProjectError, setCreateProjectError] = useState('')
  const [isCreatingProject, setIsCreatingProject] = useState(false)

  const isRegisterMode = mode === 'register'
  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return isRegisterMode ? 'Creating account...' : 'Signing in...'
    }

    return isRegisterMode ? 'Register' : 'Login'
  }, [isRegisterMode, isSubmitting])

  useEffect(() => {
    if (!session) {
      return
    }

    let isCurrent = true
    const accessToken = session.accessToken

    async function loadProjects() {
      setIsLoadingProjects(true)
      setProjectsError('')

      try {
        const projectList = await getProjects(accessToken)

        if (isCurrent) {
          setProjects(projectList)
        }
      } catch (error) {
        if (isCurrent) {
          setProjectsError(
            getReadableError(error, 'Your session could not load projects.'),
          )
        }
      } finally {
        if (isCurrent) {
          setIsLoadingProjects(false)
        }
      }
    }

    loadProjects()

    return () => {
      isCurrent = false
    }
  }, [session])

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
      setProjects([])
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
    setProjects([])
    setProjectsError('')
    setProjectName('')
    setProjectDescription('')
    setCreateProjectError('')

    if (refreshToken) {
      try {
        await logout({ refreshToken })
      } catch {
        // Local logout should still succeed if token revocation fails.
      }
    }
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session) {
      return
    }

    const trimmedName = projectName.trim()
    const trimmedDescription = projectDescription.trim()

    setCreateProjectError('')
    setIsCreatingProject(true)

    try {
      await createProject(session.accessToken, {
        name: trimmedName,
        description: trimmedDescription.length > 0 ? trimmedDescription : null,
      })

      setProjectName('')
      setProjectDescription('')
      setProjects(await getProjects(session.accessToken))
    } catch (error) {
      setCreateProjectError(
        getReadableError(error, 'Your session could not create projects.'),
      )
    } finally {
      setIsCreatingProject(false)
    }
  }

  if (session) {
    return (
      <main className="app-shell">
        <section className="dashboard-header" aria-labelledby="dashboard-title">
          <div>
            <p className="eyebrow">Projects</p>
            <h1 id="dashboard-title">ProjectPulse Web</h1>
            <p className="subtitle">
              Manage your user-owned projects through the ProjectPulse API.
            </p>
          </div>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </section>

        <section className="dashboard-layout" aria-label="Projects dashboard">
          <form className="project-form" onSubmit={handleCreateProject}>
            <div>
              <p className="eyebrow">New project</p>
              <h2>Create a project</h2>
            </div>

            <label>
              Name
              <input
                disabled={isCreatingProject}
                onChange={(event) => setProjectName(event.target.value)}
                required
                type="text"
                value={projectName}
              />
            </label>

            <label>
              Description
              <textarea
                disabled={isCreatingProject}
                onChange={(event) => setProjectDescription(event.target.value)}
                rows={4}
                value={projectDescription}
              />
            </label>

            {createProjectError && (
              <p className="error-message">{createProjectError}</p>
            )}

            <button type="submit" disabled={isCreatingProject}>
              {isCreatingProject ? 'Creating...' : 'Create project'}
            </button>
          </form>

          <div className="projects-panel">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h2>Your projects</h2>
            </div>

            {isLoadingProjects && (
              <p className="status-message">Loading projects...</p>
            )}

            {projectsError && <p className="error-message">{projectsError}</p>}

            {!isLoadingProjects && !projectsError && projects.length === 0 && (
              <div className="empty-state">
                <h3>No projects yet</h3>
                <p>Create your first project to see it appear here.</p>
              </div>
            )}

            {!isLoadingProjects && !projectsError && projects.length > 0 && (
              <div className="projects-list">
                {projects.map((project) => (
                  <article className="project-card" key={project.id}>
                    <h3>{project.name}</h3>
                    <p>{project.description || 'No description provided.'}</p>
                    <time dateTime={project.createdAt}>
                      Created {formatProjectDate(project.createdAt)}
                    </time>
                  </article>
                ))}
              </div>
            )}
          </div>
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

function getReadableError(
  error: unknown,
  unauthorizedMessage = 'Invalid email or password.',
) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return unauthorizedMessage
    }

    return `${error.message} (${error.status})`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

function formatProjectDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default App
