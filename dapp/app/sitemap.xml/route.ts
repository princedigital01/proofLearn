// app/sitemap.xml/route.ts
import { type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic' // needed for App Router

const baseUrl = 'https://prooflearn.com'; // ✅ Replace with your actual domain

export async function GET(req: NextRequest) {
  const routes = [
    '',
    '/about',
    '/dashboard',
    '/verify',
    '/courses',
    '/certificates',
  ];

  const urls = routes.map(
    (route) => `
      <url>
        <loc>${baseUrl}${route}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`
  ).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    >
      ${urls}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
