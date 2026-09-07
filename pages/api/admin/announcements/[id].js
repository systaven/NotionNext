import {
  getAdminConfig,
  getAdminDb,
  requireAdmin,
  sendAdminError
} from '@/lib/admin/server'

const mapRow = row => ({ id: row.$id, ...row })

export default async function handler(req, res) {
  const id = req.query.id
  if (typeof id !== 'string')
    return res.status(400).json({ error: 'Invalid announcement id' })
  try {
    await requireAdmin(req)
    const db = getAdminDb()
    const service = getAdminConfig()
    if (req.method === 'GET') {
      const row = await db.getRow({
        databaseId: service.databaseId,
        tableId: service.announcementsTableId,
        rowId: id
      })
      return res.status(200).json({ data: mapRow(row) })
    }
    if (req.method === 'PUT') {
      const { title, content, published } = req.body || {}
      const data = {}
      if (typeof title === 'string') data.title = title.trim().slice(0, 255)
      if (typeof content === 'string') data.content = content.slice(0, 16000)
      if (typeof published === 'boolean') data.published = published
      const row = await db.updateRow({
        databaseId: service.databaseId,
        tableId: service.announcementsTableId,
        rowId: id,
        data
      })
      return res.status(200).json({ data: mapRow(row) })
    }
    if (req.method === 'DELETE') {
      await db.deleteRow({
        databaseId: service.databaseId,
        tableId: service.announcementsTableId,
        rowId: id
      })
      return res.status(200).json({ data: { id } })
    }
    return res.status(405).end()
  } catch (error) {
    return sendAdminError(res, error)
  }
}
