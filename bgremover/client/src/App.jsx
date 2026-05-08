import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import LoginPage from './components/LoginPage.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import UploadZone from './components/UploadZone.jsx'
import Editor from './components/Editor.jsx'
import ResultPreview from './components/ResultPreview.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const [user, setUser]         = useState(null)
  const [appState, setAppState] = useState('idle')
  const [originalFile, setOriginalFile] = useState(null)
  const [originalUrl, setOriginalUrl]   = useState(null)
  const [processedUrl, setProcessedUrl] = useState(null)
  const [finalUrl, setFinalUrl]         = useState(null)
  const [toast, setToast]       = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('cutout_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch (_) {}
    }
  }, [])

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  const handleLogin = useCallback((userData) => {
    setUser(userData)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('cutout_user')
    setUser(null)
    handleReset()
  }, [])

  const handleUpload = useCallback((file) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      showToast('Please upload a JPG, PNG, or WebP image.', 'error')
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      showToast('Image must be smaller than 25 MB.', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setOriginalFile(file)
    setOriginalUrl(url)
    setProcessedUrl(null)
    setFinalUrl(null)
    setAppState('uploading')
  }, [showToast])

  const handleRemoveBg = useCallback(async () => {
    if (!originalFile) return
    setAppState('processing')
    try {
      const formData = new FormData()
      formData.append('image', originalFile)
    const BASE = 'https://remove-bg-xb76.onrender.com'
const res = await axios.post(`${BASE}/api/remove-bg`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      })
      if (res.data?.imageUrl) {
        setProcessedUrl(res.data.imageUrl)
        setFinalUrl(res.data.imageUrl)
        setAppState('editing')
      } else {
        throw new Error('No image returned from server.')
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Background removal failed. Please try again.'
      showToast(msg, 'error')
      setAppState('uploading')
    }
  }, [originalFile, showToast])

  const handleEditorDone = useCallback((outputUrl) => {
    setFinalUrl(outputUrl)
    setAppState('done')
  }, [])

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setOriginalFile(null)
    setOriginalUrl(null)
    setProcessedUrl(null)
    setFinalUrl(null)
    setAppState('idle')
  }, [originalUrl])

  const handleBackToEdit = useCallback(() => {
    setFinalUrl(processedUrl)
    setAppState('editing')
  }, [processedUrl])

  // ── Show login if not authenticated ──
  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        user={user}
        onReset={appState !== 'idle' ? handleReset : null}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {appState === 'idle' && (
          <Hero
            user={user}
            onStartUpload={() => document.getElementById('upload-trigger')?.click()}
          />
        )}

        {(appState === 'idle' || appState === 'uploading' || appState === 'processing') && (
          <UploadZone
            appState={appState}
            originalUrl={originalUrl}
            onUpload={handleUpload}
            onRemoveBg={handleRemoveBg}
            onReset={handleReset}
          />
        )}

        {appState === 'editing' && (
          <Editor
            processedUrl={processedUrl}
            onDone={handleEditorDone}
            onReset={handleReset}
          />
        )}

        {appState === 'done' && (
          <ResultPreview
            originalUrl={originalUrl}
            finalUrl={finalUrl}
            onBackToEdit={handleBackToEdit}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
