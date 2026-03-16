import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { t } from '../lang/translations'
import { db } from '../firebase/config'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { useSession } from '../context/Session'

export default function WorkerDetail({ lang }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const tx = t[lang]
  const { user } = useSession()

  const [worker, setWorker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [newName, setNewName] = useState('')
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Booking state
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [bookingNote, setBookingNote] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingDone, setBookingDone] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const snap = await getDocs(collection(db, 'workers'))
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const found = all.find(w => w.id === id)
        setWorker(found)
      } catch (e) { console.error(e) }
    }

    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), where('workerId', '==', id))
        const snap = await getDocs(q)
        setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (e) { console.error(e) }
    }

    fetchWorker()
    fetchReviews()
  }, [id])

  const handleReview = async () => {
    if (!newName || !newComment) return
    try {
      await addDoc(collection(db, 'reviews'), {
        workerId: id,
        name: newName,
        rating: newRating,
        comment: newComment,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      })
      setReviews(prev => [...prev, { name: newName, rating: newRating, comment: newComment, date: 'Just now' }])
      setNewName('')
      setNewComment('')
      setNewRating(5)
      setReviewSubmitted(true)
      setTimeout(() => setReviewSubmitted(false), 3000)
    } catch (e) { console.error(e) }
  }

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime) {
      setBookingError('Please pick a date and time')
      return
    }
    if (!user) {
      setBookingError('Please login to book')
      return
    }
    try {
      setBookingLoading(true)
      setBookingError('')

      // Save booking to Firebase
      await addDoc(collection(db, 'bookings'), {
        workerId: id,
        workerName: worker.name,
        workerPhone: worker.phone,
        workerSkill: worker.skill,
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerEmail: user.email,
        date: bookingDate,
        time: bookingTime,
        note: bookingNote,
        status: 'pending',
        createdAt: new Date()
      })

      // Send WhatsApp to worker
      const msg = `Hi ${worker.name}! 👋 You have a new booking request!%0A%0A📅 Date: ${bookingDate}%0A⏰ Time: ${bookingTime}%0A👤 Customer: ${user.displayName || user.email}%0A📝 Note: ${bookingNote || 'No note'}%0A%0APlease confirm via SkillConnect!`
      window.open(`https://wa.me/91${worker.phone}?text=${msg}`, '_blank')

      setBookingDone(true)
    } catch (e) {
      setBookingError('Something went wrong. Try again.')
    }
    setBookingLoading(false)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : worker?.rating || '0.0'

  if (!worker) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
      Loading worker...
    </div>
  )

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Back */}
      <button onClick={() => navigate('/workers')} style={{
        background: 'none', border: '1px solid #333', borderRadius: '100px',
        color: 'var(--muted)', padding: '0.4rem 1rem', cursor: 'pointer',
        fontSize: '0.85rem', marginBottom: '2rem', fontFamily: 'DM Sans'
      }}>
        ← Back
      </button>

      {/* Profile card */}
      <div style={{
        background: 'var(--card)', border: '1px solid #222',
        borderRadius: '24px', padding: '2rem',
        display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start'
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%', background: worker.color || '#1e3a5f',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', flexShrink: 0, border: '3px solid var(--orange)'
        }}>
          {worker.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', letterSpacing: '-1px' }}>
            {worker.name}
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.3rem' }}>
            {worker.skill} · 📍 {worker.location}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: '1.1rem' }}>★ {avgRating}</span>
            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>({reviews.length} reviews)</span>
            {worker.price > 0 && <span style={{ color: 'var(--green)', fontFamily: 'Syne', fontWeight: 700 }}>₹{worker.price}{tx.perHr}</span>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {worker.tags?.map(tag => (
              <span key={tag} style={{ background: '#222', borderRadius: '6px', padding: '0.3rem 0.7rem', fontSize: '0.8rem', color: '#aaa' }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{tx.paymentLabel}:</span>
            {worker.payment?.includes('cash') && (
              <span style={{ background: '#1a3a1a', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 600 }}>💵 {tx.cash}</span>
            )}
            {worker.payment?.includes('upi') && (
              <span style={{ background: '#1a1a3a', color: '#7b9cff', border: '1px solid #7b9cff', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 600 }}>📱 {tx.upi}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick contact */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => window.open(`https://wa.me/91${worker.phone}`, '_blank')} style={{
          flex: 1, background: '#25D366', color: '#fff', border: 'none',
          padding: '1rem', borderRadius: '14px', fontFamily: 'Syne',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
        }}>💬 WhatsApp</button>
        <button onClick={() => window.open(`tel:${worker.phone}`, '_blank')} style={{
          flex: 1, background: '#1a1a1a', color: '#fff', border: '1px solid #333',
          padding: '1rem', borderRadius: '14px', fontFamily: 'Syne',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
        }}>📞 Call Now</button>
      </div>

      {/* ---- BOOKING FORM ---- */}
      <div style={{
        marginTop: '2.5rem', background: 'var(--card)', border: '1px solid #222',
        borderRadius: '20px', padding: '1.5rem'
      }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', marginBottom: '1.2rem' }}>
          📅 Book <span style={{ color: 'var(--orange)' }}>{worker.name}</span>
        </h2>

        {bookingDone ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginTop: '0.5rem' }}>Booking Sent!</h3>
            <p style={{ color: 'var(--muted)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
              WhatsApp opened to notify {worker.name}. They'll confirm shortly!
            </p>
            <button onClick={() => setBookingDone(false)} style={{
              marginTop: '1rem', background: 'none', border: '1px solid #333',
              borderRadius: '100px', color: 'var(--muted)', padding: '0.4rem 1rem',
              cursor: 'pointer', fontSize: '0.85rem'
            }}>Book again</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookingError && (
              <div style={{ background: '#3a1a1a', border: '1px solid #ff4444', borderRadius: '12px', padding: '0.8rem 1rem', color: '#ff7777', fontSize: '0.9rem' }}>
                ⚠ {bookingError}
              </div>
            )}
            {!user && (
              <div style={{ background: '#1a2a3a', border: '1px solid #3a6abf', borderRadius: '12px', padding: '0.8rem 1rem', color: '#7b9cff', fontSize: '0.9rem' }}>
                ℹ Please <a href="/login" style={{ color: 'var(--orange)', fontWeight: 600 }}>login</a> to book this worker
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>📅 Date</label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ ...inputStyle, width: '100%', colorScheme: 'dark' }} />
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>⏰ Time</label>
                <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)}
                  style={{ ...inputStyle, width: '100%', colorScheme: 'dark' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>📝 Note (optional)</label>
              <textarea
                placeholder="Describe what you need help with..."
                value={bookingNote}
                onChange={e => setBookingNote(e.target.value)}
                rows={3}
                style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
              />
            </div>
            <button onClick={handleBooking} disabled={bookingLoading || !user} style={{
              background: user ? 'var(--orange)' : '#2a2a2a',
              color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px',
              fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
              cursor: user ? 'pointer' : 'not-allowed', opacity: bookingLoading ? 0.7 : 1
            }}>
              {bookingLoading ? 'Sending...' : `📲 Book & Notify via WhatsApp`}
            </button>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Reviews <span style={{ color: 'var(--orange)' }}>({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid #222', borderRadius: '16px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700 }}>{r.name}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{r.date}</span>
                </div>
                <div style={{ color: 'var(--yellow)', margin: '0.4rem 0', fontSize: '0.9rem' }}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add review */}
        <div style={{ marginTop: '2rem', background: 'var(--card)', border: '1px solid #222', borderRadius: '20px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '1rem' }}>Leave a Review</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {[1,2,3,4,5].map(star => (
              <button key={star} onClick={() => setNewRating(star)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.8rem', color: star <= newRating ? 'var(--yellow)' : '#333',
                transition: 'color 0.15s'
              }}>★</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input placeholder="Your name" value={newName} onChange={e => setNewName(e.target.value)}
              style={{ ...inputStyle }} />
            <textarea placeholder="Share your experience..." value={newComment} onChange={e => setNewComment(e.target.value)}
              rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            <button onClick={handleReview} style={{
              background: reviewSubmitted ? 'var(--green)' : 'var(--orange)',
              color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '12px',
              fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.3s'
            }}>
              {reviewSubmitted ? '✓ Review Added!' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

const inputStyle = {
  background: '#111', border: '1px solid #2e2e2e', borderRadius: '12px',
  padding: '0.8rem 1.1rem', color: '#F9F6F1', fontFamily: 'DM Sans',
  fontSize: '0.95rem', outline: 'none'
}