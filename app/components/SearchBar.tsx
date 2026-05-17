'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, FileText } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { searchDocs, Doc } from '@/app/lib/getDocs'
import Link from 'next/link'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Doc[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchDocs(query)
      setResults(searchResults.slice(0, 8)) // Limit to 8 results
      setSelectedIndex(-1)
    } else {
      setResults([])
    }
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            window.location.href = `/docs/${results[selectedIndex].slug}`
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, results, onClose])

  if (!isOpen) return null

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-4">
        <div className="relative bg-background border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
            <button
              onClick={onClose}
              className="ml-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.map((doc, index) => (
                <Link
                  key={doc.id}
                  href={`/docs/${doc.slug}`}
                  className={cn(
                    "flex items-start px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0",
                    selectedIndex === index && "bg-accent"
                  )}
                  onClick={onClose}
                >
                  <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {highlightMatch(doc.title, query)}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {doc.category}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {highlightMatch(doc.description, query)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try searching with different keywords
              </p>
            </div>
          )}
          
          {!query && (
            <div className="px-4 py-6">
              <div className="text-sm text-muted-foreground mb-4">
                Popular searches:
              </div>
              <div className="flex flex-wrap gap-2">
                {['getting started', 'installation', 'api reference', 'product management'].map((term) => (
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
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          <div className="flex items-center justify-center space-x-4">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
