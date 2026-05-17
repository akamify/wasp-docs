import { allDocs, Doc } from '@/app/data/all-docs'

export type { Doc }

export function getAllDocs(): Doc[] {
  return [...allDocs].sort((a: Doc, b: Doc) => (a.order || 0) - (b.order || 0))
}

export function getDocBySlug(slug: string): Doc | undefined {
  return allDocs.find((doc: Doc) => doc.slug === slug)
}

export function getDocsByCategory(category: string): Doc[] {
  return allDocs
    .filter((doc: Doc) => doc.category === category)
    .sort((a: Doc, b: Doc) => (a.order || 0) - (b.order || 0))
}

export function getCategories(): string[] {
  const categories = Array.from(new Set(allDocs.map((doc: Doc) => doc.category)))
  const categoryOrder = ['GETTING STARTED', 'PLATFORM CONFIGURATION', 'CORE APIS', 'CORE FEATURES', 'RESOURCES']
  return categories.sort((a: string, b: string) => {
    const aIdx = categoryOrder.indexOf(a)
    const bIdx = categoryOrder.indexOf(b)
    if (aIdx === -1) return 1
    if (bIdx === -1) return -1
    return aIdx - bIdx
  })
}

export function searchDocs(query: string): Doc[] {
  const lowercaseQuery = query.toLowerCase()
  
  return allDocs.filter((doc: Doc) => {
    const titleMatch = doc.title.toLowerCase().includes(lowercaseQuery)
    const descriptionMatch = doc.description.toLowerCase().includes(lowercaseQuery)
    const contentMatch = doc.content.toLowerCase().includes(lowercaseQuery)
    const keywordsMatch = doc.keywords.some((keyword: string) => 
      keyword.toLowerCase().includes(lowercaseQuery)
    )
    
    return titleMatch || descriptionMatch || contentMatch || keywordsMatch
  }).sort((a: Doc, b: Doc) => (a.order || 0) - (b.order || 0))
}

export function getBreadcrumbs(slug: string): { title: string; slug: string }[] {
  const doc = getDocBySlug(slug)
  if (!doc) return []
  
  return [
    { title: 'Documentation', slug: '/docs' },
    { title: doc.category, slug: `/docs?category=${encodeURIComponent(doc.category)}` },
    { title: doc.title, slug: `/docs/${slug}` }
  ]
}
