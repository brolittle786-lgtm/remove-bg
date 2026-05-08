import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPwd, setShowPwd]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    const user = { name: name || email.split('@')[0], email }
    sessionStorage.setItem('cutout_user', JSON.stringify(user))
    onLogin(user)
  }

  const handleGuest = () => {
    const user = { name: 'Guest', email: 'guest@cutout.app', isGuest: true }
    sessionStorage.setItem('cutout_user', JSON.stringify(user))
    onLogin(user)
  }

  return (
    <div className="login-grid" style={{ fontFamily: 'var(--font-b)' }}>
      {/* Brand panel — hidden on mobile via CSS */}
      <div className="login-brand">
        <div style={{ position:'absolute', top:-120, right:-120, width:400, height:400, background:'radial-gradient(circle, rgba(232,101,42,0.25) 0%, transparent 70%)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-60, width:300, height:300, background:'radial-gradient(circle, rgba(232,101,42,0.12) 0%, transparent 70%)', borderRadius:'50%' }}/>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
          <div style={{ width:40, height:40, background:'var(--accent)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(232,101,42,0.4)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:'var(--font-d)', letterSpacing:'-0.5px' }}>CutOut</span>
        </div>

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:99, background:'rgba(232,101,42,0.15)', border:'1px solid rgba(232,101,42,0.3)', fontSize:11, fontWeight:700, color:'var(--accent)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:28, width:'fit-content' }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'block' }}/>
            AI-Powered Editing
          </div>
          <h1 style={{ fontSize:'clamp(36px,4vw,52px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.08, marginBottom:20, fontFamily:'var(--font-d)' }}>
            Remove backgrounds<br/><span style={{ color:'var(--accent)' }}>in seconds.</span>
          </h1>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:380 }}>
            Professional AI background removal, crop tools, and custom color fills — all in one place.
          </p>
          <div style={{ marginTop:40, display:'flex', flexDirection:'column', gap:14 }}>
            {['One-click AI background removal','Smart crop with drag & zoom','Custom background colors & export'].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ color:'var(--accent)', fontSize:8 }}>◆</span>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'relative', padding:'14px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14 }}>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>
            Powered by <strong style={{ color:'rgba(255,255,255,0.8)' }}>remove.bg</strong> · Trusted by designers &amp; developers
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(32px,6vw,48px) clamp(20px,5vw,40px)', background:'var(--bg)', minHeight:'100vh' }}>
        {/* Mobile logo — only shows when brand panel is hidden */}
        <div style={{ display:'none' }} className="mobile-logo">
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
            <div style={{ width:36,height:36,background:'var(--accent)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/><path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontSize:20, fontWeight:800, fontFamily:'var(--font-d)' }}>CutOut</span>
          </div>
        </div>

        <div style={{ width:'100%', maxWidth:380 }} className="fade-up">
          {/* Tab switcher */}
          <div style={{ display:'flex', background:'var(--surface-3)', padding:4, borderRadius:12, marginBottom:28, border:'1px solid var(--border)' }}>
            {[{id:'login',label:'Sign In'},{id:'signup',label:'Sign Up'}].map(t => (
              <button key={t.id} onClick={() => { setMode(t.id); setError('') }} style={{
                flex:1, padding:'11px', border:'none', cursor:'pointer', borderRadius:9,
                fontFamily:'var(--font-b)', fontSize:14, fontWeight:600, transition:'all 0.2s',
                background: mode===t.id ? 'var(--surface)' : 'transparent',
                color: mode===t.id ? 'var(--ink)' : 'var(--ink-3)',
                boxShadow: mode===t.id ? 'var(--s-xs)' : 'none',
              }}>{t.label}</button>
            ))}
          </div>

          <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.6px', marginBottom:6, fontFamily:'var(--font-d)' }}>
            {mode==='login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize:14, color:'var(--ink-2)', marginBottom:24 }}>
            {mode==='login' ? 'Sign in to access your workspace.' : 'Start removing backgrounds for free.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {mode==='signup' && (
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--ink-2)', marginBottom:6 }}>Full Name</label>
                <input className="input" type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
            )}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--ink-2)', marginBottom:6 }}>Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'var(--ink-2)' }}>Password</label>
                {mode==='login' && <button type="button" style={{ fontSize:12, color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-b)', fontWeight:600 }}>Forgot?</button>}
              </div>
              <div style={{ position:'relative' }}>
                <input className="input" type={showPwd?'text':'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} style={{ paddingRight:44 }}/>
                <button type="button" onClick={()=>setShowPwd(v=>!v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--ink-3)', display:'flex', alignItems:'center' }}>
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding:'10px 14px', background:'var(--red-light)', border:'1px solid #FCA5A5', borderRadius:8, fontSize:13, color:'var(--red)', fontWeight:500 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', padding:'14px', marginTop:4 }}>
              {loading
                ? <><div className="spinner" style={{ width:16,height:16 }}/> {mode==='login'?'Signing in…':'Creating account…'}</>
                : mode==='login' ? 'Sign In' : 'Create Account'
              }
            </button>
          </form>

          <div className="divider" style={{ margin:'20px 0' }}>or</div>

          <button className="btn btn-secondary" onClick={handleGuest} style={{ width:'100%', padding:'14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Continue as Guest
          </button>

          <p style={{ textAlign:'center', fontSize:12, color:'var(--ink-3)', marginTop:24, lineHeight:1.6 }}>
            By continuing, you agree to our{' '}
            <span style={{ color:'var(--accent)', cursor:'pointer', fontWeight:600 }}>Terms</span>{' '}and{' '}
            <span style={{ color:'var(--accent)', cursor:'pointer', fontWeight:600 }}>Privacy Policy</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .mobile-logo { display: flex !important; justify-content: center; }
        }
      `}</style>
    </div>
  )
}
