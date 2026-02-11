"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
      {children}
    </ProtectedRoute>
  )
}
