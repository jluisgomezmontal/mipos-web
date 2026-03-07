"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search, Building2, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { tenantService } from '@/services/tenant.service'
import { TenantListItem } from '@/types/tenant'
import { getErrorMessage } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TenantsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const currentUser = useAuthStore((state) => state.user)
  const [tenants, setTenants] = useState<TenantListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPlan, setSelectedPlan] = useState<string>('all')

  useEffect(() => {
    if (currentUser?.role !== 'SUPERUSER') {
      toast({
        variant: 'destructive',
        title: 'Acceso Denegado',
        description: 'Solo los SUPERUSER pueden acceder a esta página.',
      })
      router.push('/dashboard')
      return
    }
    loadTenants()
  }, [selectedStatus, selectedPlan, currentUser, router, toast])

  const loadTenants = async () => {
    try {
      setIsLoading(true)
      const filters: any = {}

      if (selectedStatus !== 'all') {
        filters.isActive = selectedStatus
      }

      if (selectedPlan !== 'all') {
        filters.plan = selectedPlan
      }

      const { tenants: tenantList } = await tenantService.getTenants(filters)
      setTenants(tenantList || [])
    } catch (error) {
      console.error('Error al cargar tenants:', error)
      setTenants([])
      toast({
        variant: 'destructive',
        title: 'Error al cargar tenants',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTenants = tenants.filter((tenant) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      tenant.name.toLowerCase().includes(searchLower) ||
      tenant.businessName.toLowerCase().includes(searchLower) ||
      tenant.email.toLowerCase().includes(searchLower)
    )
  })

  const getPlanBadgeVariant = (plan?: string) => {
    switch (plan) {
      case 'ENTERPRISE':
        return 'default'
      case 'PREMIUM':
        return 'secondary'
      case 'BASIC':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getPlanLabel = (plan?: string) => {
    switch (plan) {
      case 'ENTERPRISE':
        return 'Enterprise'
      case 'PREMIUM':
        return 'Premium'
      case 'BASIC':
        return 'Básico'
      case 'FREE':
        return 'Gratis'
      default:
        return 'N/A'
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">
            Gestiona todos los negocios registrados en el sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Listado de Tenants</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Todos los planes</option>
                <option value="FREE">Gratis</option>
                <option value="BASIC">Básico</option>
                <option value="PREMIUM">Premium</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTenants.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="text-muted-foreground mt-4">
                <p className="text-lg font-medium">
                  No se encontraron tenants
                </p>
                <p className="text-sm mt-2">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'No hay tenants registrados en el sistema'}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Negocio</TableHead>
                    <TableHead>Correo Electrónico</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {tenant.isActive ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-medium">{tenant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {tenant.businessName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(tenant.subscription?.plan)}>
                          {getPlanLabel(tenant.subscription?.plan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tenant.isActive ? 'default' : 'destructive'}>
                          {tenant.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tenant.owner ? (
                          <div>
                            <div className="font-medium text-sm">
                              {tenant.owner.firstName} {tenant.owner.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tenant.owner.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(tenant.createdAt), 'dd MMM yyyy', {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/tenants/${tenant._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
