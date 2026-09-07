import { createHash, randomBytes } from 'crypto'
import { isExternalHttpLink } from '@/lib/utils/externalLink'
import { siteConfig } from '@/lib/config'

const DEFAULT_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1'
const DEFAULT_PROJECT_ID = '69ca8e510018b435866c'
const DEFAULT_DATABASE_ID = 't2_data'
const DEFAULT_TABLE_ID = 'short_links'
const DEFAULT_SOURCE_TABLE_ID = 'short_link_sources'
const SHORT_CODE_LENGTH = 8
const SHORT_CODE_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const getBlockValue = entry => entry?.value?.value || entry?.value || entry

const getServiceConfig = () => ({
  endpoint:
    process.env.APPWRITE_ENDPOINT ||
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    DEFAULT_ENDPOINT,
  projectId:
    process.env.APPWRITE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
    DEFAULT_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.APPWRITE_DATABASE_ID || DEFAULT_DATABASE_ID,
  tableId: process.env.APPWRITE_SHORT_LINK_TABLE_ID || DEFAULT_TABLE_ID,
  sourceTableId:
    process.env.APPWRITE_SHORT_LINK_SOURCE_TABLE_ID || DEFAULT_SOURCE_TABLE_ID
})

export const isShortLinkServiceConfigured = () =>
  Boolean(getServiceConfig().apiKey)

const normalizeExternalUrl = href => {
  const siteOrigin = siteConfig('LINK') || undefined
  if (!isExternalHttpLink(href, siteOrigin)) return null

  try {
    return new URL(href).toString()
  } catch {
    return null
  }
}

const getTargetHash = href =>
  createHash('sha256').update(href).digest('hex')

const getSourceKey = (postId, targetHash) =>
  createHash('sha256').update(`${postId}:${targetHash}`).digest('hex')

const makeShortCode = () => {
  const bytes = randomBytes(SHORT_CODE_LENGTH)
  return Array.from(bytes, byte =>
    SHORT_CODE_ALPHABET[byte % SHORT_CODE_ALPHABET.length]
  ).join('')
}

const getTablesDb = () => {
  const { Client, TablesDB } = require('node-appwrite')
  const { endpoint, projectId, apiKey } = getServiceConfig()
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  return new TablesDB(client)
}

const findRowByHash = async (tablesDB, targetHash) => {
  const { Query } = require('node-appwrite')
  const { databaseId, tableId } = getServiceConfig()
  const result = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [Query.equal('targetHash', targetHash), Query.limit(1)]
  })

  return result.rows?.[0] || null
}

/**
 * Returns a stable code for an external URL. The unique target hash makes the
 * operation safe when ISR requests try to create the same short link together.
 */
export const getOrCreateShortCode = async href => {
  const targetUrl = normalizeExternalUrl(href)
  if (!targetUrl || !isShortLinkServiceConfigured()) return null

  const tablesDB = getTablesDb()
  const { databaseId, tableId } = getServiceConfig()
  const targetHash = getTargetHash(targetUrl)
  const existing = await findRowByHash(tablesDB, targetHash)
  if (existing?.code) return existing.code

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const row = await tablesDB.createRow({
        databaseId,
        tableId,
        rowId: 'unique()',
        data: {
          code: makeShortCode(),
          targetHash,
          targetUrl
        }
      })
      return row.code
    } catch (error) {
      // Another build/request may have inserted this URL first. Prefer that
      // record instead of emitting a second code.
      const concurrentRow = await findRowByHash(tablesDB, targetHash)
      if (concurrentRow?.code) return concurrentRow.code
      if (attempt === 3) throw error
    }
  }

  return null
}

const visitDecorationLinks = (value, visitor) => {
  if (!Array.isArray(value)) return

  if (value[0] === 'a' && typeof value[1] === 'string') {
    visitor(value)
    return
  }

  value.forEach(item => {
    if (Array.isArray(item)) visitDecorationLinks(item, visitor)
  })
}

export const collectPostExternalUrls = blockMap => {
  const urls = new Set()

  Object.values(blockMap?.block || {}).forEach(entry => {
    const block = getBlockValue(entry)
    if (!block?.properties) return

    if (block.type === 'bookmark') {
      const bookmarkUrl = block.properties.link?.[0]?.[0]
      const normalizedBookmarkUrl = normalizeExternalUrl(bookmarkUrl)
      if (normalizedBookmarkUrl) urls.add(normalizedBookmarkUrl)
    }

    Object.values(block.properties).forEach(property => {
      visitDecorationLinks(property, format => {
        const normalizedUrl = normalizeExternalUrl(format[1])
        if (normalizedUrl) urls.add(normalizedUrl)
      })
    })
  })

  return Array.from(urls)
}

