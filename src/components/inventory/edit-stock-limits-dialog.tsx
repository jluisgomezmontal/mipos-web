"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { inventoryService } from '@/services/inventory.service'
import { getErrorMessage } from '@/lib/api-client'
import { Inventory } from '@/types/inventory'

const stockLimitsSchema = z.object({
  minStock: z.coerce.number().min(0, 'El stock mínimo no puede ser negativo'),
  maxStock: z.coerce.number().min(0, 'El stock máximo no puede ser negativo'),
}).refine((data) => data.maxStock >= data.minStock, {
  message: 'El stock máximo debe ser mayor o igual al mínimo',
  path: ['maxStock'],
})

type StockLimitsFormData = z.infer<typeof stockLimitsSchema>

interface EditStockLimitsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inventory: Inventory | null
  onSuccess: () => void
}

export function EditStockLimitsDialog({
  open,
  onOpenChange,
  inventory,
  onSuccess,
}: EditStockLimitsDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<StockLimitsFormData>({
    resolver: zodResolver(stockLimitsSchema),
    defaultValues: {
      minStock: 0,
      maxStock: 0,
    },
  })

  useEffect(() => {
    if (inventory && open) {
      form.reset({
        minStock: inventory.minStock || 0,
        maxStock: inventory.maxStock || 0,
      })
    }
  }, [inventory, open, form])

  const onSubmit = async (data: StockLimitsFormData) => {
    if (!inventory) return

    try {
      setIsLoading(true)
      await inventoryService.updateInventory(inventory._id, {
        minStock: data.minStock,
        maxStock: data.maxStock,
      })

      toast({
        title: 'Límites actualizados',
        description: 'Los límites de stock se han actualizado correctamente',
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar límites',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!inventory) return null

  const product = typeof inventory.productId === 'object' ? inventory.productId : null
  const branch = typeof inventory.branchId === 'object' ? inventory.branchId : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Límites de Stock</DialogTitle>
          <DialogDescription>
            Define los límites mínimo y máximo para {product?.name} en {branch?.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stock Actual:</span>
                  <span className="text-2xl font-bold text-primary">
                    {inventory.quantity}
                  </span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 10"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Recibirás alertas cuando el stock llegue a este nivel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Máximo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 100"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Nivel óptimo de stock para este producto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Límites'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
