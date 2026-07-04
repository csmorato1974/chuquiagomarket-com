/**
 * WhatsApp helpers. Phones are stored in international format
 * (digits only, no leading +, no spaces, no dashes), e.g. "59171234567".
 */

export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d]/g, '').replace(/^0+/, '');
}

export function isValidPhone(phone: string): boolean {
  return /^[0-9]{8,15}$/.test(phone);
}

export function buildWaUrl(phone: string, message: string): string | null {
  const p = normalizePhone(phone);
  if (!isValidPhone(p)) return null;
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}

export function buildListingMessage(title: string, url?: string): string {
  const base = `Hola, me interesa tu anuncio "${title}" en Chuquiago Market.`;
  return url ? `${base} ${url}` : base;
}

/**
 * Accepts any https URL. Prefers Google Maps hosts but does not hard-reject
 * others (the seller may paste a maps.app.goo.gl short link, etc.).
 * Returns { valid, isGoogle }.
 */
export function validateMapsUrl(url: string): { valid: boolean; isGoogle: boolean } {
  if (!url) return { valid: false, isGoogle: false };
  let u: URL;
  try { u = new URL(url); } catch { return { valid: false, isGoogle: false }; }
  if (u.protocol !== 'https:') return { valid: false, isGoogle: false };
  const isGoogle = /(^|\.)google\.[a-z.]+$/i.test(u.hostname)
    || /(^|\.)goo\.gl$/i.test(u.hostname)
    || /(^|\.)maps\.app\.goo\.gl$/i.test(u.hostname);
  return { valid: true, isGoogle };
}
