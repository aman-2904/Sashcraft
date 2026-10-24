export const WISHLIST_KEY = 'sashcraft_wishlist';
export const WISHLIST_UPDATED_EVENT = 'sashcraft_wishlist_updated';

export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : ['satinsashes', 'velvetsashes']; // initial default favorites
  } catch {
    return [];
  }
}

export function isWishlisted(slug: string): boolean {
  const list = getWishlist();
  return list.includes(slug);
}

export function toggleWishlist(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  const list = getWishlist();
  let updated: string[];
  const wasPresent = list.includes(slug);

  if (wasPresent) {
    updated = list.filter((s) => s !== slug);
  } else {
    updated = [...list, slug];
  }

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Failed to update wishlist:', e);
  }

  return !wasPresent;
}
