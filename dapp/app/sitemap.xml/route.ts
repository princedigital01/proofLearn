import { NextRequest } from 'next/server'
import { navLinks } from '@/constants'
import Course from '@/models/course/Course'
import { connectDB } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

const baseUrl = 'https://proof-learn-e.vercel.app'

export async function GET(req: NextRequest) {
  await connectDB()

  const courses = await Course.find().select('_id updatedAt').lean()
  const staticRoutes = navLinks.map((route) => `
    <url>
      <loc>${baseUrl}${route.href}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`).join('')

  const courseRoutes = courses.map((course) => `
    <url>
      <loc>${baseUrl}/courses/${course._id}</loc>
      <lastmod>${new Date(course.updatedAt).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticRoutes}
      ${courseRoutes}
    </urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
