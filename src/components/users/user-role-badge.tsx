"use client"

import { Badge } from '@/components/ui/badge'
import { UserRole } from '@/types/auth'
import { ROLE_LABELS } from '@/types/user'

interface UserRoleBadgeProps {
  role: UserRole
  className?: string
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const variants: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
    OWNER: 'default',
    ADMIN: 'secondary',
    CASHIER: 'outline',
    SUPERUSER: 'default',
  }

  return (
    <Badge variant={variants[role]} className={className}>
      {ROLE_LABELS[role]}
    </Badge>
  )
}
