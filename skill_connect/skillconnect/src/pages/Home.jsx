import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import WorkerCard from '../components/WorkerCard'
import { t } from '../lang/translations'
import { db } from '../firebase/config'
import { collection, getDocs, limit, query } from 'firebase/firestore'

export default function Home({ lang }) {
  const tx = t[lang]
  const [workers, setWorkers] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'workers'), limit(3))
        const snap = await getDocs(q)
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setWorkers(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetch()
  }, [])

  return (
    <main>
      <Hero lang={lang} />
      <Categories lang={lang} />
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2.5rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--orange)', fontWeight: 700 }}>
          {tx.topRated}
        </p>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-1px', marginTop: '0.5rem' }}>
          {tx.workersNear}
        </h2>
        {workers.length === 0 ? (
          <p style={{ color: 'var(--muted)', marginTop: '2rem' }}>No workers yet. Be the first to join! 🚀</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem', marginTop: '2rem' }}>
            {workers.map(w => <WorkerCard key={w.id} worker={w} lang={lang} />)}
          </div>
        )}
      </section>
    </main>
  )
}