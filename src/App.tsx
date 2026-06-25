import './App.css'

const features = [
  {
    title: 'Authentication',
    description: 'A future sign-in flow for protecting each user account.',
  },
  {
    title: 'Project dashboard',
    description: 'A focused workspace for tracking user-owned projects.',
  },
  {
    title: 'API integration',
    description: 'Planned connection points for the secure ProjectPulse API.',
  },
]

function App() {
  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="page-title">
        <p className="eyebrow">ProjectPulse frontend</p>
        <h1 id="page-title">ProjectPulse Web</h1>
        <p className="subtitle">
          A React + TypeScript frontend for the ProjectPulse API.
        </p>
        <p className="intro">
          This app will manage user-owned projects through a secure backend API,
          giving each user a clear place to create, review, and organize their
          work.
        </p>

        <div className="cta-panel" aria-label="Account actions">
          <button type="button">Login</button>
          <button type="button" className="secondary-button">
            Register
          </button>
        </div>
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

export default App
