"use client"

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sale, SaleStatus } from '@/types/sale'
import { Package } from 'lucide-react'

interface SaleDetailsDialogProps {
  sale: Sale | null
  open: boolean
  onOpenChange: (open: boolean) => void
  formatCurrency: (amount: number) => string
}

export function SaleDetailsDialog({
  sale,
  open,
  onOpenChange,
  formatCurrency,
}: SaleDetailsDialogProps) {
  if (!sale) return null

  const getStatusBadge = (status: SaleStatus) => {
    const statusConfig = {
      PAID: { label: 'Pagada', variant: 'default' as const },
      PENDING: { label: 'Pendiente', variant: 'secondary' as const },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' as const },
    }

    const config = statusConfig[status] || statusConfig.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Detalles de Venta #{sale.saleNumber}
            {getStatusBadge(sale.status)}
          </DialogTitle>
          <DialogDescription>
            {format(new Date(sale.createdAt), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", {
              locale: es,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Venta</p>
              <p className="text-lg font-semibold">{sale.saleNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="text-lg">
                {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Productos */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Productos</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16"></TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Descuento</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item, index) => {
                    console.log('Product snapshot:', item.productSnapshot)
                    return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {item.productSnapshot.imageUrl ? (
                            <Image
                              src={item.productSnapshot.imageUrl}
                              alt={item.productSnapshot.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                              onError={(e) => {
                                console.error('Error loading image:', item.productSnapshot.imageUrl)
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.productSnapshot.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.productSnapshot.sku}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {item.discount > 0 ? formatCurrency(item.discount) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          {/* Resumen de Totales */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resumen</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              {sale.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Descuento:</span>
                  <span className="font-medium text-destructive">
                    -{formatCurrency(sale.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total a Pagar:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(sale.total)}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t">
                <span className="text-muted-foreground">
                  (Incluye IVA: {formatCurrency(sale.taxAmount)})
                </span>
                <span className="text-muted-foreground">
                  Subtotal sin IVA: {formatCurrency(sale.subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          {sale.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Notas</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {sale.notes}
                </p>
              </div>
            </>
          )}

          {/* Información de Cancelación */}
          {sale.status === 'CANCELLED' && sale.cancellationReason && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-destructive">
                  Motivo de Cancelación
                </h3>
                <p className="text-sm bg-destructive/10 rounded-lg p-3">
                  {sale.cancellationReason}
                </p>
                {sale.cancelledAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Cancelada el{' '}
                    {format(new Date(sale.cancelledAt), 'dd/MM/yyyy HH:mm', {
                      locale: es,
                    })}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
