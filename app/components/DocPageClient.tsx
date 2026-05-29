'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, Check } from 'lucide-react'
// @ts-ignore
import http from 'highlight.js/lib/languages/http'
// @ts-ignore
import javascript from 'highlight.js/lib/languages/javascript'
// @ts-ignore
import typescript from 'highlight.js/lib/languages/typescript'
// @ts-ignore
import python from 'highlight.js/lib/languages/python'
// @ts-ignore
import json from 'highlight.js/lib/languages/json'
// @ts-ignore
import bash from 'highlight.js/lib/languages/bash'

import { cn } from '@/app/lib/utils'
import { FrontendDoc } from '@/app/lib/getDocs'
import Feedback from './Feedback'
import TableOfContents from './TableOfContents'
import ScrollToTop from './ScrollToTop'
import SearchBar from './SearchBar'
import { markdownComponents } from './MarkdownComponents'

interface ContentBlock {
  type: 'markdown' | 'step-card' | 'callout' | 'api-response-card' | 'code-block'
  content: string
  metadata?: Record<string, string>
}

function extractApiResponseContent(raw: string): { title: string; body: string; trailingMarkdown: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { title: 'Response', body: '', trailingMarkdown: '' }

  const lines = trimmed.split('\n')
  const title = lines[0]?.trim() || 'Response'
  const remaining = lines.slice(1).join('\n').trim()

  const fencedMatch = remaining.match(/```[\w-]*\n([\s\S]*?)```/)
  if (fencedMatch && fencedMatch[0] && fencedMatch[1]) {
    const fencedBody = fencedMatch[1].trim()
    const trailingMarkdown = remaining
      .slice(remaining.indexOf(fencedMatch[0]) + fencedMatch[0].length)
      .trim()
    return { title, body: fencedBody, trailingMarkdown }
  }

  return { title, body: remaining, trailingMarkdown: '' }
}

function splitMarkdownByResponsePattern(markdown: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const pattern = /(^#{2,6}\s*response[^\n]*\n```(?:json)?\n[\s\S]*?```)/gim

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(markdown)) !== null) {
    const start = match.index
    const end = pattern.lastIndex

    const before = markdown.slice(lastIndex, start).trim()
    if (before) {
      blocks.push({ type: 'markdown', content: before })
    }

    blocks.push({ type: 'api-response-card', content: match[1].trim() })
    lastIndex = end
  }

  const after = markdown.slice(lastIndex).trim()
  if (after) {
    blocks.push({ type: 'markdown', content: after })
  }

  return blocks.length > 0 ? blocks : [{ type: 'markdown', content: markdown }]
}

const rehypeHighlightOptions = {
  languages: {
    http,
    javascript,
    typescript,
    python,
    json,
    bash
  }
}

// Lightweight interactive copy button for custom block headers
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center space-x-1.5 hover:text-neutral-300 transition-colors text-neutral-500"
      title="Copy content"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-500 text-[11px]">copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-neutral-500" />
          <span className="text-[11px] text-neutral-500">copy</span>
        </>
      )}
    </button>
  )
}

