"use client"

import { useState, useEffect } from 'react'
import { Loader2, User, MapPin, Calendar, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { cashRegisterService } from '@/services/cashRegister.service'
import { getErrorMessage } from '@/lib/api-client'
import type { ClosingDetailResponse } from '@/types/cash-register'

interface ClosingDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  closingId: string
}

export function ClosingDetailDialog({ open, onOpenChange, closingId }: ClosingDetailDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [detail, setDetail] = useState<ClosingDetailResponse | null>(null)

  useEffect(() => {
    if (open && closingId) {
      loadDetail()
    }
  }, [open, closingId])

  const loadDetail = async () => {
    try {
      setIsLoading(true)
      const response = await cashRegisterService.getClosingById(closingId)
      if (response.data) {
        setDetail(response.data)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar detalle',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDifferenceIcon = (difference: number) => {
    if (difference === 0) {
      return <Minus className="h-5 w-5 text-green-600" />
    } else if (difference > 0) {
      return <TrendingUp className="h-5 w-5 text-yellow-600" />
    } else {
      return <TrendingDown className="h-5 w-5 text-red-600" />
    }
  }

  const getDifferenceColor = (difference: number) => {
    if (difference === 0) return 'text-green-600'
    if (difference > 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Corte de Caja</DialogTitle>
          <DialogDescription>
            Información completa del turno y transacciones
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : detail ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Número de Corte</p>
                    <p className="font-semibold">{detail.closing.closingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estado</p>
                    <Badge variant={detail.closing.status === 'OPEN' ? 'default' : 'secondary'}>
                      {detail.closing.status === 'OPEN' ? 'ABIERTO' : 'CERRADO'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cajero</p>
                      <p className="font-medium">
                        {detail.closing.cashierId.firstName} {detail.closing.cashierId.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{detail.closing.cashierId.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sucursal</p>
                      <p className="font-medium">{detail.closing.branchId.name}</p>
                      <p className="text-xs text-muted-foreground">{detail.closing.branchId.code}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Apertura</p>
                      <p className="font-medium">{formatDate(detail.closing.openedAt)}</p>
                    </div>
                  </div>
                  {detail.closing.closedAt && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Cierre</p>
                        <p className="font-medium">{formatDate(detail.closing.closedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {detail.closing.closedBy && 
                 detail.closing.closedBy._id !== detail.closing.cashierId._id && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                      <User className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Cerrado por</p>
                        <p className="font-medium">
                          {detail.closing.closedBy.firstName} {detail.closing.closedBy.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{detail.closing.closedBy.email}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Ventas</p>
                    <p className="text-2xl font-bold">{detail.closing.sales.totalSales || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ingresos Totales</p>
                    <p className="text-2xl font-bold">{formatCurrency(detail.closing.sales.totalRevenue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ticket Promedio</p>
                    <p className="text-2xl font-bold">{formatCurrency(detail.closing.sales.averageTicket || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Efectivo</p>
                      <p className="text-sm text-muted-foreground">
                        {detail.closing.payments.cash.count} transacciones
                      </p>
                    </div>
                    <p className="text-xl font-bold">{formatCurrency(detail.closing.payments.cash.amount)}</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Tarjeta</p>
                      <p className="text-sm text-muted-foreground">
                        {detail.closing.payments.card.count} transacciones
                      </p>
                    </div>
                    <p className="text-xl font-bold">{formatCurrency(detail.closing.payments.card.amount)}</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Transferencia</p>
                      <p className="text-sm text-muted-foreground">
                        {detail.closing.payments.transfer.count} transacciones
                      </p>
                    </div>
                    <p className="text-xl font-bold">{formatCurrency(detail.closing.payments.transfer.amount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {detail.closing.withdrawals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Retiros de Efectivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {detail.closing.withdrawals.map((withdrawal, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{withdrawal.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(withdrawal.withdrawnAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Por: {withdrawal.withdrawnBy.firstName} {withdrawal.withdrawnBy.lastName}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-destructive">-{formatCurrency(withdrawal.amount)}</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold">Total Retiros</span>
                      <span className="text-xl font-bold text-destructive">
                        -{formatCurrency(detail.closing.totalWithdrawals)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {detail.closing.status === 'CLOSED' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen de Efectivo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Efectivo Inicial</span>
                      <span className="font-medium">{formatCurrency(detail.closing.initialCash)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">+ Ventas en Efectivo</span>
                      <span className="font-medium">{formatCurrency(detail.closing.payments.cash.amount)}</span>
                    </div>
                    {detail.closing.totalWithdrawals > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">- Retiros</span>
                        <span className="font-medium text-destructive">
                          {formatCurrency(detail.closing.totalWithdrawals)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Efectivo Esperado</span>
                      <span className="text-lg font-bold">{formatCurrency(detail.closing.expectedCash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Efectivo Final Contado</span>
                      <span className="text-lg font-bold">{formatCurrency(detail.closing.finalCash || 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getDifferenceIcon(detail.closing.difference)}
                        <span className="font-semibold text-lg">Diferencia</span>
                      </div>
                      <span className={`text-2xl font-bold ${getDifferenceColor(detail.closing.difference)}`}>
                        {detail.closing.difference > 0 ? '+' : ''}
                        {formatCurrency(detail.closing.difference)}
                      </span>
                    </div>
                  </div>

                  {detail.closing.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Notas</p>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg">{detail.closing.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {detail.sales.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ventas del Turno ({detail.sales.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {detail.sales.map((sale) => (
                      <div key={sale._id} className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                        <div>
                          <p className="font-medium">{sale.saleNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sale.createdAt).toLocaleString('es-MX')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(sale.total)}</p>
                          <Badge variant="outline" className="text-xs">
                            {sale.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
