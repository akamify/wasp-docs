'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { FrontendDoc } from '@/app/lib/docs-types'
import { BookOpenText } from 'lucide-react'

interface SidebarProps {
  className?: string
  onCloseMobile?: () => void
  brandName: string
  categories: Array<{
    name: string
    order: number
    items: FrontendDoc[]
  }>
}

export default function Sidebar({ className, onCloseMobile, categories, brandName }: SidebarProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Force light theme permanently
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }, [])

  return (
    <div className={cn("flex flex-col h-full text-foreground font-[family-name:var(--font-sans)] selection:bg-neutral-200 dark:selection:bg-neutral-800", className)}>
      {/* Brand Header */}
      <div className="px-6 py-6">
        <Link
          href="/introduction"
          onClick={onCloseMobile}
          className="flex items-center gap-2 tracking-tight"
        >
          <div className="relative flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-1 shadow-[0_12px_35px_rgba(16,185,129,0.18)] transition-all duration-300 group-hover:scale-[1.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(52,211,153,0.35),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.28),transparent_35%)]" />
            <img
              src="/logo.png"
              alt={brandName}
              className="relative z-10 h-full w-full rounded-[1.05rem] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-[17px] font-black tracking-[-0.03em] text-slate-950">
              {brandName}
            </span>

            <span className="mt-1 hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 sm:flex">
              <BookOpenText className="h-3 w-3" />
              Docs Workspace
            </span>
          </span>
        </Link>
      </div>
    
      {/* Navigation Areas */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-6 py-6 space-y-8">
        {categories.map((category) => {
          const docs = category.items

          return (
            <div key={category.name} className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase">
                {category.name}
              </h3>

              <ul className="space-y-1.5 border-l border-border ml-[2px]">
                {docs.map((doc) => {
                  const normalizePath = (path: string) => path.replace(/\/$/, '')
                  const isActive = normalizePath(pathname) === normalizePath(`/${doc.slug}`)
                  return (
                    <li key={doc.id} className="relative">
                      <Link
                        href={`/${doc.slug}`}
                        onClick={onCloseMobile}
                        className={cn(
                          "block pl-4 py-1 text-sm transition-all duration-150 -ml-[1px]",
                          "border-l-[1.5px] font-medium",
                          isActive
                            ? "border-emerald-600 text-emerald-600 font-semibold"
                            : "border-transparent text-muted-foreground hover:text-emerald-600 hover:border-muted-emerald/30"
                        )}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-6 py-6">
        <div className="text-xs text-muted-foreground font-mono">
          Developed by <Link target='_blank' rel='noopener noreferrer' href="https://akamify.com/"><b>Akamify</b></Link>
        </div>
      </div>
    </div>
  )
}

