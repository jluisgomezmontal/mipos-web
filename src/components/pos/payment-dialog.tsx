"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PaymentMethod } from '@/types/sale'

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  formatCurrency: (amount: number) => string
  onConfirm: (method: PaymentMethod, amountReceived: number) => Promise<void>
}

export function PaymentDialog({
  open,
  onOpenChange,
  total,
  formatCurrency,
  onConfirm,
}: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CASH')
  const [amountReceived, setAmountReceived] = useState(total.toString())
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsProcessing(true)
      await onConfirm(selectedMethod, parseFloat(amountReceived))
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el componente padre
    } finally {
      setIsProcessing(false)
    }
  }

  const change = parseFloat(amountReceived) - total

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Procesar Pago</DialogTitle>
          <DialogDescription>
            Selecciona el método de pago y confirma el monto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Total a Pagar</Label>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(total)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Método de Pago</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedMethod === 'CASH' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('CASH')}
                disabled={isProcessing}
              >
                Efectivo
              </Button>
              <Button
                variant={selectedMethod === 'CARD' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('CARD')}
                disabled={isProcessing}
              >
                Tarjeta
              </Button>
              <Button
                variant={selectedMethod === 'TRANSFER' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('TRANSFER')}
                disabled={isProcessing}
              >
                Transferencia
              </Button>
            </div>
          </div>

          {selectedMethod === 'CASH' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto Recibido</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  disabled={isProcessing}
                  autoFocus
                />
              </div>

              {change >= 0 && (
                <div className="space-y-2">
                  <Label>Cambio</Label>
                  <div className="text-2xl font-semibold">
                    {formatCurrency(change)}
                  </div>
                </div>
              )}

              {change < 0 && (
                <p className="text-sm text-destructive">
                  El monto recibido es menor al total
                </p>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || (selectedMethod === 'CASH' && change < 0)}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar Pago'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
