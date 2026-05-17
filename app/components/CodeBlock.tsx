'use client'

import { useState, ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface CodeBlockProps {
  children: ReactNode
  language?: string
}

// Recursively extracts raw text content from React children for safe clipboard copy
function getRawText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getRawText).join('')
  if (node.props && node.props.children) return getRawText(node.props.children)
  return ''
}

export default function CodeBlock({ children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const code = getRawText(children).replace(/\n$/, '')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  // Prettify language string if it's generic
  const displayLabel = language === 'typescript' ? 'page.tsx' : language === 'javascript' ? 'index.js' : language || 'code.txt'

  return (
    <div className="not-prose relative group/code font-mono text-[13px] text-neutral-200 bg-[#121212] border border-[#1e1e1e] rounded-[8px] overflow-hidden my-6 shadow-sm">
      {/* Code Header Bar */}
      <div className="px-4 py-2.5 border-b border-[#1e1e1e] bg-[#121212] flex items-center justify-between text-xs font-mono text-neutral-500 lowercase">
        <span className="text-[11px] text-neutral-400">{displayLabel}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1.5 hover:text-neutral-300 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 text-[11px]">copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-neutral-500" />
              <span className="text-[11px] text-neutral-500">copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto custom-scrollbar font-mono leading-relaxed bg-[#121212]">
        <code className={cn("bg-transparent p-0 block hljs", language ? `language-${language}` : '')}>{children}</code>
      </pre>
    </div>
  )
}
