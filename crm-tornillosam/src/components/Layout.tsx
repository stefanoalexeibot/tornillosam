import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
  onToggleDark?: () => void
  isDark?: boolean
}

export default function Layout({ children, onToggleDark, isDark }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-2)' }}>
      <Sidebar onToggleDark={onToggleDark} isDark={isDark} />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
