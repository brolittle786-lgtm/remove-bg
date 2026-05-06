export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '28px', marginTop: 'auto' }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 24, height: 24, background: 'var(--accent)', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontFamily: 'var(--font-d)', fontSize: 14, color: 'var(--ink)' }}>CutOut</span>
          <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>AI Background Remover</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          Powered by{' '}
          <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            remove.bg
          </a>
          {' '}· Built with React + Node.js
        </p>
      </div>
    </footer>
  )
}
