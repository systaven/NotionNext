import { UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

/**
 * Keeps Clerk's native avatar menu intact and adds the admin link only after
 * the server has confirmed the current user's Appwrite-backed role.
 */
export default function AdminUserButton({ afterSignOutUrl = '/' }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/admin/session', { credentials: 'same-origin' })
      .then(response => (response.ok ? response.json() : null))
      .then(session => {
        if (active) setIsAdmin(session?.role === 'admin')
      })
      .catch(() => {
        // The normal Clerk menu must remain usable if the admin service is
        // still being configured or temporarily unavailable.
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <UserButton afterSignOutUrl={afterSignOutUrl}>
      {isAdmin && (
        <UserButton.MenuItems>
          <UserButton.Link
            href='/admin'
            label='进入管理后台'
            labelIcon={<span aria-hidden='true'>⌘</span>}
          />
        </UserButton.MenuItems>
      )}
    </UserButton>
  )
}
