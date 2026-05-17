'use client'

import Link from 'next/link'
import CodeBlock from '@/app/components/CodeBlock'

export const markdownComponents = {
  h1: ({ children }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    return (
      <h1 id={id} className="text-2xl font-mono font-bold uppercase tracking-wide text-foreground mt-2 mb-8">
        {children}
      </h1>
    )
  },
  h2: ({ children }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    return (
      <h2 id={id} className="group flex items-center text-[15px] font-mono font-bold uppercase tracking-wider text-foreground mt-12 mb-4 scroll-m-20 border-b border-border pb-1.5">
        {children}
        <a href={`#${id}`} className="ml-2 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">#</a>
      </h2>
    )
  },
  h3: ({ children }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    return (
      <h3 id={id} className="group flex items-center text-[13px] font-mono font-bold uppercase tracking-widest text-foreground mt-8 mb-3 scroll-m-20">
        {children}
        <a href={`#${id}`} className="ml-2 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">#</a>
      </h3>
    )
  },
  h4: ({ children }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    return (
      <h4 id={id} className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mt-6 mb-2">
        {children}
      </h4>
    )
  },
  p: ({ children }: any) => (
    <div className="text-[13px] leading-relaxed text-muted-foreground mb-4">
      {children}
    </div>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc pl-5 space-y-1.5 mb-5 text-[13px] leading-relaxed text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal pl-5 space-y-1.5 mb-5 text-[13px] leading-relaxed text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="pl-1">
      {children}
    </li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-foreground dark:border-neutral-500 pl-4 italic text-muted-foreground my-5 text-[13px]">
      {children}
    </blockquote>
  ),
  pre: ({ children }: any) => <>{children}</>,
  code: ({ node, className, children, ...props }: any) => {
    const isInline = !className && (typeof children === 'string' ? !children.includes('\n') : false)
    if (isInline) {
      return (
        <code className="bg-muted text-foreground dark:bg-neutral-800 px-1.5 py-0.5 rounded-[3px] text-xs font-mono font-semibold" {...props}>
          {children}
        </code>
      )
    }
    const match = /language-(\w+)/.exec(className || '')
    const lang = match ? match[1] : ''
    return (
      <CodeBlock language={lang} {...props}>
        {children}
      </CodeBlock>
    )
  },
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6 border border-border rounded-[5px] bg-background">
      <table className="w-full border-collapse text-left text-[12px] font-mono">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-muted/50 border-b border-border">
      {children}
    </thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-border">
      {children}
    </tbody>
  ),
  tr: ({ children }: any) => (
    <tr className="hover:bg-muted/10 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-3 font-bold text-foreground uppercase tracking-wider text-[10px]">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-4 py-3 text-muted-foreground leading-relaxed">
      {children}
    </td>
  ),
  a: ({ href, children }: any) => {
    const isExternal = href?.startsWith('http')
    return (
      <Link 
        href={href || '#'}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-foreground underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 hover:decoration-foreground transition-all duration-150"
      >
        {children}
      </Link>
    )
  }
}
