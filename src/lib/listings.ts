import { supabase } from '@/integrations/supabase/client';
import { Product, ListingStatus, Condition, DeliveryMethod } from '@/types/marketplace';

const SIGN_TTL_SECONDS = 60 * 60; // 1h

/** Normalize any legacy full URL into just the storage path. */
export function toStoragePath(value: string): string {
  const m = value.match(/\/listing-images\/(.+)$/);
  return m ? m[1] : value;
}

/** Sign a single storage path in the listing-images bucket. Returns placeholder on failure. */
export async function signedImageUrl(pathOrUrl: string): Promise<string> {
  if (!pathOrUrl) return '/placeholder.svg';
  const path = toStoragePath(pathOrUrl);
  const { data } = await supabase.storage.from('listing-images').createSignedUrl(path, SIGN_TTL_SECONDS);
  return data?.signedUrl ?? '/placeholder.svg';
}

async function signMany(paths: string[]): Promise<string[]> {
  if (paths.length === 0) return [];
  const normalized = paths.map(toStoragePath);
  const { data } = await supabase.storage.from('listing-images').createSignedUrls(normalized, SIGN_TTL_SECONDS);
  return normalized.map((_, i) => data?.[i]?.signedUrl ?? '/placeholder.svg');
}

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

function baseMap(row: Row, images: string[]): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    price: Number(row.price_bs),
    category: row.categories?.slug ?? 'otros',
    images: images.length > 0 ? images : ['/placeholder.svg'],
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

async function mapListing(row: Row): Promise<Product> {
  const paths = (row.listing_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.path);
  const all = paths.length > 0 ? paths : row.cover_image_url ? [row.cover_image_url] : [];
  const signed = await signMany(all);
  return baseMap(row, signed);
}

const SELECT = `
  id, seller_id, title, description, price_bs, zone, condition,
  delivery_methods, status, cover_image_url, rejection_reason,
  published_at, created_at, category_id,
  categories:category_id ( slug, name ),
  listing_images ( path, sort_order )
`;

async function hydrateSellers(rows: Row[]): Promise<Row[]> {
  const ids = Array.from(new Set(rows.map((r) => r.seller_id)));
  if (ids.length === 0) return rows;
  const [{ data: profs }, { data: verifs }] = await Promise.all([
    supabase.from('profiles').select('id, display_name').in('id', ids),
    supabase.from('seller_verifications').select('user_id, status').in('user_id', ids),
  ]);
  const pMap = new Map((profs ?? []).map((p: { id: string; display_name: string }) => [p.id, p.display_name]));
  const vMap = new Map((verifs ?? []).map((v: { user_id: string; status: string }) => [v.user_id, v.status]));
  return rows.map((r) => ({
    ...r,
    profiles: pMap.has(r.seller_id) ? { display_name: pMap.get(r.seller_id) as string } : null,
    seller_verifications: vMap.has(r.seller_id) ? { status: vMap.get(r.seller_id) as string } : null,
  }));
}

export async function fetchPublishedListings(opts: { search?: string; categorySlug?: string | null; limit?: number } = {}) {
  let q = supabase.from('listings').select(SELECT).eq('status', 'published').order('published_at', { ascending: false });
  if (opts.search) q = q.ilike('title', `%${opts.search}%`);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  let rows = (data as unknown as Row[]) ?? [];
  if (opts.categorySlug) rows = rows.filter((r) => r.categories?.slug === opts.categorySlug);
  rows = await hydrateSellers(rows);
  return Promise.all(rows.map(mapListing));
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabase.from('listings').select(SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [row] = await hydrateSellers([data as unknown as Row]);
  return mapListing(row);
}

export async function fetchMyListings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('listings').select(SELECT).eq('seller_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  const rows = await hydrateSellers((data as unknown as Row[]) ?? []);
  return Promise.all(rows.map(mapListing));
}
