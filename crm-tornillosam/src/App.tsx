import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
      background: '#F8FAFC', color: '#0F172A', flexDirection: 'column', gap: 16
    }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Iniciando CRM de Tornillos AM...</span>
    </div>
  )
  
  if (!session) return <Navigate to="/login" />
  
  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/crm">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <AuthGuard>
              <Layout>
                <DashboardPage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/leads" element={
            <AuthGuard>
              <Layout>
                <LeadsPage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/pipeline" element={
            <AuthGuard>
              <Layout>
                <PipelinePage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/leads/:id" element={
            <AuthGuard>
              <Layout>
                <LeadDetailPage />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/automatizacion" element={
            <AuthGuard>
              <Layout>
                <AutomatizacionPage />
              </Layout>
            </AuthGuard>
          } />

          <Route path="/configuracion" element={
            <AuthGuard>
              <Layout>
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
