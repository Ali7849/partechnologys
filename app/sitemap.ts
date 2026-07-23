import type { MetadataRoute } from 'next';

const BASE = 'https://partechnologys.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Only routes that actually exist are listed. Additional routes join the sitemap as they
  // are built — a sitemap that lists pages which 404 is a broken promise.
  return [{ url: `${BASE}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 }];
}
