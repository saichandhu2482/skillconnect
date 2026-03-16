import { t } from '../lang/translations'
import { useNavigate } from 'react-router-dom'

export default function WorkerCard({ worker, lang = 'en' }) {
  const tx = t[lang]
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/workers/${worker.id}`)}
      style={{
        background: 'var(--card)', border: '1px solid #222', borderRadius: '20px',
        padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer'
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: worker.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', flexShrink: 0
        }}>
          {worker.avatar}
        </div>
        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>{worker.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
            {worker.skill} · {worker.location}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {worker.tags.map(tag => (
          <span key={tag} style={{
            background: '#222', borderRadius: '6px', padding: '0.2rem 0.6rem',
            fontSize: '0.75rem', color: '#aaa'
          }}>{tag}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{tx.paymentLabel}:</span>
        {worker.payment.includes('cash') && (
          <span style={{ background: '#1a3a1a', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
            💵 {tx.cash}
          </span>
        )}
        {worker.payment.includes('upi') && (
          <span style={{ background: '#1a1a3a', color: '#7b9cff', border: '1px solid #7b9cff', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
            📱 {tx.upi}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: 'var(--yellow)', fontSize: '0.85rem', fontWeight: 600 }}>★ {worker.rating}</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>({worker.reviews})</span>
        </div>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--green)', fontSize: '0.95rem' }}>
          ₹{worker.price}{tx.perHr}
        </span>
      </div>

      <button
        onClick={e => { e.stopPropagation(); window.open(`https://wa.me/91${worker.phone}`, '_blank') }}
        style={{
          background: '#25D366', color: '#fff', border: 'none',
          padding: '0.6rem', borderRadius: '12px', fontFamily: 'Syne',
          fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', width: '100%'
        }}>
        {tx.contact}
      </button>
    </div>
  )
}