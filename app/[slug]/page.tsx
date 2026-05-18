import { notFound } from 'next/navigation'
import DocPageClient from '@/app/components/DocPageClient'
import { getDocBySlug, getDocsDataSourceStatus, isDocsDataSourceReady } from '@/app/lib/getDocs'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const isReady = await isDocsDataSourceReady()
  if (!isReady) {
    return { title: 'Docs Unavailable' }
  }
  const doc = await getDocBySlug(params.slug)
  if (!doc) return { title: 'Page Not Found' }
  return {
    title: doc.title,
    description: doc.description,
    keywords: doc.keywords.join(', '),
  }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const status = await getDocsDataSourceStatus()
  if (!status.ready) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="w-full max-w-2xl border border-border rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-2">Documentation unavailable</h1>
          <p className="text-sm text-muted-foreground">
            Database connection is not configured correctly. Set a valid <code>MONGODB_URI</code> and restart the server.
          </p>
          <div className="mt-4 rounded-md bg-muted/40 border border-border px-3 py-2 text-xs font-mono text-muted-foreground break-words">
            Debug: {status.reason || 'Unknown error'}
          </div>
        </div>
      </div>
    )
  }
  const doc = await getDocBySlug(params.slug)
  if (!doc) notFound()
  return <DocPageClient doc={doc} />
}
