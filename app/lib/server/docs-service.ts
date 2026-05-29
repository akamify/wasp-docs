import 'server-only';

import { connectToDatabase } from '@/lib/mongodb';
import { DocModel } from '@/app/lib/server/doc-model';
import { PublicPageDocModel } from '@/app/lib/server/public-page-doc-model';
import { SiteSettingModel } from '@/app/lib/server/site-setting-model';
import { Doc, FrontendDoc } from '@/app/lib/docs-types';

function normalizeDocText(value: string): string {
  return value
    .replace(/\u023A/g, 'A')
    .replace(/â€“/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€˜|â€™/g, "'")
    .replace(/â€œ|â€/g, '"');
}

function normalizeSlugInput(slug: string): string {
  return String(slug || '').trim().toLowerCase();
}

function getSlugCandidates(slug: string): string[] {
  const normalized = normalizeSlugInput(slug);
  if (!normalized) return [];

  const candidates = new Set<string>([
    normalized,
    normalized.replace(/\s+/g, '-'),
    normalized.replace(/\s+/g, '_'),
    normalized.replace(/-/g, ' '),
    normalized.replace(/_/g, '-'),
  ]);

  return Array.from(candidates).filter(Boolean);
}

function getPublishedPublicDocFilter(slug?: string) {
  const baseFilter: any = {
    status: 'published',
    $or: [{ contentType: 'doc' }, { contentType: 'page' }, { contentType: { $exists: false } }, { contentType: null }],
  };

  if (!slug) return baseFilter;

  const slugCandidates = getSlugCandidates(slug);
  if (!slugCandidates.length) return { ...baseFilter, slug: '' };

  return { ...baseFilter, slug: { $in: slugCandidates } };
}

function getSanitizedMongoUri(): string {
  const raw = process.env.MONGODB_URI || '';
  return raw
    .replace(/^\uFEFF/, '')
    .replace(/[\u200B-\u200D\u2060]/g, '')
    .trim()
    .replace(/^['"]+|['"]+$/g, '');
}

function mapToDoc(raw: any): Doc {
  return {
    id: raw.id || String(raw._id),
    slug: raw.slug,
    title: raw.title,
    description: normalizeDocText(raw.description || ''),
    content: normalizeDocText(raw.content || ''),
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
  const uri = getSanitizedMongoUri();
  if (!uri) return false;
  return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
}

export async function getDocsDataSourceStatus(): Promise<{ ready: boolean; reason?: string }> {
  const uri = getSanitizedMongoUri();
  if (!uri) {
    return { ready: false, reason: 'MONGODB_URI is missing' };
  }
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return { ready: false, reason: 'MONGODB_URI has invalid scheme (must start with mongodb:// or mongodb+srv://)' };
  }
  try {
    process.env.MONGODB_URI = uri;
    await connectToDatabase();
    return { ready: true };
  } catch (error: any) {
    return { ready: false, reason: error?.message || 'MongoDB connection failed' };
  }
}

export async function isDocsDataSourceReady(): Promise<boolean> {
  const status = await getDocsDataSourceStatus();
  return status.ready;
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
    return null;
  }

  try {
    await connectToDatabase();
  } catch {
    return null;
  }
  const slugCandidates = getSlugCandidates(slug);
  if (!slugCandidates.length) return null;

  const raw =
    (await DocModel.findOne({ slug: { $in: slugCandidates }, status: 'published' }).lean()) ||
    (await PublicPageDocModel.findOne(getPublishedPublicDocFilter(slug)).lean());

  if (raw) return mapToDoc(raw);

  return null;
}

export async function getPublishedNavigationDocs(): Promise<Doc[]> {
  if (!isMongoConfigured()) return [];

  try {
    await connectToDatabase();
  } catch {
    return [];
  }
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
    getPublishedPublicDocFilter(),
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

  return Array.from(mergedBySlug.values()).map(mapToDoc);
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

export async function getBrandNameSetting(): Promise<string> {
  const fallback = process.env.NEXT_PUBLIC_BRAND_NAME || 'DigitalWasp';
  if (!isMongoConfigured()) return fallback;

  try {
    await connectToDatabase();
    const setting = await SiteSettingModel.findOne({ key: { $in: ['brand_name', 'brandName', 'docs_brand_name'] } }).lean();
    const value = typeof setting?.value === 'string' ? setting.value.trim() : '';
    return value || fallback;
  } catch {
    return fallback;
  }
}
