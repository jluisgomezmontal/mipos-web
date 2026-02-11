"use client"

import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface CartItemData {
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  discount: number
  subtotal: number
}

interface CartItemProps {
  item: CartItemData
  onUpdateQuantity: (productId: string, quantity: number) => void
  onUpdateDiscount: (productId: string, discount: number) => void
  onRemove: (productId: string) => void
  formatCurrency: (amount: number) => string
}

export function CartItem({
  item,
  onUpdateQuantity,
  onUpdateDiscount,
  onRemove,
  formatCurrency,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
        <p className="text-sm font-semibold text-primary">
          {formatCurrency(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
          className="w-16 h-8 text-center"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-right min-w-[100px]">
        <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
        {item.discount > 0 && (
          <p className="text-xs text-muted-foreground">
            Desc: {formatCurrency(item.discount)}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={() => onRemove(item.productId)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