// Parses string content into structured custom blocks with correct sequential transition
function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const lines = content.split('\n')
  let currentBlock: ContentBlock | null = null
  let accumulator: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith(':::')) {
      // 1. If we were currently accumulating a block, finalize and push it
      if (currentBlock) {
        currentBlock.content = accumulator.join('\n')
        if (currentBlock.type === 'markdown') {
          blocks.push(...splitMarkdownByResponsePattern(currentBlock.content))
        } else {
          blocks.push(currentBlock)
        }
        currentBlock = null
        accumulator = []
      }

      // 2. Identify if this is an opening directive or a closing boundary
      const directive = line.slice(3).trim()
      if (directive) {
        if (directive.startsWith('step-card')) {
          currentBlock = { type: 'step-card', content: '' }
        } else if (directive.startsWith('callout')) {
          const typeMatch = directive.match(/type="([^"]+)"/)
          const type = typeMatch ? typeMatch[1] : 'info'
          currentBlock = { type: 'callout', content: '', metadata: { type } }
        } else if (directive.startsWith('api-response-card')) {
          currentBlock = { type: 'api-response-card', content: '' }
        } else if (directive.startsWith('code-block')) {
          const fileMatch = directive.match(/filename="([^"]+)"/)
          const filename = fileMatch ? fileMatch[1] : 'code'
          currentBlock = { type: 'code-block', content: '', metadata: { filename } }
        }
      }
    } else {
      if (!currentBlock) {
        currentBlock = { type: 'markdown', content: '' }
      }
      accumulator.push(line)
    }
  }

  if (currentBlock) {
    currentBlock.content = accumulator.join('\n')
    if (currentBlock.type === 'markdown') {
      blocks.push(...splitMarkdownByResponsePattern(currentBlock.content))
    } else {
      blocks.push(currentBlock)
    }
  }

  return blocks
}

interface DocPageClientProps {
  doc: FrontendDoc
}

