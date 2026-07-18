'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/app/lib/utils'

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([])
  const [activeId, setActiveId] = useState<string>('')
  const tocRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const foundHeadings: Array<{ id: string; text: string; level: number }> = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

      foundHeadings.push({ id, text, level })
    }

    setHeadings(foundHeadings)
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, observerOptions)

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [headings])

  useEffect(() => {
    if (!activeId || !tocRef.current) return
    const activeButton = tocRef.current.querySelector<HTMLButtonElement>(`button[data-heading-id="${activeId}"]`)
    activeButton?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset - 90
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <div ref={tocRef} className="space-y-6 pr-4">
      <div className="space-y-4">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
          ON THIS PAGE
        </h3>
        <nav className="relative border-l border-neutral-200/80">
          {headings.map((heading) => {
            const isActive = activeId === heading.id
            return (
              <button
                key={heading.id}
                data-heading-id={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "block w-full text-left text-[11px] font-sans transition-all duration-150 pl-4 -ml-[1px] border-l py-1.5",
                  isActive
                    ? "border-emerald-600 text-emerald-600 font-semibold"
                    : "border-transparent text-muted-foreground hover:text-emerald-600"
                )}
              >
                {heading.text}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
