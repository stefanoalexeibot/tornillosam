import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import PipelinePage from './pages/PipelinePage'
import LeadsPage from './pages/LeadsPage'
import LeadDetailPage from './pages/LeadDetailPage'
import AutomatizacionPage from './pages/AutomatizacionPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import LoginPage from './pages/LoginPage'
import './index.css'

// Protected Route component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  
  if (loading) return (
    <div style={{ 
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0F172A', color: 'white', flexDirection: 'column', gap: 16
    }}>
      <div style={{ width: 40, height: 40, border: '3px solid #1E293B', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontWeight: 600 }}>Iniciando CRM de Tornillos AM...</span>
    </div>
  )
  
  if (!session) return <Navigate to="/login" />
  
  return <>{children}</>
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <AuthGuard>
              <Layout isDark={isDark} onToggleDark={() => setIsDark(!isDark)}>
                <DashboardPage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/pipeline" element={
            <AuthGuard>
              <Layout isDark={isDark} onToggleDark={() => setIsDark(!isDark)}>
                <PipelinePage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/leads" element={
            <AuthGuard>
              <Layout isDark={isDark} onToggleDark={() => setIsDark(!isDark)}>
                <LeadsPage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/leads/:id" element={
            <AuthGuard>
              <Layout isDark={isDark} onToggleDark={() => setIsDark(!isDark)}>
                <LeadDetailPage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/automatizacion" element={
            <AuthGuard>
              <Layout isDark={isDark} onToggleDark={() => setIsDark(!isDark)}>
                <AutomatizacionPage />
              </Layout>
            </AuthGuard>
          } />

          <Route path="/configuracion" element={
            <AuthGuard>
              <Layout isDark={isDark} onToggleDark={() => setIsDark(!isDark)}>
                <ConfiguracionPage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
