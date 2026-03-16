import { useState } from 'react'
import { useSession } from '../context/Session'
import { useNavigate, Link } from 'react-router-dom'
import { t } from '../lang/translations'

export default function Login({ lang = 'en' }) {
  const { login } = useSession()
  const navigate = useNavigate()
  const tx = t[lang]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return setError(tx.fillFields)
    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/')
    } catch (e) {
      setError(tx.wrongPassword)
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '420px', margin: '0 auto', padding: '5rem 2rem' }}>
      <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-1px' }}>
        <span style={{ color: 'var(--orange)' }}>{tx.loginTitle}</span>
      </h1>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>{tx.loginSub}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem' }}>
        {error && (
          <div style={{ background: '#3a1a1a', border: '1px solid #ff4444', borderRadius: '12px', padding: '0.8rem 1rem', color: '#ff7777', fontSize: '0.9rem' }}>
            ⚠ {error}
          </div>
        )}
        <input type="email" placeholder={tx.emailLabel} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder={tx.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button onClick={handleLogin} disabled={loading} style={{
          background: 'var(--orange)', color: '#fff', border: 'none',
          padding: '1rem', borderRadius: '12px', fontFamily: 'Syne',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1
        }}>
          {loading ? tx.loggingIn : tx.loginBtn}
        </button>
        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem' }}>
          {tx.noAccount}{' '}
          <Link to="/signup" style={{ color: 'var(--orange)', fontWeight: 600 }}>{tx.signupHere}</Link>
        </p>
      </div>
    </main>
  )
}

const inputStyle = {
  background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '12px',
  padding: '0.9rem 1.2rem', color: '#F9F6F1', fontFamily: 'DM Sans',
  fontSize: '1rem', outline: 'none'
}