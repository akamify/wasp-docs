import { NextResponse } from 'next/server';
import { getPublishedNavigationDocs, toFrontendDoc } from '@/app/lib/server/docs-service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const docs = await getPublishedNavigationDocs();

    const categoryOrder = ['GETTING STARTED', 'PLATFORM CONFIGURATION', 'CORE APIS', 'CORE FEATURES', 'RESOURCES'];
    const categoryMap = new Map<string, { name: string; order: number; items: ReturnType<typeof toFrontendDoc>[] }>();

    docs.forEach((doc) => {
      const sectionName = doc.sidebar?.section || doc.category;
      const sectionOrder =
        typeof doc.sidebar?.sectionOrder === 'number'
          ? doc.sidebar.sectionOrder
          : Math.max(categoryOrder.indexOf(sectionName), 0);

      if (!categoryMap.has(sectionName)) {
        categoryMap.set(sectionName, { name: sectionName, order: sectionOrder, items: [] });
      }
      categoryMap.get(sectionName)!.items.push(toFrontendDoc(doc));
    });

    const categories = Array.from(categoryMap.values())
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      .map((c) => ({
        ...c,
        items: c.items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
      }));

    return NextResponse.json({ ok: true, data: { categories } });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to load navigation' }, { status: 500 });
  }
}
