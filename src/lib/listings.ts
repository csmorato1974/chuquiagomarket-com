import { supabase } from '@/integrations/supabase/client';
import { Product, ListingStatus, Condition, DeliveryMethod } from '@/types/marketplace';

export const publicImageUrl = (path: string) =>
  supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl;

type Row = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price_bs: number;
  zone: string | null;
  condition: Condition;
  delivery_methods: string[];
  status: ListingStatus;
  cover_image_url: string | null;
  rejection_reason: string | null;
  published_at: string | null;
  created_at: string;
  category_id: string | null;
  categories?: { slug: string; name: string } | null;
  listing_images?: { path: string; sort_order: number }[];
  profiles?: { display_name: string } | null;
  seller_verifications?: { status: string } | null;
};

export function mapListing(row: Row): Product {
  const images = (row.listing_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => publicImageUrl(i.path));
  const cover = row.cover_image_url ? [row.cover_image_url] : [];
  const imgs = images.length > 0 ? images : cover.length > 0 ? cover : ['/placeholder.svg'];
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    price: Number(row.price_bs),
    category: row.categories?.slug ?? 'otros',
    images: imgs,
    sellerId: row.seller_id,
    sellerName: row.profiles?.display_name || 'Vendedor',
    sellerVerified: row.seller_verifications?.status === 'verified',
    createdAt: new Date(row.created_at),
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    location: row.zone ?? 'La Paz',
    condition: row.condition,
    deliveryMethods: row.delivery_methods as DeliveryMethod[],
    status: row.status,
    rejectionReason: row.rejection_reason ?? undefined,
  };
}

const SELECT = `
  id, seller_id, title, description, price_bs, zone, condition,
  delivery_methods, status, cover_image_url, rejection_reason,
  published_at, created_at, category_id,
  categories:category_id ( slug, name ),
  listing_images ( path, sort_order ),
  profiles:seller_id ( display_name ),
  seller_verifications:seller_id ( status )
`;

export async function fetchPublishedListings(opts: { search?: string; categorySlug?: string | null; limit?: number } = {}) {
  let q = supabase.from('listings').select(SELECT).eq('status', 'published').order('published_at', { ascending: false });
  if (opts.search) q = q.ilike('title', `%${opts.search}%`);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  let rows = (data as unknown as Row[]) ?? [];
  if (opts.categorySlug) rows = rows.filter((r) => r.categories?.slug === opts.categorySlug);
  return rows.map(mapListing);
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabase.from('listings').select(SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? mapListing(data as unknown as Row) : null;
}

export async function fetchMyListings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('listings').select(SELECT).eq('seller_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return ((data as unknown as Row[]) ?? []).map(mapListing);
}
