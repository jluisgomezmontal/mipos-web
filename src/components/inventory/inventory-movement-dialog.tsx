"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search } from 'lucide-react'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { inventoryService } from '@/services/inventory.service'
import { productService } from '@/services/product.service'
import { inventoryMovementSchema, InventoryMovementFormData } from '@/lib/validations/inventory'
import { getErrorMessage } from '@/lib/api-client'
import { Branch } from '@/types/branch'
import { Product } from '@/types/product'
import { MOTIVOS } from '@/lib/constants/motivos'

interface InventoryMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  branches: Branch[]
}

export function InventoryMovementDialog({
  open,
  onOpenChange,
  onSuccess,
  branches,
}: InventoryMovementDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchSku, setSearchSku] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const form = useForm<InventoryMovementFormData>({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      productId: '',
      branchId: branches[0]?._id || '',
      type: 'IN',
      quantity: 1,
      reason: '',
      reference: '',
    },
  })

  useEffect(() => {
    if (branches.length > 0 && !form.getValues('branchId')) {
      form.setValue('branchId', branches[0]._id)
    }
  }, [branches, form])

  const handleSearchProduct = async () => {
    if (!searchSku.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ingresa un SKU para buscar',
      })
      return
    }

    try {
      setIsSearching(true)
      const { product } = await productService.getProductBySku(searchSku)
      setSelectedProduct(product)
      form.setValue('productId', product._id)

      toast({
        title: 'Producto encontrado',
        description: product.name,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Producto no encontrado',
        description: 'No se encontró un producto con ese SKU',
      })
      setSelectedProduct(null)
      form.setValue('productId', '')
    } finally {
      setIsSearching(false)
    }
  }

  const onSubmit = async (data: InventoryMovementFormData) => {
    if (!selectedProduct) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Selecciona un producto',
      })
      return
    }

    try {
      setIsLoading(true)

      await inventoryService.createMovement(data)

      toast({
        title: 'Movimiento registrado',
        description: 'El movimiento de inventario ha sido registrado exitosamente',
      })

      form.reset()
      setSelectedProduct(null)
      setSearchSku('')
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al registrar movimiento',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMovementTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      IN: 'Entrada',
      OUT: 'Salida',
      ADJUSTMENT: 'Ajuste',
    }
    return types[type] || type
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Movimiento de Inventario</DialogTitle>
          <DialogDescription>
            Registra una entrada, salida o ajuste de inventario
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Producto</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingresa el SKU del producto"
                  value={searchSku}
                  onChange={(e) => setSearchSku(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchProduct())}
                  disabled={isSearching || isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSearchProduct}
                  disabled={isSearching || isLoading}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {selectedProduct && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {selectedProduct.sku}</p>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimiento *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="IN">Entrada</option>
                      <option value="OUT">Salida</option>
                      <option value="ADJUSTMENT">Ajuste</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    {field.value === 'IN' && 'Incrementa el stock'}
                    {field.value === 'OUT' && 'Reduce el stock'}
                    {field.value === 'ADJUSTMENT' && 'Ajusta el stock (puede incrementar o reducir)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {MOTIVOS.map((m, index) => (
                        <option key={index} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Describe el motivo del movimiento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Factura #123"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !selectedProduct}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar Movimiento'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
