export default function Header({ onReset, user, onLogout }) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'G'

  return (
    <header style={{
      background: 'rgba(249,247,244,0.90)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '0 28px',
        height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div
          onClick={onReset || undefined}
          style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: onReset ? 'pointer' : 'default' }}
        >
          <div style={{
            width: 36, height: 36, background: 'var(--accent)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 10px var(--accent-glow)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <span style={{
              fontSize: 19, fontWeight: 800, letterSpacing: '-0.5px',
              color: 'var(--ink)', fontFamily: 'var(--font-d)',
            }}>CutOut</span>
            <span style={{
              display: 'inline-block', marginLeft: 8, fontSize: 10, fontWeight: 700,
              padding: '2px 7px', background: 'var(--accent-light)', color: 'var(--accent)',
              borderRadius: 99, letterSpacing: '0.04em', textTransform: 'uppercase', verticalAlign: 'middle',
            }}>AI</span>
          </div>
        </div>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onReset && (
            <button className="btn btn-ghost btn-sm" onClick={onReset}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              New Image
            </button>
          )}

          {/* User pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 6px 5px 14px',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 99, boxShadow: 'var(--s-xs)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{user?.name}</span>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #f0a06b 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}>
              {initials}
            </div>
          </div>

          <button className="btn btn-ghost btn-sm btn-icon" onClick={onLogout} title="Sign out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
