import { useState, useRef, useCallback } from 'react'

export default function UploadZone({ appState, originalUrl, onUpload, onRemoveBg, onReset }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onUpload(file)
  }, [onUpload])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  const isProcessing = appState === 'processing'
  const hasImage     = appState === 'uploading'

  return (
    <section style={{ padding: '0 20px 60px', maxWidth: 960, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <input ref={inputRef} id="upload-trigger" type="file"
        accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* Empty dropzone */}
      {!hasImage && !isProcessing && (
        <div className="fade-up"
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-2)'}`,
            borderRadius: 'var(--r-xl)', padding: 'clamp(40px, 8vw, 72px) 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
            cursor: 'pointer', textAlign: 'center',
            background: dragging ? 'var(--accent-light)' : 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
            transition: 'all 0.2s',
            boxShadow: dragging ? `0 0 0 4px var(--accent-glow), var(--s)` : 'var(--s-sm)',
          }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: dragging ? 'var(--accent)' : 'var(--surface-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            boxShadow: dragging ? '0 6px 20px var(--accent-glow)' : 'none',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke={dragging ? '#fff' : 'var(--ink-3)'} strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 'clamp(15px,4vw,18px)', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-d)', marginBottom: 8 }}>
              {dragging ? 'Drop it here!' : 'Drop your image here'}
            </p>
            <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>
              or <span style={{ color: 'var(--accent)', fontWeight: 700 }}>tap to browse</span> · JPG, PNG, WebP · max 25 MB
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Product Photos', 'Portraits', 'Logos', 'ID Photos'].map(t => (
              <span key={t} style={{
                padding: '4px 12px', borderRadius: 99,
                background: 'var(--surface)', border: '1px solid var(--border)',
                fontSize: 12, color: 'var(--ink-2)', fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Image uploaded */}
      {(hasImage || isProcessing) && (
        <div className="fade-up grid-two">
          {/* Image preview card */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '12px 18px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isProcessing ? 'var(--accent)' : 'var(--green)',
                  animation: isProcessing ? 'pulse 1s ease-in-out infinite' : 'none',
                }}/>
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {isProcessing ? 'Processing with AI…' : 'Image Ready'}
                </span>
              </div>
              {!isProcessing && (
                <button className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()}>Change</button>
              )}
            </div>

            <div style={{
              minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20, background: 'var(--surface-2)', position: 'relative',
            }}>
              <img src={originalUrl} alt="Upload" style={{
                maxWidth: '100%', maxHeight: 340, objectFit: 'contain', display: 'block',
                borderRadius: 10, boxShadow: 'var(--s)',
                opacity: isProcessing ? 0.4 : 1, transition: 'opacity 0.3s',
              }}/>
              {isProcessing && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 16,
                }}>
                  <div style={{ position: 'relative', width: 56, height: 56 }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      border: '3px solid var(--border)', borderTop: '3px solid var(--accent)',
                      borderRadius: '50%', animation: 'spin .7s linear infinite',
                    }}/>
                    <div style={{
                      position: 'absolute', inset: 10,
                      border: '2px solid transparent', borderTop: '2px solid rgba(232,101,42,0.4)',
                      borderRadius: '50%', animation: 'spin 1.2s linear infinite reverse',
                    }}/>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 15, fontFamily: 'var(--font-d)' }}>Removing background…</p>
                    <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>AI is analyzing your image</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>
                Next Step
              </p>
              <button className="btn btn-primary" onClick={onRemoveBg} disabled={isProcessing}
                style={{ width: '100%', padding: '14px', marginBottom: 10 }}>
                {isProcessing
                  ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Processing…</>
                  : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" fill="currentColor"/></svg> Remove Background</>
                }
              </button>
              <button className="btn btn-secondary" onClick={() => inputRef.current?.click()} disabled={isProcessing} style={{ width: '100%', marginBottom: 8 }}>
                Change Image
              </button>
              <button className="btn btn-ghost" onClick={onReset} disabled={isProcessing} style={{ width: '100%' }}>
                Cancel
              </button>
            </div>

            <div style={{
              padding: 16, borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(135deg, var(--accent-light) 0%, #fff5ef 100%)',
              border: '1px solid rgba(232,101,42,0.15)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                How it works
              </p>
              {['AI detects the subject automatically', 'Works on people, products & logos', 'Keeps original resolution'].map(t => (
                <div key={t} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontSize: 12, lineHeight: 1.5 }}>✦</span>
                  <span style={{ fontSize: 12, color: 'var(--accent-2)', lineHeight: 1.55, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </section>
  )
}
