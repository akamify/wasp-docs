'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { FrontendDoc } from '@/app/lib/docs-types'

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
          className="flex items-center tracking-tight"
        >
          <div className="h-5 w-5 flex items-center justify-center">
            <img src="/logo.png" alt={brandName} className="h-4 w-4" />
          </div>
          <span className="font-mono font-bold text-sm tracking-wider uppercase text-foreground">
            {brandName}
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
                            ? "border-foreground text-foreground font-semibold"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
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

