"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp, DollarSign, ShoppingCart, TrendingUp, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SalesByUserViewProps {
  data: {
    users: Array<{
      userId: string
      userName: string
      userEmail: string
      totalSales: number
      totalRevenue: number
      totalDiscount: number
      totalTax: number
      averageTicket: number
      sales: Array<{
        _id: string
        saleNumber: string
        total: number
        discount: number
        taxAmount: number
        status: string
        branchName: string
        branchCode: string
        itemsCount: number
        createdAt: string
      }>
    }>
    summary: {
      totalUsers: number
      totalSales: number
      totalRevenue: number
      averageRevenuePerUser: number
    }
  }
}

export function SalesByUserView({ data }: SalesByUserViewProps) {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())

  const toggleUser = (userId: string) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
      PAID: { label: 'Pagada', variant: 'default' },
      PENDING: { label: 'Pendiente', variant: 'secondary' },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' },
    }
    const statusInfo = statusMap[status] || { label: status, variant: 'secondary' as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios con ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Ventas totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Ingresos generados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Usuario</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.summary.averageRevenuePerUser)}</div>
            <p className="text-xs text-muted-foreground">
              Ingreso promedio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalle por Usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Ventas por Usuario</CardTitle>
          <CardDescription>
            Haz clic en un usuario para ver el detalle de sus ventas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.users.map((user) => (
              <Collapsible
                key={user.userId}
                open={expandedUsers.has(user.userId)}
                onOpenChange={() => toggleUser(user.userId)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <div className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{user.userName}</CardTitle>
                              <CardDescription className="text-sm">{user.userEmail}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm font-medium">{user.totalSales} ventas</p>
                              <p className="text-xs text-muted-foreground">
                                Ticket promedio: {formatCurrency(user.averageTicket)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {formatCurrency(user.totalRevenue)}
                              </p>
                              <p className="text-xs text-muted-foreground">Total vendido</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              {expandedUsers.has(user.userId) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Número</TableHead>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Sucursal</TableHead>
                              <TableHead className="text-center">Items</TableHead>
                              <TableHead className="text-right">Descuento</TableHead>
                              <TableHead className="text-right">IVA</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                              <TableHead className="text-center">Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {user.sales.map((sale) => (
                              <TableRow key={sale._id}>
                                <TableCell className="font-medium">
                                  {sale.saleNumber}
                                </TableCell>
                                <TableCell>
                                  {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{sale.branchName}</p>
                                    <p className="text-xs text-muted-foreground">{sale.branchCode}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  {sale.itemsCount}
                                </TableCell>
                                <TableCell className="text-right">
                                  {sale.discount > 0 ? (
                                    <span className="text-destructive">
                                      -{formatCurrency(sale.discount)}
                                    </span>
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(sale.taxAmount)}
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                  {formatCurrency(sale.total)}
                                </TableCell>
                                <TableCell className="text-center">
                                  {getStatusBadge(sale.status)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Resumen del Usuario */}
                      <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Ventas</p>
                          <p className="text-lg font-bold">{user.totalSales}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Descuentos Aplicados</p>
                          <p className="text-lg font-bold text-destructive">
                            {formatCurrency(user.totalDiscount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">IVA Cobrado</p>
                          <p className="text-lg font-bold">{formatCurrency(user.totalTax)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}

            {data.users.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay datos de ventas por usuario</p>
                <p className="text-sm mt-2">
                  Ajusta los filtros para ver información
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
