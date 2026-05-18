import 'server-only';

import { Doc, FrontendDoc } from '@/app/lib/docs-types';
import { getPublishedDocBySlug, getPublishedNavigationDocs, toFrontendDoc } from '@/app/lib/server/docs-service';

export type { Doc, FrontendDoc };

export async function getDocBySlug(slug: string): Promise<FrontendDoc | null> {
  const doc = await getPublishedDocBySlug(slug);
  return doc ? toFrontendDoc(doc) : null;
}

export async function getAllDocs(): Promise<FrontendDoc[]> {
  const docs = await getPublishedNavigationDocs();
  return docs.map(toFrontendDoc).sort((a, b) => a.order - b.order);
}

export async function getDocsByCategory(category: string): Promise<FrontendDoc[]> {
  const docs = await getAllDocs();
  return docs.filter((doc) => doc.category === category).sort((a, b) => a.order - b.order);
}

export async function getCategories(): Promise<string[]> {
  const docs = await getAllDocs();
  const categories = Array.from(new Set(docs.map((doc) => doc.category)));
  const categoryOrder = ['GETTING STARTED', 'PLATFORM CONFIGURATION', 'CORE APIS', 'CORE FEATURES', 'RESOURCES'];

  return categories.sort((a, b) => {
    const aIdx = categoryOrder.indexOf(a);
    const bIdx = categoryOrder.indexOf(b);
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });
}

export async function getNavigation() {
  const docs = await getPublishedNavigationDocs();
  const categoryOrder = ['GETTING STARTED', 'PLATFORM CONFIGURATION', 'CORE APIS', 'CORE FEATURES', 'RESOURCES'];
  const grouped = new Map<string, { name: string; order: number; items: FrontendDoc[] }>();

  docs.forEach((doc) => {
    const name = doc.sidebar?.section || doc.category;
    const order = typeof doc.sidebar?.sectionOrder === 'number' ? doc.sidebar.sectionOrder : Math.max(categoryOrder.indexOf(name), 0);
    if (!grouped.has(name)) grouped.set(name, { name, order, items: [] });
    grouped.get(name)!.items.push(toFrontendDoc(doc));
  });

  return Array.from(grouped.values())
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map((g) => ({ ...g, items: g.items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)) }));
}
