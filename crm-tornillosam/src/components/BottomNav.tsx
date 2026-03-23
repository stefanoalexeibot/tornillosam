import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Kanban, Plus, UserCircle } from 'lucide-react'
import { useState } from 'react'
import LeadModal from './LeadModal'

export default function BottomNav() {
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <nav className="bottom-nav flex md:hidden">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={22} />
          <span>Inicio</span>
        </Link>
        <Link to="/pipeline" className={`nav-item ${location.pathname === '/pipeline' ? 'active' : ''}`}>
          <Kanban size={22} />
          <span>Etapas</span>
        </Link>
        
        {/* Floating Action Button Concept */}
        <div style={{ position: 'relative', width: 64 }}>
          <button 
            onClick={() => setShowModal(true)}
            className="fab-btn" 
            style={{ 
              position: 'absolute', 
              top: -38, 
              left: '50%', 
              transform: 'translateX(-50%)' 
            }}
          >
            <Plus size={30} strokeWidth={2.5} />
          </button>
        </div>

        <Link to="/leads" className={`nav-item ${location.pathname === '/leads' ? 'active' : ''}`}>
          <Users size={22} />
          <span>Leads</span>
        </Link>
        <Link to="/automatizacion" className={`nav-item ${location.pathname === '/automatizacion' ? 'active' : ''}`}>
          <UserCircle size={22} />
          <span>Perfil</span>
        </Link>
      </nav>

      {showModal && (
        <LeadModal
          onClose={() => setShowModal(false)}
          onSaved={() => setShowModal(false)}
        />
      )}
    </>
  )
}
