import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

// ─── Canvas helpers ────────────────────────────────────────────────────────
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

async function getCroppedImg(src, pixelCrop, bgColor) {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width  = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')
  if (bgColor && bgColor !== 'transparent') {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
  return new Promise(res => canvas.toBlob(b => res(URL.createObjectURL(b)), 'image/png'))
}

async function applyBgColor(src, bgColor) {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width  = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (bgColor && bgColor !== 'transparent') {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)
  return new Promise(res => canvas.toBlob(b => res(URL.createObjectURL(b)), 'image/png'))
}

// ─── Color presets ─────────────────────────────────────────────────────────
const PRESETS = [
  { label: 'None',       value: 'transparent', display: null },
  { label: 'White',      value: '#FFFFFF',  display: '#FFFFFF' },
  { label: 'Black',      value: '#0A0A0A',  display: '#0A0A0A' },
  { label: 'Charcoal',   value: '#374151',  display: '#374151' },
  { label: 'Ocean',      value: '#0EA5E9',  display: '#0EA5E9' },
  { label: 'Indigo',     value: '#4F46E5',  display: '#4F46E5' },
  { label: 'Coral',      value: '#E8652A',  display: '#E8652A' },
  { label: 'Rose',       value: '#F43F5E',  display: '#F43F5E' },
  { label: 'Emerald',    value: '#10B981',  display: '#10B981' },
  { label: 'Amber',      value: '#F59E0B',  display: '#F59E0B' },
  { label: 'Slate',      value: '#94A3B8',  display: '#94A3B8' },
  { label: 'Cream',      value: '#FEF3C7',  display: '#FEF3C7' },
]

export default function Editor({ processedUrl, onDone, onReset }) {
  const [crop, setCrop]               = useState({ x: 0, y: 0 })
  const [zoom, setZoom]               = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [bgColor, setBgColor]         = useState('transparent')
  const [customColor, setCustomColor] = useState('#2563EB')
  const [cropEnabled, setCropEnabled] = useState(false)
  const [applying, setApplying]       = useState(false)
  const [tab, setTab]                 = useState('bg')

  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), [])

  const effectiveBg = bgColor === 'custom' ? customColor : bgColor

  const handleApply = async () => {
    setApplying(true)
    try {
      let out
      if (cropEnabled && croppedAreaPixels) {
        out = await getCroppedImg(processedUrl, croppedAreaPixels, effectiveBg)
      } else {
        out = await applyBgColor(processedUrl, effectiveBg)
      }
      onDone(out)
    } catch (e) {
      console.error(e)
      alert('Failed to apply edits. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <section className="fade-up" style={{ padding: '0 28px 72px', maxWidth: 1160, margin: '0 auto' }}>
      {/* Section header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="badge badge-success">✓ Background Removed</span>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>
          Edit your image below, then click Apply &amp; Preview
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start',
      }}>
        {/* ── Preview / Crop canvas ── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width:12,height:12,borderRadius:'50%',background:'#FF5F57' }}/>
              <div style={{ width:12,height:12,borderRadius:'50%',background:'#FEBC2E' }}/>
              <div style={{ width:12,height:12,borderRadius:'50%',background:'#28C840' }}/>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginLeft: 4 }}>
              {cropEnabled ? 'Crop Mode — drag to reposition' : 'Preview'}
            </span>
            {cropEnabled && (
              <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>Crop Active</span>
            )}
          </div>

          {/* ─ CROP MODE ─ */}
          {cropEnabled ? (
            <div style={{ position: 'relative', height: 500 }}>
              {/* ✅ FIX: checker background so transparent areas show correctly */}
              <div className="checker" style={{ position: 'absolute', inset: 0 }} />
              <Cropper
                image={processedUrl}
                crop={crop}
                zoom={zoom}
                aspect={undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    background: 'transparent',
                    borderRadius: 0,
                  },
                  cropAreaStyle: {
                    border: '2px solid var(--accent)',
                    boxShadow: '0 0 0 9999px rgba(249,247,244,0.75)',
                  },
                  mediaStyle: {},
                }}
                showGrid={true}
              />
            </div>
          ) : (
            /* ─ NORMAL PREVIEW ─ */
            <div
              className={effectiveBg === 'transparent' ? 'checker' : ''}
              style={{
                minHeight: 440,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 32, transition: 'background 0.25s ease',
                background: effectiveBg !== 'transparent' ? effectiveBg : undefined,
                position: 'relative',
              }}
            >
              <img
                src={processedUrl}
                alt="Processed"
                style={{ maxWidth: '100%', maxHeight: 440, objectFit: 'contain', display: 'block', borderRadius: 4 }}
              />
              {/* Color label overlay */}
              {effectiveBg !== 'transparent' && (
                <div style={{
                  position: 'absolute', bottom: 14, right: 14,
                  padding: '4px 10px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-m)',
                  color: 'var(--ink-2)',
                }}>
                  BG: {effectiveBg}
                </div>
              )}
            </div>
          )}

          {/* Zoom slider — only in crop mode */}
          {cropEnabled && (
            <div style={{
              padding: '14px 20px', borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="range" min="1" max="3" step="0.05"
                value={zoom} onChange={e => setZoom(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 13, fontFamily: 'var(--font-m)', color: 'var(--ink-2)', minWidth: 38, textAlign: 'right' }}>
                {zoom.toFixed(2)}×
              </span>
            </div>
          )}
        </div>

        {/* ── Controls panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'var(--surface-3)', padding: 4,
            borderRadius: 12, border: '1px solid var(--border)', gap: 3,
          }}>
            {[
              { id: 'bg',   label: '🎨 Background' },
              { id: 'crop', label: '✂️ Crop' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '9px 10px', border: 'none', cursor: 'pointer',
                  borderRadius: 9, fontFamily: 'var(--font-b)', fontSize: 13, fontWeight: 600,
                  transition: 'all 0.15s',
                  background: tab === t.id ? 'var(--surface)' : 'transparent',
                  color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)',
                  boxShadow: tab === t.id ? 'var(--s-xs)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Background panel */}
          {tab === 'bg' && (
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', marginBottom: 14 }}>
                Background Color
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7, marginBottom: 14 }}>
                {PRESETS.map(p => (
                  <button
                    key={p.value}
                    title={p.label}
                    onClick={() => setBgColor(p.value)}
                    style={{
                      width: '100%', aspectRatio: '1', borderRadius: 8,
                      border: bgColor === p.value
                        ? '2.5px solid var(--accent)'
                        : '1.5px solid var(--border)',
                      cursor: 'pointer',
                      background: p.display || undefined,
                      transition: 'all 0.15s',
                      transform: bgColor === p.value ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: bgColor === p.value ? '0 2px 8px var(--accent-glow)' : 'none',
                      position: 'relative',
                    }}
                    className={!p.display ? 'checker' : ''}
                  >
                    {bgColor === p.value && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke={['#FFFFFF','#FEF3C7','#F59E0B'].includes(p.value) ? '#333' : '#fff'}
                          strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom color row */}
              <div
                onClick={() => setBgColor('custom')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px',
                  border: `1.5px solid ${bgColor === 'custom' ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 10, cursor: 'pointer',
                  background: bgColor === 'custom' ? 'var(--accent-light)' : 'var(--surface-2)',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="color" value={customColor}
                  onChange={e => { setCustomColor(e.target.value); setBgColor('custom') }}
                  style={{ width: 28, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0 }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Custom color</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--ink-3)' }}>
                  {customColor.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Crop panel */}
          {tab === 'crop' && (
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', marginBottom: 14 }}>
                Crop Tool
              </p>

              <div style={{
                padding: 14, borderRadius: 10, marginBottom: 14,
                background: cropEnabled ? 'var(--accent-light)' : 'var(--surface-2)',
                border: `1px solid ${cropEnabled ? 'rgba(232,101,42,0.25)' : 'var(--border)'}`,
              }}>
                <p style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 500, color: cropEnabled ? 'var(--accent-2)' : 'var(--ink-3)' }}>
                  {cropEnabled
                    ? '✦ Crop active — drag the image to reposition. Use the zoom slider below the preview to adjust.'
                    : 'Enable crop to select any portion of your image. Drag to reposition, zoom to scale.'}
                </p>
              </div>

              <button
                className={`btn ${cropEnabled ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => setCropEnabled(v => !v)}
                style={{ width: '100%' }}
              >
                {cropEnabled ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Disable Crop</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 2 6 22"/><polyline points="2 6 22 6"/><polyline points="18 2 18 22"/><polyline points="2 18 22 18"/></svg> Enable Crop</>
                )}
              </button>

              {cropEnabled && (
                <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
                  After cropping, click<br/><strong style={{ color: 'var(--ink-2)' }}>Apply &amp; Preview</strong> to confirm
                </p>
              )}
            </div>
          )}

          {/* Apply CTA */}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleApply}
            disabled={applying}
            style={{ width: '100%' }}
          >
            {applying ? (
              <><div className="spinner" style={{ width: 18, height: 18 }} /> Applying…</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Apply &amp; Preview
              </>
            )}
          </button>

          <button className="btn btn-ghost" onClick={onReset} style={{ width: '100%' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            Start Over
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 780px) {
          section[style*="1fr 300px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
