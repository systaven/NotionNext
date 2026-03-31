import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'

/**
 * IndexNow API 路由
 * GET  /{key}.txt  -> 返回 IndexNow 密钥文件内容（由 next.config.js rewrite 转发至此）
 * POST /api/indexnow -> 提交 URL 列表到 IndexNow
 * @see https://www.indexnow.org
 */
export default async function handler(req, res) {
  const key = siteConfig('INDEXNOW_KEY', '', BLOG)

  if (!key) {
    return res.status(404).json({ message: 'IndexNow not configured. Set NEXT_PUBLIC_INDEXNOW_KEY.' })
  }

  // GET: 返回密钥验证文件（纯文本，供搜索引擎验证）
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/plain')
    return res.status(200).send(key)
  }

  // POST: 提交 URL 列表到 IndexNow API
  if (req.method === 'POST') {
    const host = siteConfig('INDEXNOW_HOST', '', BLOG)

    if (!host) {
      return res.status(400).json({ message: 'IndexNow not configured. Set NEXT_PUBLIC_INDEXNOW_HOST.' })
    }

    const urlList = req.body?.urlList

    if (!urlList || !Array.isArray(urlList) || urlList.length === 0) {
      return res.status(400).json({ message: 'urlList is required and must be a non-empty array.' })
    }

    const keyLocation = `https://${host}/${key}.txt`
    const MAX_URLS = 10000

    // 过滤出属于当前 host 的有效 URL（字符串格式）
    const validUrls = urlList.filter(
      url =>
        typeof url === 'string' &&
        (url.startsWith(`https://${host}/`) || url.startsWith(`http://${host}/`))
    )

    if (validUrls.length === 0) {
      return res.status(400).json({ message: 'No valid URLs found for the configured host.' })
    }

    // 分批提交（IndexNow 单次最多 10000 个 URL）
    const results = []
    for (let i = 0; i < validUrls.length; i += MAX_URLS) {
      const batchIndex = Math.floor(i / MAX_URLS) + 1
      const chunk = validUrls.slice(i, i + MAX_URLS)
      try {
        const response = await fetch('https://api.indexnow.org/IndexNow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ host, key, keyLocation, urlList: chunk })
        })
        if (response.ok || response.status === 202) {
          results.push({ batch: batchIndex, status: response.status, count: chunk.length })
        } else {
          const body = await response.text()
          results.push({ batch: batchIndex, status: response.status, count: chunk.length, error: body })
        }
      } catch (error) {
        results.push({
          batch: batchIndex,
          error: `Batch ${batchIndex} fetch to https://api.indexnow.org/IndexNow failed: ${error.message}`,
          count: chunk.length
        })
      }
    }

    return res.status(200).json({ message: 'IndexNow submission complete', submitted: validUrls.length, results })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
