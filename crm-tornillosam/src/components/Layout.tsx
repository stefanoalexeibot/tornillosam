import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="layout-container">
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, paddingBottom: 20 }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
