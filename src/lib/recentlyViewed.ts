const KEY = "recentlyViewed";

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(KEY);

  return data ? JSON.parse(data) : [];
}

export function addRecentlyViewed(id: string) {
  if (typeof window === "undefined") return;

  let items = getRecentlyViewed();

  items = items.filter((item) => item !== id);

  items.unshift(id);

  if (items.length > 10) {
    items = items.slice(0, 10);
  }

  localStorage.setItem(KEY, JSON.stringify(items));
}