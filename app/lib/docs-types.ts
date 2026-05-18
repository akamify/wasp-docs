export type Doc = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
  category: string;
  order: number;
  status: 'draft' | 'published';
  sidebar?: {
    section: string;
    sectionOrder?: number;
    itemOrder?: number;
    parentSlug?: string | null;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type FrontendDoc = Pick<
  Doc,
  'id' | 'title' | 'description' | 'category' | 'slug' | 'content' | 'keywords' | 'order'
>;
