"use client"

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2, Eye, Search } from 'lucide-react'
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
import { useAuthStore } from '@/store/auth.store'
import { saleService } from '@/services/sale.service'
import { Sale, SaleStatus } from '@/types/sale'
import { getErrorMessage } from '@/lib/api-client'

export default function SalesHistoryPage() {
  const { toast } = useToast()
  const { tenant } = useAuthStore()
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadSales()
  }, [currentPage])

  const loadSales = async () => {
    try {
      setIsLoading(true)
      const { sales: salesData, pagination } = await saleService.getSales({
        page: currentPage,
        limit: 20,
      })
      setSales(salesData)
      
      if (pagination) {
        setTotalPages(Math.ceil(pagination.total / pagination.limit))
      } else {
        setTotalPages(1)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar ventas',
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

  const getStatusBadge = (status: SaleStatus) => {
    const statusConfig = {
      PAID: { label: 'Pagada', variant: 'default' as const },
      PENDING: { label: 'Pendiente', variant: 'secondary' as const },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' as const },
    }

    const config = statusConfig[status] || statusConfig.PENDING

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredSales = sales.filter((sale) =>
    sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold tracking-tight">Historial de Ventas</h1>
          <p className="text-muted-foreground">
            Consulta y administra todas las ventas realizadas
          </p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard/ventas'}>
          Nueva Venta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ventas Registradas</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por número de venta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No se encontraron ventas</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell className="font-medium">
                          {sale.saleNumber}
                        </TableCell>
                        <TableCell>
                          {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm', {
                            locale: es,
                          })}
                        </TableCell>
                        <TableCell>
                          {sale.items.length} producto{sale.items.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(sale.total)}
                        </TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Aquí podrías abrir un modal con los detalles
                              toast({
                                title: 'Detalles de venta',
                                description: `Venta #${sale.saleNumber}`,
                              })
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
