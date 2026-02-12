"use client"

import { useRef, useState } from 'react'
import { Search, Barcode } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { productService } from '@/services/product.service'
import { getErrorMessage } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

interface ProductSearchProps {
  onProductSelect: (product: Product, quantity?: number) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function ProductSearch({ onProductSelect, inputRef }: ProductSearchProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const handleSearch = async () => {
    if (isSearching) return

    if (!searchTerm.trim()) return

    try {
      setIsSearching(true)

      // Parsear cantidad si tiene formato: 5*SKU o 5*codigo
      let quantity = 1
      let productCode = searchTerm.trim()

      const quantityMatch = searchTerm.match(/^(\d+)\*(.+)$/)
      if (quantityMatch) {
        quantity = parseInt(quantityMatch[1])
        productCode = quantityMatch[2].trim()

        if (quantity <= 0) {
          toast({
            variant: 'destructive',
            title: 'Cantidad inválida',
            description: 'La cantidad debe ser mayor a 0',
          })
          setIsSearching(false)
          return
        }
      }

      // Intentar buscar por código de barras primero
      try {
        const { product } = await productService.getProductByBarcode(productCode)
        onProductSelect(product, quantity)
        setSearchTerm('')
        return
      } catch {
        // Si no es código de barras, intentar por SKU
        try {
          const { product } = await productService.getProductBySku(productCode)
          onProductSelect(product, quantity)
          setSearchTerm('')
          return
        } catch {
          // Si tampoco es SKU, mostrar error
          toast({
            variant: 'destructive',
            title: 'Producto no encontrado',
            description: 'No se encontró ningún producto con ese código',
          })
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al buscar producto',
        description: getErrorMessage(error),
      })
    } finally {
      setIsSearching(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Ej: 5*SKU123 o código de barras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pl-10"
          autoFocus
        />
      </div>
      <Button
        onClick={handleSearch}
        disabled={isSearching || !searchTerm.trim()}
        size="icon"
      >
        <Barcode className="h-4 w-4" />
      </Button>
    </div>
  )
}
