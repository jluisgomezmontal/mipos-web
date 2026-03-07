"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { cashRegisterService } from '@/services/cashRegister.service'
import { getErrorMessage } from '@/lib/api-client'
import { withdrawalSchema, type WithdrawalFormData } from '@/lib/validations/cash-register'

interface WithdrawalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function WithdrawalDialog({ open, onOpenChange, onSuccess }: WithdrawalDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      reason: '',
    },
  })

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      setIsLoading(true)
      await cashRegisterService.addWithdrawal(data)
      toast({
        title: 'Retiro registrado',
        description: 'El retiro se ha registrado correctamente',
      })
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al registrar retiro',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Retiro de Efectivo</DialogTitle>
          <DialogDescription>
            Registra un retiro de efectivo de la caja durante tu turno
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Razón del Retiro</Label>
            <Textarea
              id="reason"
              placeholder="Ej: Pago a proveedor, gastos operativos..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
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
              Registrar Retiro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
