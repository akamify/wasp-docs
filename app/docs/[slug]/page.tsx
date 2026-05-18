import { redirect } from 'next/navigation'

export default function LegacyDocsSlugPage({ params }: { params: { slug: string } }) {
  redirect(`/${params.slug}`)
}
