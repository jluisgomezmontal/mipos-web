"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { cashRegisterService } from '@/services/cashRegister.service'
import { getErrorMessage } from '@/lib/api-client'
import { closeRegisterSchema, type CloseRegisterFormData } from '@/lib/validations/cash-register'
import type { ClosingSummary } from '@/types/cash-register'

interface CloseRegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegisterId: string
  onSuccess: () => void
}

export function CloseRegisterDialog({
  open,
  onOpenChange,
  cashRegisterId,
  onSuccess,
}: CloseRegisterDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [summary, setSummary] = useState<ClosingSummary | null>(null)
  const [difference, setDifference] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CloseRegisterFormData>({
    resolver: zodResolver(closeRegisterSchema),
    defaultValues: {
      finalCash: 0,
      notes: '',
    },
  })

  const finalCash = watch('finalCash')

  useEffect(() => {
    if (open && cashRegisterId) {
      loadSummary()
    }
  }, [open, cashRegisterId])

  useEffect(() => {
    if (summary) {
      setDifference(finalCash - summary.expectedCash)
    }
  }, [finalCash, summary])

  const loadSummary = async () => {
    try {
      setIsLoadingSummary(true)
      const response = await cashRegisterService.getClosingSummary(cashRegisterId)
      setSummary(response.data.summary)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar resumen',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoadingSummary(false)
    }
  }

  const onSubmit = async (data: CloseRegisterFormData) => {
    try {
      setIsLoading(true)
      await cashRegisterService.closeCashRegister({
        cashRegisterId,
        ...data,
      })
      toast({
        title: 'Turno cerrado',
        description: 'El turno se ha cerrado correctamente',
      })
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cerrar turno',
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cerrar Turno</DialogTitle>
          <DialogDescription>
            Revisa el resumen del turno y registra el efectivo final en caja
          </DialogDescription>
        </DialogHeader>

        {isLoadingSummary ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Resumen de Ventas</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Ventas</p>
                      <p className="font-semibold">{summary.sales.totalSales}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ingresos</p>
                      <p className="font-semibold">{formatCurrency(summary.sales.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ticket Promedio</p>
                      <p className="font-semibold">{formatCurrency(summary.sales.averageTicket)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Métodos de Pago</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Efectivo ({summary.payments.cash.count})</span>
                      <span className="font-medium">{formatCurrency(summary.payments.cash.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarjeta ({summary.payments.card.count})</span>
                      <span className="font-medium">{formatCurrency(summary.payments.card.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transferencia ({summary.payments.transfer.count})</span>
                      <span className="font-medium">{formatCurrency(summary.payments.transfer.amount)}</span>
                    </div>
                  </div>
                </div>

                {summary.withdrawals.count > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Retiros de Efectivo</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Retiros ({summary.withdrawals.count})</span>
                          <span className="font-medium text-destructive">
                            -{formatCurrency(summary.withdrawals.total)}
                          </span>
                        </div>
                        {summary.withdrawals.items.map((withdrawal, index) => (
                          <div key={index} className="flex justify-between text-xs pl-4">
                            <span className="text-muted-foreground">{withdrawal.reason}</span>
                            <span>{formatCurrency(withdrawal.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Efectivo Inicial</span>
                    <span className="font-medium">{formatCurrency(summary.initialCash)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">+ Ventas en Efectivo</span>
                    <span className="font-medium">{formatCurrency(summary.payments.cash.amount)}</span>
                  </div>
                  {summary.totalWithdrawals > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">- Retiros</span>
                      <span className="font-medium text-destructive">
                        {formatCurrency(summary.totalWithdrawals)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Efectivo Esperado</span>
                    <span>{formatCurrency(summary.expectedCash)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="finalCash">Efectivo Final Contado ($)</Label>
                <Input
                  id="finalCash"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('finalCash', { valueAsNumber: true })}
                />
                {errors.finalCash && (
                  <p className="text-sm text-destructive">{errors.finalCash.message}</p>
                )}
              </div>

              {finalCash > 0 && (
                <Card className={
                  difference === 0
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : difference > 0
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
                    : 'border-red-500 bg-red-50 dark:bg-red-950'
                }>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {difference === 0 ? (
                          <Minus className="h-5 w-5 text-green-600" />
                        ) : difference > 0 ? (
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-semibold">Diferencia</span>
                      </div>
                      <span className={`text-lg font-bold ${
                        difference === 0
                          ? 'text-green-600'
                          : difference > 0
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {difference > 0 ? '+' : ''}{formatCurrency(difference)}
                      </span>
                    </div>
                    {difference !== 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {difference > 0
                          ? 'Hay más efectivo del esperado (sobrante)'
                          : 'Hay menos efectivo del esperado (faltante)'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notas / Observaciones (Opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Agrega cualquier observación sobre el turno..."
                  {...register('notes')}
                />
                {errors.notes && (
                  <p className="text-sm text-destructive">{errors.notes.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cerrar Turno
                </Button>
              </DialogFooter>
            </form>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
