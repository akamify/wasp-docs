'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from '@/app/components/Sidebar'
import { FrontendDoc } from '@/app/lib/docs-types'

type NavCategory = {
  name: string
  order: number
  items: FrontendDoc[]
}

export default function AppShellClient({
  children,
  navigation,
}: {
  children: React.ReactNode
  navigation: NavCategory[]
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row antialiased">
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-background sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 bg-foreground rounded-[3px] flex items-center justify-center">
            <span className="text-[10px] font-bold text-background font-mono">Î©</span>
          </div>
          <span className="font-mono font-bold text-sm tracking-wider uppercase text-foreground">
            {process.env.NEXT_PUBLIC_BRAND_NAME || 'DigitalWasp'}
          </span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 border border-border rounded-[5px] bg-background hover:bg-muted text-foreground transition-all duration-150"
          aria-label="Toggle navigation drawer"
        >
          {isMobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </header>

      <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        <Sidebar categories={navigation} />
      </aside>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-900/60 backdrop-blur-[2px]"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex flex-col w-64 max-w-[280px] h-full bg-background border-r border-border shadow-xl animate-in slide-in-from-left duration-200">
            <Sidebar categories={navigation} onCloseMobile={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
