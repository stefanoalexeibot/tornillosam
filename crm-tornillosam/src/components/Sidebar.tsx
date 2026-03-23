import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Kanban, PlusCircle, Zap, Settings, TrendingUp,
  Sun, Moon, LogOut, User
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Kanban, label: 'Pipeline', to: '/pipeline' },
  { icon: Users, label: 'Leads', to: '/leads' },
  { icon: TrendingUp, label: 'Métricas', to: '/metricas' },
]

interface Props {
  onToggleDark?: () => void
  isDark?: boolean
}

export default function Sidebar({ onToggleDark, isDark }: Props) {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #2563EB, #6366F1)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 18 }}>🔩</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>Tornillos AM</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>CRM de Ventas</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>
          Principal
        </div>
        {navItems.map(({ icon: Icon, label, to }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to))
          return (
            <Link key={to} to={to} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={17} />
              {label}
            </Link>
          )
        })}

        <div style={{ height: 1, background: 'var(--border)', margin: '16px 8px' }} />

        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>
          Acciones
        </div>
        <Link to="/leads/new" className="nav-item">
          <PlusCircle size={17} />
          Nuevo Lead
        </Link>
        <Link to="/automatizacion" className="nav-item">
          <Zap size={17} />
          Automatización
        </Link>
        <Link to="/configuracion" className="nav-item">
          <Settings size={17} />
          Configuración
        </Link>

        {/* Dark Mode Toggle */}
        <div style={{ marginTop: 16 }}>
          <button 
            onClick={onToggleDark}
            className="nav-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
            {isDark ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
        </div>
      </nav>

      {/* User Section */}
      <div style={{ padding: '12px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          padding: '8px',
          background: 'var(--surface-2)',
          borderRadius: 12,
          marginBottom: 10
        }}>
          <div style={{ 
            width: 32, height: 32, 
            borderRadius: '50%', 
            background: '#E2E8F0', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748B'
          }}>
            <User size={16} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.email?.split('@')[0]}
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.email}
            </div>
          </div>
        </div>
        
        <button 
          onClick={signOut}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: '#EF4444' }}
        >
          <LogOut size={17} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
