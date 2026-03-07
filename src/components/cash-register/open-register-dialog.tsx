"use client"

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { cashRegisterService } from '@/services/cashRegister.service'
import { branchService } from '@/services/branch.service'
import { getErrorMessage } from '@/lib/api-client'
import { openRegisterSchema, type OpenRegisterFormData } from '@/lib/validations/cash-register'
import type { Branch } from '@/types/branch'

interface OpenRegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function OpenRegisterDialog({ open, onOpenChange, onSuccess }: OpenRegisterDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OpenRegisterFormData>({
    resolver: zodResolver(openRegisterSchema),
    defaultValues: {
      branchId: '',
      initialCash: 0,
    },
  })

  const selectedBranchId = watch('branchId')

  useEffect(() => {
    if (open) {
      loadBranches()
    }
  }, [open])

  const loadBranches = async () => {
    try {
      setIsLoadingBranches(true)
      const { branches: branchList } = await branchService.getBranches(true)
      setBranches(branchList)
      if (branchList.length > 0) {
        setValue('branchId', branchList[0]._id)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar sucursales',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoadingBranches(false)
    }
  }

  const onSubmit = async (data: OpenRegisterFormData) => {
    try {
      setIsLoading(true)
      await cashRegisterService.openCashRegister(data)
      toast({
        title: 'Turno abierto',
        description: 'El turno se ha abierto correctamente',
      })
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al abrir turno',
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
          <DialogTitle>Abrir Turno</DialogTitle>
          <DialogDescription>
            Registra el efectivo inicial en caja para comenzar tu turno
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branchId">Sucursal</Label>
            <Select
              value={selectedBranchId}
              onValueChange={(value) => setValue('branchId', value)}
              disabled={isLoadingBranches}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id}>
                    {branch.name} ({branch.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branchId && (
              <p className="text-sm text-destructive">{errors.branchId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialCash">Efectivo Inicial ($)</Label>
            <Input
              id="initialCash"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('initialCash', { valueAsNumber: true })}
            />
            {errors.initialCash && (
              <p className="text-sm text-destructive">{errors.initialCash.message}</p>
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
              Abrir Turno
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
