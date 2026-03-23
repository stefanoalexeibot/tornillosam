import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0 pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
