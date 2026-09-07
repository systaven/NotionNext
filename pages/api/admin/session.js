import {
  getClerkEmail,
  getRequestUser,
  getUserRole,
  sendAdminError
} from '@/lib/admin/server'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    const user = await getRequestUser(req)
    const role = await getUserRole(user)
    return res.status(200).json({
      id: user.id,
      fullName: user.fullName || user.username || getClerkEmail(user),
      email: getClerkEmail(user),
      avatar: user.imageUrl,
      role
    })
  } catch (error) {
    return sendAdminError(res, error)
  }
}
