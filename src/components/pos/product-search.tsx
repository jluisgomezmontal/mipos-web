"use client"

import { useState } from 'react'
import { Search, Barcode } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { productService } from '@/services/product.service'
import { getErrorMessage } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

interface ProductSearchProps {
  onProductSelect: (product: Product) => void
}

export function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    try {
      setIsSearching(true)
      
      // Intentar buscar por código de barras primero
      try {
        const { product } = await productService.getProductByBarcode(searchTerm)
        onProductSelect(product)
        setSearchTerm('')
        return
      } catch {
        // Si no es código de barras, intentar por SKU
        try {
          const { product } = await productService.getProductBySku(searchTerm)
          onProductSelect(product)
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
          type="text"
          placeholder="Buscar por SKU o código de barras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
          disabled={isSearching}
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