export default function DocPageClient({ doc }: DocPageClientProps) {
  const blocks = parseContent(doc.content)

  return (
    <div className="min-h-screen bg-background py-8 px-6 md:pr-12 flex justify-center selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Center Main Documentation Container */}
        <div className="lg:col-span-3 max-w-3xl min-w-0 flex flex-col justify-between">
          <div>
            {/* Minimal Monochrome Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-8">
              <Link href="/introduction" className="hover:text-foreground transition-colors">
                docs
              </Link>
              <span className="text-muted-foreground/45">/</span>
              <span className="text-muted-foreground/60">{doc.category.toLowerCase()}</span>
              <span className="text-muted-foreground/45">/</span>
              <span className="text-foreground font-bold">{doc.title.toLowerCase()}</span>
            </nav>

            <SearchBar className="mb-10" placeholder="Search docs from this page..." />

            <article className="prose prose-neutral dark:prose-invert max-w-none">
              {blocks.map((block, idx) => {
                if (block.type === 'markdown') {
                  return (
                    <ReactMarkdown
                      key={idx}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[[rehypeHighlight, rehypeHighlightOptions]]}
                      components={markdownComponents}
                    >
                      {block.content}
                    </ReactMarkdown>
                  )
                }

                if (block.type === 'step-card') {
                  return (
                    <div key={idx} className="border border-border rounded-[5px] p-6 bg-muted/10 dark:bg-neutral-900/10 my-6 transition-all duration-150 hover:border-foreground/20">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[[rehypeHighlight, rehypeHighlightOptions]]}
                        components={markdownComponents}
                      >
                        {block.content}
                      </ReactMarkdown>
                    </div>
                  )
                }

                if (block.type === 'callout') {
                  const type = block.metadata?.type || 'info'
                  const borderClass = type === 'error' ? 'border-l-red-500' : type === 'warning' ? 'border-l-amber-500' : 'border-l-neutral-600 dark:border-l-neutral-400'
                  const bgClass = type === 'error' ? 'bg-red-500/5' : type === 'warning' ? 'bg-amber-500/5' : 'bg-muted/10'
                  return (
                    <div key={idx} className={cn("border-l-[3px] rounded-r-[5px] p-5 my-6 text-[13px] leading-relaxed", borderClass, bgClass)}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[[rehypeHighlight, rehypeHighlightOptions]]}
                        components={markdownComponents}
                      >
                        {block.content}
                      </ReactMarkdown>
                    </div>
                  )
                }

                if (block.type === 'api-response-card') {
                  const { title, body, trailingMarkdown } = extractApiResponseContent(block.content)
                  const jsonContent = `\`\`\`json\n${body}\n\`\`\``
                  const badgeMatch = title.match(/\(([^)]+)\)/)
                  const statusBadge = badgeMatch ? badgeMatch[1].toLowerCase() : 'accepted'
                  const statusCodeMatch = statusBadge.match(/\b(\d{3})\b/)
                  const statusCode = statusCodeMatch ? Number(statusCodeMatch[1]) : null
                  const statusColorClass =
                    statusCode && statusCode >= 500
                      ? 'text-red-400'
                      : statusCode && statusCode >= 400
                        ? 'text-amber-400'
                        : statusCode && statusCode >= 300
                          ? 'text-sky-400'
                          : 'text-emerald-500'

                  return (
                    <>
                      <div
                        key={idx}
                        className="not-prose my-8 overflow-hidden rounded-[10px] border border-neutral-200 bg-[#0d0d0d] dark:border-neutral-800"
                      >
                        {/* Top Header */}
                        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-neutral-500">
                              response.json
                            </span>

                            <div className="h-1 w-1 rounded-full bg-neutral-700" />

                            <span className={cn("text-[11px] font-medium", statusColorClass)}>
                              {statusBadge}
                            </span>
                          </div>

                          <CopyButton text={block.content} />
                        </div>
                        <div className="border-b border-neutral-800 px-5 py-3">
                          <h4 className={cn("text-[12px] font-semibold tracking-wide uppercase", statusColorClass)}>
                            {title.replace(/^#{2,6}\s*/g, '')}
                          </h4>
                        </div>

                        {/* JSON */}
                        <div className="overflow-x-auto">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[
                              [rehypeHighlight, rehypeHighlightOptions],
                            ]}
                            components={{
                              ...markdownComponents,

                              pre: ({ children }: any) => (
                                <pre className="overflow-x-auto px-5 py-5 text-[13px] leading-7">
                                  {children}
                                </pre>
                              ),

                              code: ({
                                className,
                                children,
                              }: any) => (
                                <code
                                  className={cn(
                                    "font-mono text-[13px] text-neutral-200",
                                    className
                                  )}
                                >
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {jsonContent}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {trailingMarkdown ? (
                        <ReactMarkdown
                          key={`${idx}-trail`}
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[[rehypeHighlight, rehypeHighlightOptions]]}
                          components={markdownComponents}
                        >
                          {trailingMarkdown}
                        </ReactMarkdown>
                      ) : null}
                    </>
                  )
                }

                if (block.type === 'code-block') {
                  const filename =
                    (block.metadata?.filename || 'code.ts').toLowerCase()

                  const lang =
                    filename === 'javascript'
                      ? 'javascript'
                      : filename === 'python'
                        ? 'python'
                        : filename.split('.').pop() || 'typescript'

                  const fencedContent = `\`\`\`${lang}\n${block.content.trim()}\n\`\`\``

                  return (
                    <div
                      key={idx}
                      className="not-prose my-8 overflow-hidden rounded-[10px] border border-neutral-200 bg-[#0d0d0d] dark:border-neutral-800"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
                        <span className="text-[11px] font-mono lowercase tracking-wide text-neutral-500">
                          {filename}
                        </span>

                        <CopyButton text={block.content} />
                      </div>

                      {/* Code */}
                      <div className="overflow-x-auto">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[
                            [rehypeHighlight, rehypeHighlightOptions],
                          ]}
                          components={{
                            ...markdownComponents,

                            pre: ({ children }: any) => (
                              <pre className="overflow-x-auto px-5 py-5 text-[13px] leading-7">
                                {children}
                              </pre>
                            ),

                            code: ({
                              className,
                              children,
                            }: any) => (
                              <code
                                className={cn(
                                  "font-mono text-[13px] text-neutral-200",
                                  className
                                )}
                              >
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {fencedContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )
                }

                return null
              })}
            </article>
          </div>

          {/* Feedback Section */}
          <Feedback docSlug={doc.slug} />
        </div>

        {/* Desktop Sticky Right Sidebar Table of Contents */}
        <div className="lg:col-span-1 hidden lg:block sticky top-12 self-start min-w-0 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-none">
          <TableOfContents content={doc.content} />
        </div>
      </div>

      <ScrollToTop />
    </div>
  )
}

