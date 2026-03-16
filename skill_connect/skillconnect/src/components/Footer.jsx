export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #222', padding: '2rem 2.5rem',
      textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem'
    }}>
      <span style={{ fontFamily: 'Syne', fontWeight: 800, color: 'var(--white)' }}>
        Skill<span style={{ color: 'var(--orange)' }}>Connect</span>
      </span>
      <span style={{ marginLeft: '1rem' }}>© 2025 — Built for local India 🇮🇳</span>
    </footer>
  )
}