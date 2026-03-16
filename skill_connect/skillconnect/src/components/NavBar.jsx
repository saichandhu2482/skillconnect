import { Link, useNavigate } from 'react-router-dom'
import { t } from '../lang/translations'
import { useSession } from '../context/Session'

export default function Navbar({ lang, setLang }) {
  const tx = t[lang]
  const { user, logout } = useSession()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.2rem 2.5rem', position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(17,17,17,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #222', flexWrap: 'wrap', gap: '1rem'
    }}>
      <Link to="/" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
        Skill<span style={{ color: 'var(--orange)' }}>Connect</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{tx.home}</Link>
        <Link to="/workers" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{tx.findWorkers}</Link>
        <Link to="/join" style={{ color: 'var(--green)', fontSize: '0.9rem', fontWeight: 600 }}>{tx.joinAsWorker}</Link>
        {user && (
          <Link to="/bookings" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>📋 My Bookings</Link>
        )}

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['en', 'hi', 'te'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? 'var(--orange)' : '#1a1a1a',
              border: '1px solid #333', borderRadius: '6px',
              padding: '0.25rem 0.6rem', color: '#fff',
              fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
              textTransform: 'uppercase'
            }}>{l}</button>
          ))}
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              👋 {user.displayName || user.email}
            </span>
            <button onClick={handleLogout} style={{
              background: 'transparent', color: 'var(--muted)', border: '1px solid #333',
              padding: '0.45rem 1rem', borderRadius: '100px',
              fontFamily: 'DM Sans', fontSize: '0.85rem', cursor: 'pointer'
            }}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" style={{
              background: 'transparent', color: 'var(--white)', border: '1px solid #333',
              padding: '0.5rem 1.1rem', borderRadius: '100px',
              fontFamily: 'DM Sans', fontSize: '0.85rem'
            }}>Login</Link>
            <Link to="/signup" style={{
              background: 'var(--orange)', color: '#fff', border: 'none',
              padding: '0.5rem 1.1rem', borderRadius: '100px',
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem'
            }}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}