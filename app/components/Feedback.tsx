'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface FeedbackData {
  [key: string]: {
    helpful: boolean | null
    timestamp: number
  }
}

export default function Feedback({ docSlug }: { docSlug: string }) {
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [visitorId, setVisitorId] = useState('')

  useEffect(() => {
    // Check if user has already voted on this doc
    const stored = localStorage.getItem('docs-feedback')
    if (stored) {
      const feedbackData: FeedbackData = JSON.parse(stored)
      if (feedbackData[docSlug]) {
        setFeedback(feedbackData[docSlug].helpful)
        setHasVoted(true)
      }
    }

    const storedVisitorId = localStorage.getItem('docs-feedback-visitor-id')
    if (storedVisitorId) {
      setVisitorId(storedVisitorId)
      return
    }

    const nextVisitorId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    localStorage.setItem('docs-feedback-visitor-id', nextVisitorId)
    setVisitorId(nextVisitorId)
  }, [docSlug])

  const handleFeedback = async (helpful: boolean) => {
    if (hasVoted) return

    // Store feedback in localStorage
    const stored = localStorage.getItem('docs-feedback')
    const feedbackData: FeedbackData = stored ? JSON.parse(stored) : {}
    
    feedbackData[docSlug] = {
      helpful,
      timestamp: Date.now()
    }
    
    localStorage.setItem('docs-feedback', JSON.stringify(feedbackData))
    
    setFeedback(helpful)
    setHasVoted(true)
    setShowThankYou(true)

    try {
      await fetch('/api/docs/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: docSlug,
          helpful,
          docTitle: document.title,
          pagePath: window.location.pathname,
          visitorId,
        }),
      })
    } catch {
      // Keep UX unchanged even if feedback API fails.
    }
    
    // Hide thank you message after 3 seconds
    setTimeout(() => {
      setShowThankYou(false)
    }, 3000)
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-1">
            Was this helpful?
          </h3>
          <p className="text-xs text-muted-foreground">
            Help us improve our documentation
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {showThankYou ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Thank you for your feedback!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => void handleFeedback(true)}
                disabled={hasVoted}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                  "hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300",
                  feedback === true && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                  hasVoted && "opacity-50 cursor-not-allowed"
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                Yes
              </button>
              
              <button
                onClick={() => void handleFeedback(false)}
                disabled={hasVoted}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                  "hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300",
                  feedback === false && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
                  hasVoted && "opacity-50 cursor-not-allowed"
                )}
              >
                <ThumbsDown className="h-4 w-4" />
                No
              </button>
            </div>
          )}
        </div>
      </div>
      
      {hasVoted && !showThankYou && (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Thank you for your feedback! 
            <button
              onClick={() => {
                localStorage.removeItem('docs-feedback')
                setFeedback(null)
                setHasVoted(false)
              }}
              className="ml-1 underline hover:text-foreground transition-colors"
            >
              Vote again
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
