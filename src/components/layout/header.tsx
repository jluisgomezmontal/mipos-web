"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { user, tenant, logout } = useAuthStore()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const handleLogout = () => {
    logout()
    // Usar window.location para forzar recarga completa
    window.location.href = '/login'
  }

  const getInitials = () => {
    if (!user) return 'U'
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      OWNER: 'Propietario',
      ADMIN: 'Administrador',
      CASHIER: 'Cajero',
    }
    return roles[role] || role
  }

  const currentTheme = resolvedTheme || theme || 'light'
  const logoSrc = currentTheme !== 'dark' ? '/images/icon d.png' : '/images/icon.png'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
        <div className="flex-1 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-1 md:hidden group">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src={logoSrc}
                alt="MiPOS Logo"
                width={32}
                height={32}
                className="object-contain transition-transform group-hover:scale-110"
                priority
              />
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-foreground">i</span>
              <span className="text-lg font-bold text-primary ml-0.5">POS</span>
            </div>
          </Link>
          <h1 className="text-lg font-medium text-muted-foreground hidden md:block">
            {tenant?.name || 'Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {user && getRoleName(user.role)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
