import { useState } from 'react'
import { useSession } from '../context/Session'
import { useNavigate, Link } from 'react-router-dom'
import { db, auth } from '../firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { t } from '../lang/translations'

export default function Signup({ lang = 'en' }) {
  const { signup } = useSession()
  const navigate = useNavigate()
  const tx = t[lang]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) return setError(tx.fillFields)
    if (password.length < 6) return setError(tx.passwordLength)
    try {
      setError('')
      setLoading(true)
      await signup(email, password, name)
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        name, email, role, createdAt: new Date()
      })
      navigate('/')
    } catch (e) {
      setError(e.message || tx.fillFields)
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '420px', margin: '0 auto', padding: '5rem 2rem' }}>
      <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-1px' }}>
        <span style={{ color: 'var(--orange)' }}>{tx.signupTitle2}</span>
      </h1>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>{tx.signupSub2}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem' }}>
        {error && (
          <div style={{ background: '#3a1a1a', border: '1px solid #ff4444', borderRadius: '12px', padding: '0.8rem 1rem', color: '#ff7777', fontSize: '0.9rem' }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', background: '#1a1a1a', borderRadius: '12px', padding: '0.4rem' }}>
          {['customer', 'worker'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none',
              background: role === r ? 'var(--orange)' : 'transparent',
              color: '#fff', fontFamily: 'Syne', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s'
            }}>
              {r === 'customer' ? tx.customerRole : tx.workerRole}
            </button>
          ))}
        </div>

        <input placeholder={tx.fullName} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input type="email" placeholder={tx.emailLabel} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder={tx.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />

        <button onClick={handleSignup} disabled={loading} style={{
          background: 'var(--orange)', color: '#fff', border: 'none',
          padding: '1rem', borderRadius: '12px', fontFamily: 'Syne',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1
        }}>
          {loading ? tx.creatingAccount : tx.signupBtn}
        </button>

        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem' }}>
          {tx.haveAccount}{' '}
          <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600 }}>{tx.loginHere}</Link>
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