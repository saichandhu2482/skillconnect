import { useEffect, useState } from 'react'
import { useSession } from '../context/Session'
import { db } from '../firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function MyBookings() {
  const { user } = useSession()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetch = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('customerId', '==', user.uid))
        const snap = await getDocs(q)
        setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetch()
  }, [user])

  const statusColor = (s) => s === 'pending' ? 'var(--yellow)' : s === 'confirmed' ? 'var(--green)' : '#ff7777'

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: '-1px' }}>
        My <span style={{ color: 'var(--orange)' }}>Bookings</span>
      </h1>

      {loading ? (
        <p style={{ color: 'var(--muted)', marginTop: '2rem' }}>⏳ Loading...</p>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <div style={{ fontSize: '3rem' }}>📋</div>
          <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>No bookings yet.</p>
          <button onClick={() => navigate('/workers')} style={{
            marginTop: '1rem', background: 'var(--orange)', color: '#fff',
            border: 'none', padding: '0.7rem 1.5rem', borderRadius: '100px',
            fontFamily: 'Syne', fontWeight: 700, cursor: 'pointer'
          }}>Find Workers →</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {bookings.map(b => (
            <div key={b.id} style={{
              background: 'var(--card)', border: '1px solid #222',
              borderRadius: '20px', padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>{b.workerName}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{b.workerSkill}</p>
                </div>
                <span style={{
                  background: '#1a1a1a', border: `1px solid ${statusColor(b.status)}`,
                  color: statusColor(b.status), borderRadius: '100px',
                  padding: '0.25rem 0.8rem', fontSize: '0.8rem', fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {b.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.9rem', color: '#ccc' }}>📅 {b.date}</span>
                <span style={{ fontSize: '0.9rem', color: '#ccc' }}>⏰ {b.time}</span>
              </div>

              {b.note && (
                <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--muted)', background: '#111', borderRadius: '8px', padding: '0.5rem 0.8rem' }}>
                  📝 {b.note}
                </p>
              )}

              <button
                onClick={() => window.open(`https://wa.me/91${b.workerPhone}`, '_blank')}
                style={{
                  marginTop: '1rem', background: '#25D366', color: '#fff',
                  border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}>
                💬 Contact Worker
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}