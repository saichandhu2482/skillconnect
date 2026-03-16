import { useState, useEffect } from 'react'
import WorkerCard from '../components/WorkerCard'
import { t } from '../lang/translations'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

const skillKeys = ['All', 'Plumber', 'Tailor', 'Electrician', 'Cook', 'Carpenter', 'Mechanic', 'Painter', 'Barber', 'Cleaner', 'Gardener']

export default function Workers({ lang }) {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const tx = t[lang]

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, 'workers'))
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setWorkers(data)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = workers.filter(w => {
    const matchSkill = active === 'All' || w.skill === active
    const matchSearch = w.name?.toLowerCase().includes(search.toLowerCase()) ||
                        w.skill?.toLowerCase().includes(search.toLowerCase()) ||
                        w.location?.toLowerCase().includes(search.toLowerCase())
    return matchSkill && matchSearch
  })

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2.5rem' }}>
      <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-1px' }}>
        <span style={{ color: 'var(--orange)' }}>{tx.findWorkers}</span>
      </h1>

      <input
        placeholder={tx.searchPlaceholder}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          marginTop: '1.5rem', width: '100%', maxWidth: '500px',
          background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '100px',
          padding: '0.85rem 1.5rem', color: 'var(--white)', fontFamily: 'DM Sans',
          fontSize: '0.95rem', outline: 'none', display: 'block'
        }}
      />

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        {skillKeys.map(s => (
          <button key={s} onClick={() => setActive(s)} style={{
            background: active === s ? 'var(--orange)' : '#1a1a1a',
            border: `1px solid ${active === s ? 'var(--orange)' : '#2a2a2a'}`,
            borderRadius: '100px', padding: '0.5rem 1.1rem',
            fontSize: '0.85rem', color: 'var(--white)', cursor: 'pointer',
            fontFamily: 'DM Sans', transition: 'all 0.2s'
          }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)', marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          Loading workers...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ color: 'var(--muted)', marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          No workers found. Try a different search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem', marginTop: '2rem' }}>
          {filtered.map(w => <WorkerCard key={w.id} worker={w} lang={lang} />)}
        </div>
      )}
    </main>
  )
}