import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Kanban, Settings, LogOut, ChevronRight, Search } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const location = useLocation()
  const { signOut, user } = useAuth()

  const links = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/leads', icon: <Users size={18} />, label: 'Leads' },
    { to: '/pipeline', icon: <Kanban size={18} />, label: 'Pipeline' },
    { to: '/automatizacion', icon: <Settings size={18} />, label: 'Configuración' },
  ]

  return (
    <aside className="w-[280px] bg-white border-r border-[#E2E8F0] px-4 py-8 h-screen sticky top-0 z-40 transition-all duration-300 hidden md:flex flex-col">
      <div style={{ padding: '0 8px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ 
            width: 44, height: 44, borderRadius: 14, 
            background: 'linear-gradient(135deg, #2563EB, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 900, fontSize: '1.3rem',
            boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
          }}>M</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', lineHeight: 1, letterSpacing: '-0.02em' }}>Maquinados AM</div>
            <div style={{ fontSize: '0.7rem', color: '#3B82F6', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sistema CRM</div>
          </div>
        </div>
      </div>

      {/* Global Search Mockup */}
      <div style={{ marginBottom: 28, padding: '0 8px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 10, 
          padding: '12px 14px', borderRadius: 16, border: '1px solid #F1F5F9',
          background: '#F8FAFC', color: '#94A3B8',
          cursor: 'text'
        }}>
          <Search size={16} />
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Buscar lead...</span>
          <div style={{ 
            marginLeft: 'auto', border: '1px solid #E2E8F0', padding: '2px 6px', 
            borderRadius: 8, fontSize: '0.65rem', background: 'white', fontWeight: 700, color: '#64748B' 
          }}>⌘K</div>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-item ${location.pathname === (link.to === '/' ? '/' : link.to) ? 'active' : ''}`}
            style={{ position: 'relative', padding: '12px 16px' }}
          >
            {link.icon}
            <span style={{ flex: 1 }}>{link.label}</span>
            {location.pathname === (link.to === '/' ? '/' : link.to) && (
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            )}
          </Link>
        ))}
      </nav>

      {/* User profile section */}
      <div style={{ marginTop: 'auto', padding: '24px 8px 0', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12, 
          padding: '12px', borderRadius: 20, background: '#F8FAFC',
          border: '1px solid #F1F5F9'
        }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 12, background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2563EB', fontWeight: 800, fontSize: '0.9rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0'
          }}>
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', 
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              lineHeight: 1.2
            }}>
              {user?.email?.split('@')[0]}
            </div>
            <button 
              onClick={() => signOut()}
              style={{ 
                background: 'none', border: 'none', padding: 0, color: '#EF4444', 
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 
              }}
            >
              <LogOut size={12} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
