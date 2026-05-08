export default function Hero({ onStartUpload, user }) {
  const steps = [
    { num: '01', title: 'Upload',   desc: 'Drop any JPG, PNG or WebP image' },
    { num: '02', title: 'Remove',   desc: 'AI instantly cuts the background' },
    { num: '03', title: 'Edit',     desc: 'Crop, recolor, and fine-tune' },
    { num: '04', title: 'Download', desc: 'Save as full-quality PNG' },
  ]
  return (
    <div>
      <section style={{ textAlign: 'center', padding: 'clamp(40px,8vw,88px) 20px 48px', maxWidth: 720, margin: '0 auto' }}>
        {user && !user.isGuest && (
          <p className="fade-up" style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16, fontWeight: 500 }}>
            👋 Welcome back, <strong style={{ color: 'var(--ink)' }}>{user.name}</strong>
          </p>
        )}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <span className="badge badge-accent" style={{ padding: '5px 14px', fontSize: 11 }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'inline-block' }}/>
            Powered by remove.bg AI
          </span>
        </div>
        <h1 className="fade-up-2" style={{
          fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 800,
          letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 20, fontFamily: 'var(--font-d)',
        }}>
          Cut out anything.
          <br/>
          <span style={{ background:'linear-gradient(135deg, var(--accent) 0%, #f0844d 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Instantly.
          </span>
        </h1>
        <p className="fade-up-2" style={{ fontSize:'clamp(15px,4vw,18px)', color:'var(--ink-2)', lineHeight:1.7, marginBottom:36, maxWidth:460, margin:'0 auto 36px' }}>
          Remove image backgrounds with one click using AI. Crop, add colors, and download — free, no installation.
        </p>
        <div className="fade-up-3" style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onStartUpload} style={{ minWidth: 180 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Image
          </button>
          <div style={{
            display:'flex', alignItems:'center', gap:8, padding:'0 16px',
            borderRadius:'var(--r-lg)', background:'var(--surface)', border:'1.5px solid var(--border)',
            fontSize:13, color:'var(--ink-3)', fontWeight:500, boxShadow:'var(--s-xs)',
            minHeight: 50,
          }}>
            JPG · PNG · WebP · 25MB max
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 60px' }}>
        <div className="steps-grid" style={{ background:'var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden', border:'1px solid var(--border)' }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ background:'var(--surface)', padding:'clamp(18px,4vw,28px) clamp(14px,3vw,24px)', position:'relative' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--accent)', fontFamily:'var(--font-m)', letterSpacing:'0.05em', marginBottom:10 }}>{s.num}</div>
              <p style={{ fontSize:'clamp(13px,3vw,15px)', fontWeight:700, color:'var(--ink)', marginBottom:5, fontFamily:'var(--font-d)' }}>{s.title}</p>
              <p style={{ fontSize:'clamp(11px,2.5vw,13px)', color:'var(--ink-3)', lineHeight:1.55 }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div style={{
                  position:'absolute', right:-1, top:'50%', transform:'translateY(-50%)',
                  width:18, height:18, zIndex:1,
                  background:'var(--surface)', border:'1px solid var(--border)',
                  borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
