import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'avatars';
const SIGN_TTL_SECONDS = 60 * 60; // 1h
export const MAX_AVATAR_BYTES = 3 * 1024 * 1024; // 3 MB
export const ACCEPTED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function validateAvatarFile(file: File): { ok: boolean; error?: string } {
  if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
    return { ok: false, error: 'Formato no permitido. Usa PNG, JPG o WEBP.' };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { ok: false, error: 'La imagen supera 3 MB.' };
  }
  return { ok: true };
}

function extFromType(type: string): string {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return 'jpg';
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const path = `${userId}/${Date.now()}.${extFromType(file.type)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: '3600',
  });
  if (error) throw error;
  return path;
}

export async function getAvatarSignedUrl(pathOrNull: string | null | undefined): Promise<string | null> {
  if (!pathOrNull) return null;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(pathOrNull, SIGN_TTL_SECONDS);
  return data?.signedUrl ?? null;
}

export async function removeAvatar(path: string): Promise<void> {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
