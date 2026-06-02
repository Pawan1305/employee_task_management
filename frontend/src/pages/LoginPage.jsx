import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, registerApi } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const { setSession, isAuthenticated, auth } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [role, setRole] = useState('employee')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(auth.user.role === 'admin' ? '/admin' : '/employee')
    }
  }, [isAuthenticated, auth, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await registerApi({ name, email, password, role })
        setMessage('Registration successful. Please login with your new account.')
        setMode('login')
        setPassword('')
      } else {
        const data = await loginApi({ email, password })
        setSession(data)
        navigate(data.user.role === 'admin' ? '/admin' : '/employee')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-layout">
      <div className="bg-glow" aria-hidden="true" />
      <section className="panel auth-panel">
        <h1>Employee Task Tracker</h1>
        <p className="subtitle">
          {mode === 'login'
            ? 'Sign in to manage and update tasks.'
            : 'Create an account to start using the tracker.'}
        </p>

        <div className="auth-switch">
          <button
            type="button"
            className={mode === 'login' ? '' : 'ghost'}
            onClick={() => {
              setMode('login')
              setError('')
              setMessage('')
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? '' : 'ghost'}
            onClick={() => {
              setMode('register')
              setError('')
              setMessage('')
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {mode === 'register' ? (
            <>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  required
                />
              </label>

              <label>
                <span>Role</span>
                <select value={role} onChange={(event) => setRole(event.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </>
          ) : null}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          {message ? <p className="message success">{message}</p> : null}
          {error ? <p className="message error">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading
              ? mode === 'login'
                ? 'Signing in...'
                : 'Creating account...'
              : mode === 'login'
                ? 'Login'
                : 'Register'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage