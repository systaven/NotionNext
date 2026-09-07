import { findShortLinkTarget } from '@/lib/shortLink/server'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = typeof req.query?.token === 'string' ? req.query.token : ''
  const target = await findShortLinkTarget(token)
  if (!target) return res.status(404).json({ error: 'Not found' })

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  return res.status(200).json({ url: target })
}
