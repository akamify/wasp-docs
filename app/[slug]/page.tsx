import { notFound } from 'next/navigation'
import DocPageClient from '@/app/components/DocPageClient'
import { getDocBySlug } from '@/app/lib/getDocs'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = await getDocBySlug(params.slug)
  if (!doc) return { title: 'Page Not Found' }
  return {
    title: doc.title,
    description: doc.description,
    keywords: doc.keywords.join(', '),
  }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const doc = await getDocBySlug(params.slug)
  if (!doc) notFound()
  return <DocPageClient doc={doc} />
}
