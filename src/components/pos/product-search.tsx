"use client"

import { useRef, useState, useEffect } from 'react'
import { Search, Barcode, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { productService } from '@/services/product.service'
import { getErrorMessage } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface ProductSearchProps {
  onProductSelect: (product: Product, quantity?: number) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function ProductSearch({ onProductSelect, inputRef }: ProductSearchProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [pendingQuantity, setPendingQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedItemRef = useRef<HTMLDivElement>(null)

  // Hacer scroll al elemento seleccionado
  useEffect(() => {
    if (selectedItemRef.current && showResults) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [selectedIndex, showResults])

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
          // Si tampoco es SKU, buscar por nombre
          try {
            const response = await productService.getProducts({ 
              search: productCode,
              isActive: 'true',
              limit: 10 
            })
            
            if (response.products.length === 0) {
              toast({
                variant: 'destructive',
                title: 'Producto no encontrado',
                description: 'No se encontró ningún producto con ese código o nombre',
              })
              return
            }
            
            if (response.products.length === 1) {
              // Si solo hay un resultado, agregarlo directamente
              onProductSelect(response.products[0], quantity)
              setSearchTerm('')
              return
            }
            
            // Si hay múltiples resultados, mostrar lista
            setSearchResults(response.products)
            setPendingQuantity(quantity)
            setSelectedIndex(0)
            setShowResults(true)
          } catch {
            toast({
              variant: 'destructive',
              title: 'Producto no encontrado',
              description: 'No se encontró ningún producto con ese código o nombre',
            })
          }
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
    if (showResults && searchResults.length > 0) {
      // Navegación cuando hay resultados
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % searchResults.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelectProduct(searchResults[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowResults(false)
        setSearchResults([])
        setSelectedIndex(0)
      }
    } else {
      // Búsqueda cuando no hay resultados
      if (e.key === 'Enter') {
        handleSearch()
      }
    }
  }

  const handleSelectProduct = (product: Product) => {
    onProductSelect(product, pendingQuantity)
    setSearchTerm('')
    setShowResults(false)
    setSearchResults([])
    setPendingQuantity(1)
    setSelectedIndex(0)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar por código, SKU o nombre... (Ej: 5*SKU123)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pl-10"
          autoFocus
        />
        
        {/* Dropdown de resultados */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
            <div className="p-2">
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                Productos encontrados ({searchResults.length})
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {searchResults.map((product, index) => (
                  <div
                    key={product._id}
                    ref={index === selectedIndex ? selectedItemRef : null}
                    onClick={() => handleSelectProduct(product)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <Package className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        SKU: {product.sku} | {formatCurrency(product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
