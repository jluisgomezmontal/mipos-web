"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShoppingCart, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/auth.store'
import { ProductSearch } from '@/components/pos/product-search'
import { CartItem, CartItemData } from '@/components/pos/cart-item'
import { PaymentDialog } from '@/components/pos/payment-dialog'
import { Product } from '@/types/product'
import { PaymentMethod } from '@/types/sale'
import { saleService } from '@/services/sale.service'
import { branchService } from '@/services/branch.service'
import { cashRegisterService } from '@/services/cashRegister.service'
import { getErrorMessage } from '@/lib/api-client'
import { Branch } from '@/types/branch'
import { CashRegisterClosing } from '@/types/cash-register'
import useF1 from '@/hooks/use-f1'

export default function POSPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { tenant, user } = useAuthStore()
  const [cart, setCart] = useState<CartItemData[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [isLoadingBranches, setIsLoadingBranches] = useState(true)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isProcessingSale, setIsProcessingSale] = useState(false)
  const [currentRegister, setCurrentRegister] = useState<CashRegisterClosing | null>(null)
  const [isLoadingRegister, setIsLoadingRegister] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkOpenRegister()
  }, [])

  useEffect(() => {
    if (currentRegister) {
      // Si hay turno abierto, usar la sucursal del turno
      setSelectedBranch(currentRegister.branchId._id)
      setIsLoadingBranches(false)
    } else {
      setIsLoadingBranches(false)
    }
  }, [currentRegister, user])

  const checkOpenRegister = async () => {
    try {
      setIsLoadingRegister(true)
      const response = await cashRegisterService.getCurrentOpenRegister()
      setCurrentRegister(response.data?.cashRegister || null)
    } catch (error) {
      console.error('Error checking register:', error)
    } finally {
      setIsLoadingRegister(false)
    }
  }

  const loadBranches = async () => {
    try {
      setIsLoadingBranches(true)
      const { branches: branchList } = await branchService.getBranches(true)
      setBranches(branchList)
      if (branchList.length > 0) {
        setSelectedBranch(branchList[0]._id)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: tenant?.settings?.currency || 'MXN',
    }).format(amount)
  }

  const handleProductSelect = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find((item) => item.productId === product._id)

    if (existingItem) {
      updateQuantity(product._id, existingItem.quantity + quantity)
    } else {
      const newItem: CartItemData = {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: quantity,
        discount: 0,
        subtotal: product.price * quantity,
      }
      setCart([...cart, newItem])
    }

    toast({
      title: 'Producto agregado',
      description: `${quantity > 1 ? `${quantity}x ` : ''}${product.name} agregado al carrito`,
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: item.price * quantity - item.discount,
            }
          : item
      )
    )
  }

  const updateDiscount = (productId: string, discount: number) => {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              discount,
              subtotal: item.price * item.quantity - discount,
            }
          : item
      )
    )
  }

  const removeItem = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const clearCart = () => {
    setCart([])
  }
  useF1(() => setShowPaymentDialog(true))
  const calculateTotals = () => {
    // El precio ya incluye IVA, por lo tanto:
    // total = precio con IVA
    // subtotal = precio sin IVA = total / (1 + taxRate)
    // tax = total - subtotal
    const taxRate = tenant?.settings?.taxRate ? tenant.settings.taxRate / 100 : 0.16
    
    const total = cart.reduce((sum, item) => sum + item.subtotal, 0)
    const subtotal = total / (1 + taxRate)
    const tax = total - subtotal

    return { subtotal, tax, total }
  }

  const handlePayment = async (method: PaymentMethod, amountReceived: number) => {
    if (!selectedBranch) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Selecciona una sucursal',
      })
      return
    }

    if (cart.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'El carrito está vacío',
      })
      return
    }

    try {
      setIsProcessingSale(true)

      // Crear la venta
      const saleData = {
        branchId: selectedBranch,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount,
        })),
        discount: 0,
      }

      const { sale } = await saleService.createSale(saleData)

      // Procesar el pago con el total exacto de la venta creada
      await saleService.createPayment({
        saleId: sale._id,
        method,
        amount: sale.total,
      })

      toast({
        title: '¡Venta completada!',
        description: `Venta #${sale.saleNumber} procesada exitosamente`,
      })

      clearCart()
      setShowPaymentDialog(false)
      inputRef?.current?.focus()
      // Redirigir al historial de ventas
      // setTimeout(() => {
      //   router.push('/dashboard/ventas/historial')
      // }, 1500)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al procesar la venta',
        description: getErrorMessage(error),
      })
    } finally {
      setIsProcessingSale(false)
      inputRef?.current?.focus()
    }
  }

  const { subtotal, tax, total } = calculateTotals()

  if (isLoadingBranches || isLoadingRegister) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Validar que el usuario tenga un turno abierto
  if (!currentRegister) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-lg text-muted-foreground">
          No hay turno abierto
        </p>
        <p className="text-sm text-muted-foreground">
          Abre un turno en Corte de Caja para comenzar a vender
        </p>
      </div>
    )
  }
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Punto de Venta</h1>
          <p className="text-muted-foreground">
            Registra ventas de forma rápida y sencilla
          </p>
        </div>
        <div className="flex items-center gap-2">
          {currentRegister ? (
            <div className="h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm flex items-center">
              <span className="font-medium">{currentRegister.branchId.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">(Sucursal del turno)</span>
            </div>
          ) : (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductSearch onProductSelect={handleProductSelect} inputRef={inputRef} />
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Carrito de Compra</CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-4" />
                  <p>El carrito está vacío</p>
                  <p className="text-sm">Busca productos para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cart.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onUpdateDiscount={updateDiscount}
                      onRemove={removeItem}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (16%):</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={cart.length === 0 || isProcessingSale}
                  onClick={() => setShowPaymentDialog(true)}
                >
                  {isProcessingSale ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Procesar Pago
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/dashboard/ventas/historial')}
                >
                  Ver Historial
                </Button>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Productos:</span>
                  <span className="font-medium">{cart.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unidades:</span>
                  <span className="font-medium">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        total={total}
        formatCurrency={formatCurrency}
        onConfirm={handlePayment}
      />
    </div>
  )
}
