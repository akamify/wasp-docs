import 'server-only';

import { connectToDatabase } from '@/lib/mongodb';
import { DocModel } from '@/app/lib/server/doc-model';
import { PublicPageDocModel } from '@/app/lib/server/public-page-doc-model';
import { Doc, FrontendDoc } from '@/app/lib/docs-types';
import { allDocs } from '@/app/data/all-docs';

function mapToDoc(raw: any): Doc {
  return {
    id: raw.id || String(raw._id),
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    content: raw.content,
    keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
    category: raw.category,
    order: typeof raw.order === 'number' ? raw.order : 0,
    status: raw.status,
    sidebar: raw.sidebar,
    seo: raw.seo,
    createdAt: new Date(raw.createdAt).toISOString(),
    updatedAt: new Date(raw.updatedAt).toISOString(),
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt).toISOString() : undefined,
  };
}

function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

function getStaticFallbackDocs(): Doc[] {
  const now = new Date().toISOString();
  return allDocs.map((doc) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    content: doc.content,
    keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
    category: doc.category,
    order: typeof doc.order === 'number' ? doc.order : 0,
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  }));
}

export function toFrontendDoc(doc: Doc): FrontendDoc {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    slug: doc.slug,
    content: doc.content,
    keywords: doc.keywords,
    order: doc.order,
  };
}

export async function getPublishedDocBySlug(slug: string): Promise<Doc | null> {
  if (!isMongoConfigured()) {
    const staticDocs = getStaticFallbackDocs();
    return staticDocs.find((doc) => doc.slug === slug) || null;
  }
  await connectToDatabase();
  const raw =
    (await DocModel.findOne({ slug, status: 'published' }).lean()) ||
    (await PublicPageDocModel.findOne({ slug, status: 'published', contentType: 'doc' }).lean());
  if (raw) return mapToDoc(raw);

  const staticDocs = getStaticFallbackDocs();
  return staticDocs.find((doc) => doc.slug === slug) || null;
}

export async function getPublishedNavigationDocs(): Promise<Doc[]> {
  if (!isMongoConfigured()) return getStaticFallbackDocs();
  await connectToDatabase();
  const docRaws = await DocModel.find(
    { status: 'published' },
    {
      id: 1,
      slug: 1,
      title: 1,
      description: 1,
      content: 1,
      keywords: 1,
      category: 1,
      order: 1,
      sidebar: 1,
      seo: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
      publishedAt: 1,
    }
  )
    .sort({ 'sidebar.sectionOrder': 1, category: 1, 'sidebar.itemOrder': 1, order: 1, title: 1 })
    .lean();

  const pageRaws = await PublicPageDocModel.find(
    { status: 'published', contentType: 'doc' },
    {
      id: 1,
      slug: 1,
      title: 1,
      description: 1,
      content: 1,
      keywords: 1,
      category: 1,
      order: 1,
      sidebar: 1,
      seo: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
      publishedAt: 1,
    }
  )
    .sort({ 'sidebar.sectionOrder': 1, category: 1, 'sidebar.itemOrder': 1, order: 1, title: 1 })
    .lean();

  const mergedBySlug = new Map<string, any>();
  for (const raw of pageRaws) mergedBySlug.set(raw.slug, raw);
  for (const raw of docRaws) mergedBySlug.set(raw.slug, raw);

  const docs = Array.from(mergedBySlug.values()).map(mapToDoc);
  if (docs.length > 0) return docs;
  return getStaticFallbackDocs();
}

export async function createDoc(payload: Omit<Doc, 'createdAt' | 'updatedAt'>): Promise<Doc> {
  if (!isMongoConfigured()) {
    throw new Error('Database is not configured');
  }
  await connectToDatabase();
  const created = await DocModel.create(payload);
  return mapToDoc(created.toObject());
}

export async function updateDocById(id: string, updates: Partial<Doc>): Promise<Doc | null> {
  if (!isMongoConfigured()) {
    throw new Error('Database is not configured');
  }
  await connectToDatabase();
  const updated = await DocModel.findByIdAndUpdate(id, updates, { new: true }).lean();
  return updated ? mapToDoc(updated) : null;
}

export async function deleteDocById(id: string): Promise<boolean> {
  if (!isMongoConfigured()) {
    throw new Error('Database is not configured');
  }
  await connectToDatabase();
  const res = await DocModel.findByIdAndDelete(id).lean();
  return Boolean(res);
}
