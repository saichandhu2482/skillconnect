import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { t } from '../lang/translations'

export default function Hero({ lang }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const tx = t[lang]

  return (
    <section style={{
      minHeight: '90vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,92,26,0.15) 0%, transparent 70%)',
        top: '-80px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none'
      }} />

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: '100px',
        padding: '0.35rem 1rem', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.8rem'
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
        {tx.workerCount}
      </div>

      <h1 style={{
        fontFamily: 'Syne', fontWeight: 800,
        fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
        lineHeight: 1.05, letterSpacing: '-2px', maxWidth: '800px'
      }}>
        {tx.heroTitle1}<br />
        <span style={{ color: 'var(--orange)' }}>{tx.heroTitle2}</span><br />
        <span style={{ background: 'var(--yellow)', color: 'var(--dark)', padding: '0 0.2em', borderRadius: '8px' }}>
          {tx.heroTitle3}
        </span>
      </h1>

      <p style={{
        marginTop: '1.4rem', fontSize: '1.05rem', color: 'var(--muted)',
        maxWidth: '500px', lineHeight: 1.7, fontWeight: 300
      }}>
        {tx.heroSub}
      </p>

      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          placeholder={tx.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '100px',
            padding: '0.85rem 1.5rem', color: 'var(--white)', fontFamily: 'DM Sans',
            fontSize: '0.95rem', outline: 'none', width: '300px'
          }}
        />
        <button onClick={() => navigate('/workers')} style={{
          background: 'var(--orange)', color: '#fff', border: 'none',
          padding: '0.85rem 2rem', borderRadius: '100px',
          fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
        }}>
          {tx.findNow}
        </button>
      </div>
    </section>
  )
}