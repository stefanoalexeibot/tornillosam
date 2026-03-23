import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface Props {
  children: ReactNode
  onToggleDark?: () => void
  isDark?: boolean
}

export default function Layout({ children, onToggleDark, isDark }: Props) {
  return (
    <div className="layout-container">
      <Sidebar onToggleDark={onToggleDark} isDark={isDark} />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, paddingBottom: 20 }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
