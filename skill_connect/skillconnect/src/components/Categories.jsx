import { t } from '../lang/translations'

const cats = [
  { icon: '🔧', label: 'Plumber' },
  { icon: '⚡', label: 'Electrician' },
  { icon: '🪵', label: 'Carpenter' },
  { icon: '🧵', label: 'Tailor' },
  { icon: '🏠', label: 'Painter' },
  { icon: '🍳', label: 'Cook' },
  { icon: '🚗', label: 'Mechanic' },
  { icon: '💇', label: 'Barber' },
  { icon: '🧹', label: 'Cleaner' },
  { icon: '🌿', label: 'Gardener' },
]

export default function Categories({ lang }) {
  const tx = t[lang]
  return (
    <section style={{ background: '#0e0e0e', padding: '4rem 2.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--orange)', fontWeight: 700 }}>
          {tx.browseSkill}
        </p>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-1px', marginTop: '0.5rem' }}>
          {tx.whatToday}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '2rem' }}>
          {cats.map(c => (
            <button key={c.label}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: '100px', padding: '0.6rem 1.2rem',
                fontSize: '0.9rem', color: 'var(--white)', cursor: 'pointer',
                fontFamily: 'DM Sans', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--orange)'; e.currentTarget.style.borderColor = 'var(--orange)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#2a2a2a' }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}