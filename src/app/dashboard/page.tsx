"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, DollarSign, Loader2 } from 'lucide-react'
import { dashboardService } from '@/services/dashboard.service'
import { DashboardStats } from '@/types/dashboard'
import { getErrorMessage } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const { user, tenant } = useAuthStore()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)
      const data = await dashboardService.getDashboardStats()
      setStats(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar estadísticas',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: tenant?.settings?.currency || 'MXN',
    }).format(amount)
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      OWNER: 'Propietario',
      ADMIN: 'Administrador',
      CASHIER: 'Cajero',
    }
    return roles[role] || role
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta, {user?.firstName} {user?.lastName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.today.sales : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ventas realizadas hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.today.revenue) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              en ventas de hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.thisMonth.sales : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ventas este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.thisMonth.revenue) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              ingresos mensuales
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
            <CardDescription>
              Detalles de tu cuenta y negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Negocio</p>
                <p className="text-lg font-semibold">{tenant?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Razón Social</p>
                <p className="text-lg font-semibold">{tenant?.businessName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{tenant?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tu Rol</p>
                <p className="text-lg font-semibold">{user && getRoleName(user.role)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
            <CardDescription>
              Acciones frecuentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/ventas"
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Nueva Venta</p>
                <p className="text-xs text-muted-foreground">
                  Abrir punto de venta
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/ventas/historial"
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Ver Ventas</p>
                <p className="text-xs text-muted-foreground">
                  Historial de ventas
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
