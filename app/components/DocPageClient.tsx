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
import { Doc } from '@/app/lib/getDocs'
import Feedback from './Feedback'
import TableOfContents from './TableOfContents'
import ScrollToTop from './ScrollToTop'
import { markdownComponents } from './MarkdownComponents'

interface ContentBlock {
  type: 'markdown' | 'step-card' | 'callout' | 'api-response-card' | 'code-block'
  content: string
  metadata?: Record<string, string>
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
        blocks.push(currentBlock)
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
    blocks.push(currentBlock)
  }

  return blocks
}

interface DocPageClientProps {
  doc: Doc
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
              <Link href="/docs/introduction" className="hover:text-foreground transition-colors">
                docs
              </Link>
              <span className="text-muted-foreground/45">/</span>
              <span className="text-muted-foreground/60">{doc.category.toLowerCase()}</span>
              <span className="text-muted-foreground/45">/</span>
              <span className="text-foreground font-bold">{doc.title.toLowerCase()}</span>
            </nav>

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
                  const lines = block.content.trim().split('\n')

                  const title = lines[0]

                  const jsonContent = lines.slice(1).join('\n').trim()

                  return (
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

                          <span className="text-[11px] font-medium text-emerald-500">
                            202 accepted
                          </span>
                        </div>

                        <CopyButton text={block.content} />
                      </div>

                      {/* Error Title */}
                      <div className="border-b border-neutral-800 px-5 py-4">
                        <h4 className="text-[13px] font-semibold text-red-400">
                          {title}
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
        <div className="lg:col-span-1 hidden lg:block sticky top-12 self-start min-w-0">
          <TableOfContents content={doc.content} />
        </div>
      </div>

      <ScrollToTop />
    </div>
  )
}
