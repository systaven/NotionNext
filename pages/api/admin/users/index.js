import { clerkClient } from '@clerk/nextjs/server'
import {
  getClerkEmail,
  getRolesForUsers,
  requireAdmin,
  sendAdminError
} from '@/lib/admin/server'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    await requireAdmin(req)
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)
    const offset = Math.max(Number(req.query.offset) || 0, 0)
    const result = await clerkClient.users.getUserList({
      limit,
      offset,
      orderBy: '-created_at'
    })
    const roles = await getRolesForUsers(result.data)
    const users = result.data.map(user => ({
      id: user.id,
      name: user.fullName || user.username || getClerkEmail(user),
      email: getClerkEmail(user),
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      role: roles.get(user.id)
    }))
    return res.status(200).json({ data: users, total: result.totalCount })
  } catch (error) {
    return sendAdminError(res, error)
  }
}
