import { useState, useRef } from 'react'
import { t } from '../lang/translations'
import { db } from '../firebase/config'
import { collection, addDoc } from 'firebase/firestore'

const skillIcons = [
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

export default function WorkerSignup({ lang }) {
  const tx = t[lang]
  const fileRef = useRef(null)

  const [selectedSkill, setSelectedSkill] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [payment, setPayment] = useState([])
  const [upi, setUpi] = useState('')
  const [preview, setPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const togglePayment = (type) => {
    setPayment(prev =>
      prev.includes(type) ? prev.filter(p => p !== type) : [...prev, type]
    )
  }

  const handleSubmit = async () => {
    if (!name || !phone || !location || !selectedSkill) {
      setError('Please fill all fields and pick a skill')
      return
    }
    if (payment.length === 0) {
      setError('Please select at least one payment method')
      return
    }
    try {
      setLoading(true)
      setError('')
      await addDoc(collection(db, 'workers'), {
        name,
        phone,
        location,
        skill: selectedSkill,
        price: parseInt(price) || 0,
        payment,
        upi: upi || '',
        avatar: skillIcons.find(s => s.label === selectedSkill)?.icon || '👷',
        color: '#1e3a5f',
        tags: [selectedSkill],
        rating: 0,
        reviews: 0,
        createdAt: new Date()
      })
      setSubmitted(true)
    } catch (e) {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '2rem'
      }}>
        {preview && (
          <img src={preview} alt="work" style={{
            width: 100, height: 100, borderRadius: '50%',
            objectFit: 'cover', border: '3px solid var(--orange)', marginBottom: '1rem'
          }} />
        )}
        <div style={{ fontSize: '3rem' }}>🎉</div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', marginTop: '0.5rem' }}>
          You're listed, <span style={{ color: 'var(--orange)' }}>{name}!</span>
        </h2>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>
          Customers in your area can now find you.
        </p>
        <div style={{
          marginTop: '1rem', background: '#1a1a1a', border: '1px solid #333',
          borderRadius: '12px', padding: '0.6rem 1.2rem',
          color: 'var(--green)', fontWeight: 600, fontSize: '0.95rem'
        }}>
          {selectedSkill} · {location}
        </div>
      </div>
    )
  }

  return (
    <main style={{ maxWidth: '560px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1px' }}>
        {tx.signupTitle}
      </h1>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
        {tx.signupSub}
      </p>

      {error && (
        <div style={{ marginTop: '1rem', background: '#3a1a1a', border: '1px solid #ff4444', borderRadius: '12px', padding: '0.8rem 1rem', color: '#ff7777', fontSize: '0.9rem' }}>
          ⚠ {error}
        </div>
      )}

      {/* STEP 1 — Photo */}
      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--orange)', fontWeight: 700, marginBottom: '0.8rem' }}>
          📸 Step 1 — Upload a photo of your work
        </p>
        <div onClick={() => fileRef.current.click()} style={{
          border: `2px dashed ${preview ? 'var(--green)' : '#333'}`,
          borderRadius: '16px', padding: '2rem', textAlign: 'center',
          cursor: 'pointer', background: '#1a1a1a', transition: 'border-color 0.2s'
        }}>
          {preview ? (
            <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }} />
          ) : (
            <>
              <div style={{ fontSize: '3rem' }}>📷</div>
              <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>Tap to upload or take photo</p>
              <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.3rem' }}>Show your best work</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} />
        {preview && (
          <button onClick={() => setPreview(null)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
            ✕ Remove photo
          </button>
        )}
      </div>

      {/* STEP 2 — Skill */}
      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--orange)', fontWeight: 700, marginBottom: '0.8rem' }}>
          🛠 Step 2 — Tap your skill
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
          {skillIcons.map(s => (
            <button key={s.label} onClick={() => setSelectedSkill(s.label)} style={{
              background: selectedSkill === s.label ? 'var(--orange)' : '#1a1a1a',
              border: `1px solid ${selectedSkill === s.label ? 'var(--orange)' : '#2a2a2a'}`,
              borderRadius: '100px', padding: '0.6rem 1.1rem',
              fontSize: '1rem', color: 'var(--white)', cursor: 'pointer',
              transition: 'all 0.2s', fontFamily: 'DM Sans'
            }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 3 — Payment */}
      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--orange)', fontWeight: 700, marginBottom: '0.8rem' }}>
          💰 Step 3 — Payment methods
        </p>
        <div style={{ display: 'flex', gap: '0.7rem' }}>
          {['cash', 'upi'].map(type => (
            <button key={type} onClick={() => togglePayment(type)} style={{
              background: payment.includes(type) ? (type === 'cash' ? 'var(--green)' : '#3a5fbf') : '#1a1a1a',
              border: `1px solid ${payment.includes(type) ? (type === 'cash' ? 'var(--green)' : '#7b9cff') : '#2a2a2a'}`,
              borderRadius: '100px', padding: '0.6rem 1.4rem',
              fontSize: '0.95rem', color: 'var(--white)', cursor: 'pointer',
              transition: 'all 0.2s', fontFamily: 'DM Sans', fontWeight: 600
            }}>
              {type === 'cash' ? '💵 Cash' : '📱 UPI'}
            </button>
          ))}
        </div>
        {payment.includes('upi') && (
          <input
            placeholder="Your UPI ID (e.g. name@upi)"
            value={upi}
            onChange={e => setUpi(e.target.value)}
            style={{ ...inputStyle, marginTop: '0.8rem', width: '100%' }}
          />
        )}
      </div>

      {/* STEP 4 — Details */}
      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--orange)', fontWeight: 700, marginBottom: '0.8rem' }}>
          📝 Step 4 — Your details
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder={tx.yourName} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input type="tel" placeholder={tx.yourPhone} value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
          <input type="text" placeholder={tx.yourLocation} value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Your hourly rate (₹)" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{
        marginTop: '2rem', width: '100%',
        background: 'var(--orange)', color: '#fff', border: 'none',
        padding: '1rem', borderRadius: '14px', fontFamily: 'Syne',
        fontWeight: 800, fontSize: '1.1rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
      }}>
        {loading ? 'Saving...' : tx.submit}
      </button>
    </main>
  )
}

const inputStyle = {
  background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '12px',
  padding: '0.9rem 1.2rem', color: '#F9F6F1', fontFamily: 'DM Sans',
  fontSize: '1rem', outline: 'none'
}