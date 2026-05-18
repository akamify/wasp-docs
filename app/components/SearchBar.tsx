'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, FileText, X } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { FrontendDoc } from '@/app/lib/docs-types'

interface SearchBarProps {
  className?: string
  placeholder?: string
}

export default function SearchBar({ className, placeholder = 'Search documentation...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FrontendDoc[]>([])
  const [docs, setDocs] = useState<FrontendDoc[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    const loadDocs = async () => {
      const res = await fetch('/api/docs/navigation', { cache: 'no-store' })
      if (!res.ok) return
      const json = await res.json()
      const items = (json?.data?.categories || []).flatMap((c: any) => c.items || [])
      if (isMounted) setDocs(items)
    }
    loadDocs()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase()
      const searchResults = docs.filter((doc) => {
        const titleMatch = doc.title.toLowerCase().includes(lowercaseQuery)
        const descriptionMatch = doc.description.toLowerCase().includes(lowercaseQuery)
        const contentMatch = doc.content.toLowerCase().includes(lowercaseQuery)
        const keywordsMatch = doc.keywords.some((keyword: string) => keyword.toLowerCase().includes(lowercaseQuery))
        return titleMatch || descriptionMatch || contentMatch || keywordsMatch
      })
      setResults(searchResults.slice(0, 8))
      setSelectedIndex(-1)
    } else {
      setResults([])
    }
  }, [query, docs])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          if (selectedIndex >= 0 && results[selectedIndex]) {
            e.preventDefault()
            window.location.href = `/${results[selectedIndex].slug}`
          }
          break
        case 'Escape':
          setIsFocused(false)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFocused, selectedIndex, results])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative bg-background border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSelectedIndex(-1)
                inputRef.current?.focus()
              }}
              className="ml-2 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {(isFocused || query) && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.map((doc, index) => (
                <Link
                  key={doc.id}
                  href={`/${doc.slug}`}
                  className={cn(
                    'flex items-start px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0',
                    selectedIndex === index && 'bg-accent'
                  )}
                >
                  <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground mb-1">{highlightMatch(doc.title, query)}</div>
                    <div className="text-xs text-muted-foreground mb-1">{doc.category}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{highlightMatch(doc.description, query)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </div>
          )}

          {!query && (
            <div className="px-4 py-4">
              <div className="text-xs text-muted-foreground mb-3">Popular searches:</div>
              <div className="flex flex-wrap gap-2">
                {['introduction', 'quick start', 'authentication', 'webhooks'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 text-xs bg-muted hover:bg-accent text-muted-foreground hover:text-foreground rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
