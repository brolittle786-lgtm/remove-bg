export default function Hero({ onStartUpload, user }) {
  const steps = [
    { num: '01', title: 'Upload', desc: 'Drop any JPG, PNG or WebP image' },
    { num: '02', title: 'Remove', desc: 'AI instantly cuts the background' },
    { num: '03', title: 'Edit', desc: 'Crop, recolor, and fine-tune' },
    { num: '04', title: 'Download', desc: 'Save as full-quality PNG' },
  ]

  return (
    <div>
      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(56px, 8vw, 96px) 28px 64px',
        maxWidth: 760, margin: '0 auto',
      }}>
        {/* Greeting */}
        {user && !user.isGuest && (
          <p className="fade-up" style={{
            fontSize: 14, color: 'var(--ink-2)', marginBottom: 20,
            fontWeight: 500,
          }}>
            👋 Welcome back, <strong style={{ color: 'var(--ink)' }}>{user.name}</strong>
          </p>
        )}

        {/* Badge */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <span className="badge badge-accent" style={{ padding: '5px 14px', fontSize: 11 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}/>
            Powered by remove.bg AI
          </span>
        </div>

        <h1 className="fade-up-2" style={{
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-2px',
          lineHeight: 1.05,
          marginBottom: 22,
          fontFamily: 'var(--font-d)',
        }}>
          Cut out anything.
          <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, #f0844d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Instantly.</span>
        </h1>

        <p className="fade-up-2" style={{
          fontSize: 18, color: 'var(--ink-2)', lineHeight: 1.7,
          marginBottom: 40, maxWidth: 480, margin: '0 auto 40px',
        }}>
          Remove image backgrounds with one click using AI. 
          Crop, add colors, and download — free, no installation.
        </p>

        <div className="fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={onStartUpload}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Image
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 18px', borderRadius: 'var(--r-lg)',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            fontSize: 13, color: 'var(--ink-3)', fontWeight: 500,
            boxShadow: 'var(--s-xs)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            JPG · PNG · WebP · up to 25MB
          </div>
        </div>
      </section>

      {/* Steps bar */}
      <section style={{
        maxWidth: 1000, margin: '0 auto', padding: '0 28px 72px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          background: 'var(--border)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              background: 'var(--surface)',
              padding: '28px 24px',
              position: 'relative',
              transition: 'background 0.2s',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 800, color: 'var(--accent)',
                fontFamily: 'var(--font-m)', letterSpacing: '0.05em',
                marginBottom: 12,
              }}>
                {s.num}
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, fontFamily: 'var(--font-d)' }}>
                {s.title}
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>
                {s.desc}
              </p>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)',
                  width: 18, height: 18, zIndex: 1,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="3">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          div[style*="gridTemplateColumns: 'repeat(4, 1fr)'"] {
            grid-template-columns: repeat(2,1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
