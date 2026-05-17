import { notFound } from 'next/navigation'
import { getDocBySlug } from '@/app/lib/getDocs'
import DocPageClient from '@/app/components/DocPageClient'

export async function generateMetadata() {
  const doc = getDocBySlug('troubleshooting')
  if (!doc) return { title: 'Page Not Found' }
  return {
    title: doc.title,
    description: doc.description,
    keywords: doc.keywords.join(', '),
  }
}

export default function Page() {
  const doc = getDocBySlug('troubleshooting')
  if (!doc) notFound()
  return <DocPageClient doc={doc} />
}
