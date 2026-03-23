import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Kanban, Settings } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Inicio', to: '/' },
  { icon: Kanban, label: 'Pipeline', to: '/pipeline' },
  { icon: Users, label: 'Leads', to: '/leads' },
  { icon: Settings, label: 'Config', to: '/configuracion' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav mobile-only">
      {navItems.map(({ icon: Icon, label, to }) => {
        const active = pathname === to || (to !== '/' && pathname.startsWith(to))
        return (
          <Link key={to} to={to} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
