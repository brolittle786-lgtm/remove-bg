import { useState } from 'react'

export default function ResultPreview({ originalUrl, finalUrl, onBackToEdit, onReset }) {
  const [view, setView]             = useState('after')
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded]   = useState(false)

  const handleDownload = async () => {
    if (!finalUrl || downloading) return
    setDownloading(true)
    const a = document.createElement('a')
    a.href = finalUrl; a.download = `cutout-${Date.now()}.png`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => { setDownloading(false); setDownloaded(true) }, 800)
    setTimeout(() => setDownloaded(false), 4000)
  }

  return (
    <section className="fade-up" style={{ padding: '0 20px 60px', maxWidth: 1040, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Success bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 20px', marginBottom: 20,
        background: 'linear-gradient(135deg, var(--green-light) 0%, #f0fdf4 100%)',
        border: '1px solid #86EFAC', borderRadius: 'var(--r-lg)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(22,163,74,0.3)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, color: '#15803D', fontSize: 15, fontFamily: 'var(--font-d)' }}>Your image is ready!</p>
          <p style={{ color: '#166534', fontSize: 13, marginTop: 2 }}>Background removed and edits applied.</p>
        </div>
        {downloaded && <span className="badge badge-success" style={{ flexShrink: 0 }}>✓ Saved</span>}
      </div>

      <div className="grid-result">
        {/* Image comparison */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 8, padding: 3, gap: 2 }}>
              {[{id:'before',label:'Original'},{id:'after',label:'✓ Result'}].map(v => (
                <button key={v.id} onClick={() => setView(v.id)} style={{
                  padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-b)', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  background: view === v.id ? 'var(--surface)' : 'transparent',
                  color: view === v.id ? 'var(--ink)' : 'var(--ink-3)',
                  boxShadow: view === v.id ? 'var(--s-xs)' : 'none',
                }}>{v.label}</button>
              ))}
            </div>
          </div>

          <div className={view === 'after' ? 'checker' : ''} style={{
            minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 28, transition: 'all 0.25s',
            background: view === 'before' ? 'var(--surface-2)' : undefined,
          }}>
            <img key={view} src={view === 'before' ? originalUrl : finalUrl} alt={view} style={{
              maxWidth: '100%', maxHeight: 380, objectFit: 'contain', display: 'block',
              borderRadius: 6, animation: 'fadeUp .3s ease',
              boxShadow: view === 'before' ? 'var(--s-lg)' : 'none',
            }}/>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', marginBottom: 14 }}>Export</p>
            <button className="btn btn-primary btn-lg" onClick={handleDownload} disabled={downloading} style={{ width: '100%', marginBottom: 12 }}>
              {downloading
                ? <><div className="spinner" style={{ width:18,height:18 }}/> Saving…</>
                : downloaded
                  ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Downloaded!</>
                  : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Download PNG</>
              }
            </button>
            <div style={{ padding: '10px 14px', borderRadius: 9, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              {[['Format','PNG with transparency'],['Quality','Original resolution'],['Size','Ready for any tool']].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize:12, color:'var(--ink-3)' }}>{k}</span>
                  <span style={{ fontSize:12, color:'var(--ink-2)', fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', marginBottom: 12 }}>Edit More</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-secondary" onClick={onBackToEdit} style={{ width: '100%' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Back to Editor
              </button>
              <button className="btn btn-ghost" onClick={onReset} style={{ width: '100%' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                New Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
