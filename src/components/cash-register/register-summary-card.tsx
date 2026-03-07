"use client"

import { Clock, DollarSign, ShoppingCart, TrendingUp, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { CashRegisterClosing } from '@/types/cash-register'

interface RegisterSummaryCardProps {
  cashRegister: CashRegisterClosing
  onWithdrawal: () => void
  onClose: () => void
}

export function RegisterSummaryCard({ cashRegister, onWithdrawal, onClose }: RegisterSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatDuration = (openedAt: string) => {
    const start = new Date(openedAt)
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const expectedCash = cashRegister.initialCash + 
    cashRegister.payments.cash.amount - 
    cashRegister.totalWithdrawals

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Turno Abierto</CardTitle>
          <Badge variant="default" className="bg-green-600">
            ACTIVO
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Tiempo Abierto</span>
            </div>
            <p className="text-2xl font-bold">{formatDuration(cashRegister.openedAt)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
              <span>Ventas</span>
            </div>
            <p className="text-2xl font-bold">{cashRegister.sales.totalSales || 0}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Ingresos</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(cashRegister.sales.totalRevenue || 0)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Ticket Promedio</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(cashRegister.sales.averageTicket || 0)}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Métodos de Pago</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Efectivo</p>
              <p className="font-semibold">{formatCurrency(cashRegister.payments.cash.amount)}</p>
              <p className="text-xs text-muted-foreground">{cashRegister.payments.cash.count} transacciones</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Tarjeta</p>
              <p className="font-semibold">{formatCurrency(cashRegister.payments.card.amount)}</p>
              <p className="text-xs text-muted-foreground">{cashRegister.payments.card.count} transacciones</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Transferencia</p>
              <p className="font-semibold">{formatCurrency(cashRegister.payments.transfer.amount)}</p>
              <p className="text-xs text-muted-foreground">{cashRegister.payments.transfer.count} transacciones</p>
            </div>
          </div>
        </div>

        {cashRegister.withdrawals.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-3">Retiros de Efectivo</h3>
              <div className="space-y-2">
                {cashRegister.withdrawals.map((withdrawal, index) => (
                  <div key={index} className="flex justify-between items-start text-sm bg-muted/50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{withdrawal.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(withdrawal.withdrawnAt).toLocaleString('es-MX')}
                      </p>
                    </div>
                    <p className="font-semibold text-destructive">-{formatCurrency(withdrawal.amount)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total Retiros</span>
                  <span className="font-bold text-destructive">-{formatCurrency(cashRegister.totalWithdrawals)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="bg-primary/5 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Efectivo Inicial</span>
            <span className="font-medium">{formatCurrency(cashRegister.initialCash)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">+ Ventas en Efectivo</span>
            <span className="font-medium">{formatCurrency(cashRegister.payments.cash.amount)}</span>
          </div>
          {cashRegister.totalWithdrawals > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">- Retiros</span>
              <span className="font-medium text-destructive">{formatCurrency(cashRegister.totalWithdrawals)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Efectivo Esperado en Caja</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(expectedCash)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onWithdrawal} className="flex-1">
            <Minus className="mr-2 h-4 w-4" />
            Registrar Retiro
          </Button>
          <Button onClick={onClose} className="flex-1">
            Cerrar Turno
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