/** Apply generated /r routes to ordinary rich-text links and Bookmark cards. */
export const applyShortLinkRoutes = (blockMap, routes) => {
  if (!routes?.size) return 0
  let rewritten = 0

  const replaceHref = href => {
    const normalizedUrl = normalizeExternalUrl(href)
    return normalizedUrl ? routes.get(normalizedUrl) || href : href
  }

  Object.values(blockMap?.block || {}).forEach(entry => {
    const block = getBlockValue(entry)
    if (!block?.properties) return

    if (block.type === 'bookmark' && block.properties.link?.[0]) {
      const previousHref = block.properties.link[0][0]
      const nextHref = replaceHref(previousHref)
      if (nextHref !== previousHref) {
        block.properties.link[0][0] = nextHref
        rewritten += 1
      }
    }

    Object.values(block.properties).forEach(property => {
      visitDecorationLinks(property, format => {
        const previousHref = format[1]
        const nextHref = replaceHref(previousHref)
        if (nextHref !== previousHref) {
          format[1] = nextHref
          rewritten += 1
        }
      })
    })
  })

  return rewritten
}

const listPostSources = async (tablesDB, postId) => {
  const { Query } = require('node-appwrite')
  const { databaseId, sourceTableId } = getServiceConfig()
  const result = await tablesDB.listRows({
    databaseId,
    tableId: sourceTableId,
    queries: [Query.equal('postId', postId), Query.limit(5000)]
  })
  return result.rows || []
}

const syncPostSources = async (tablesDB, postId, urls) => {
  const { databaseId, sourceTableId } = getServiceConfig()
  const targetHashes = new Set(urls.map(getTargetHash))
  const currentRows = await listPostSources(tablesDB, postId)
  const currentHashes = new Set(currentRows.map(row => row.targetHash))

  await Promise.all(
    currentRows
      .filter(row => !targetHashes.has(row.targetHash))
      .map(row =>
        tablesDB.deleteRow({
          databaseId,
          tableId: sourceTableId,
          rowId: row.$id
        })
      )
  )

  await Promise.all(
    Array.from(targetHashes)
      .filter(targetHash => !currentHashes.has(targetHash))
      .map(targetHash =>
        tablesDB.createRow({
          databaseId,
          tableId: sourceTableId,
          rowId: 'unique()',
          data: {
            postId,
            targetHash,
            sourceKey: getSourceKey(postId, targetHash)
          }
        })
      )
  )
}

/**
 * Called by resolvePostProps, so it runs for production builds, ISR refreshes,
 * and SSR rendering. A missing API key deliberately leaves existing Base64
 * redirect behaviour in place.
 */
export const preparePostShortLinks = async (blockMap, postId) => {
  if (!isShortLinkServiceConfigured() || !postId) return 0

  const urls = collectPostExternalUrls(blockMap)
  const routes = new Map()

  for (const url of urls) {
    const code = await getOrCreateShortCode(url)
    if (code) routes.set(url, `/r/${code}`)
  }

  // This source set is what makes a no-longer-used code expire after a Notion
  // article changes, while still allowing another article to reuse the code.
  await syncPostSources(getTablesDb(), postId, urls)

  return applyShortLinkRoutes(blockMap, routes)
}

export const findShortLinkTarget = async code => {
  if (!/^[A-Za-z0-9]{8}$/.test(code || '') || !isShortLinkServiceConfigured()) {
    return null
  }

  const { Query } = require('node-appwrite')
  const tablesDB = getTablesDb()
  const { databaseId, tableId } = getServiceConfig()
  const result = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [Query.equal('code', code), Query.limit(1)]
  })
  const row = result.rows?.[0]
  if (!row?.targetHash) return null

  const sourceResult = await tablesDB.listRows({
    databaseId,
    tableId: getServiceConfig().sourceTableId,
    queries: [Query.equal('targetHash', row.targetHash), Query.limit(1)]
  })
  if (!sourceResult.rows?.length) return null

  const targetUrl = row.targetUrl
  return normalizeExternalUrl(targetUrl)
}
