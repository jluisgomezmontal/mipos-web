"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  BarChart3,
  Settings,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Calculator,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['OWNER', 'ADMIN', 'CASHIER', 'SUPERUSER'],
  },
  {
    title: 'Ventas',
    href: '/dashboard/ventas',
    icon: ShoppingCart,
    roles: ['OWNER', 'ADMIN', 'CASHIER', 'SUPERUSER'],
  },
  {
    title: 'Corte de Caja',
    href: '/dashboard/corte-caja',
    icon: Calculator,
    roles: ['OWNER', 'ADMIN', 'CASHIER', 'SUPERUSER'],
  },
  {
    title: 'Inventario',
    href: '/dashboard/inventario',
    icon: Store,
    roles: ['OWNER', 'ADMIN', 'SUPERUSER'],
  },
  {
    title: 'Productos',
    href: '/dashboard/productos',
    icon: Package,
    roles: ['OWNER', 'ADMIN', 'SUPERUSER'],
  },
  {
    title: 'Sucursales',
    href: '/dashboard/sucursales',
    icon: MapPin,
    roles: ['OWNER', 'SUPERUSER'],
  },
  {
    title: 'Reportes',
    href: '/dashboard/reportes',
    icon: BarChart3,
    roles: ['OWNER', 'ADMIN', 'SUPERUSER'],
  },
  {
    title: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: Users,
    roles: ['OWNER', 'SUPERUSER'],
  },
  {
    title: 'Administrar Negocios',
    href: '/dashboard/administrar-negocios',
    icon: Building2,
    roles: ['SUPERUSER'],
  },
  {
    title: 'Tenants',
    href: '/dashboard/tenants',
    icon: Building2,
    roles: ['SUPERUSER'],
  },
  {
    title: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
    roles: ['OWNER', 'SUPERUSER'],
  },
]

interface SidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  console.log(User);
  const { theme, resolvedTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  )

  const currentTheme = resolvedTheme || theme || 'light'
  const logoSrc = currentTheme !== 'dark' ? '/images/icon d.png' : '/images/icon.png'

  const SidebarContent = () => (
    <>
      <div className={cn(
        " transition-all duration-300",
        isCollapsed ? "p-4" : "p-6"
      )}>
        <Link 
          href="/dashboard" 
          className={cn(
            "flex items-center group",
            isCollapsed ? "justify-center gap-0" : "gap-1"
          )}
          onClick={() => onOpenChange?.(false)}
        >
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={logoSrc}
              alt="MiPOS Logo"
              width={40}
              height={40}
              className="object-contain transition-transform group-hover:scale-110"
              priority
            />
          </div>
          <div className={cn(
            "flex items-baseline gap-1 overflow-hidden transition-all duration-300",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <span className="text-xl font-bold text-foreground whitespace-nowrap">i</span>
            <span className="text-xl font-bold text-primary ml-0.5 whitespace-nowrap">POS</span>
          </div>
        </Link>
      </div>

      <nav className={cn(
        "flex-1 space-y-1 transition-all duration-300",
        isCollapsed ? "px-2 py-4" : "px-4 py-4"
      )}>
        <TooltipProvider delayDuration={0}>
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                  isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-3 py-2',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => onOpenChange?.(false)}
              >
                <Icon className={cn(
                  "flex-shrink-0 transition-all",
                  isCollapsed ? "h-5 w-5" : "h-5 w-5"
                )} />
                <span className={cn(
                  "overflow-hidden transition-all duration-300 whitespace-nowrap",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  {item.title}
                </span>
              </Link>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return linkContent
          })}
        </TooltipProvider>
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menú de navegación</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
        <div className={cn(
          "border-t p-2 transition-all duration-300",
          isCollapsed ? "flex justify-center" : "flex justify-end"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-9 w-9 transition-transform hover:scale-110"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            </span>
          </Button>
        </div>
      </aside>
    </>
  )
}
