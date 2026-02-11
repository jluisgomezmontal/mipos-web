"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { productService } from '@/services/product.service'
import { productSchema, ProductFormData } from '@/lib/validations/product'
import { getErrorMessage } from '@/lib/api-client'
import { Product } from '@/types/product'
import { Combobox } from '@/components/ui/combobox'
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      category: '',
      price: 0,
      cost: 0,
      taxRate: 16,
      barcode: '',
      image: '',
      trackInventory: true,
      isActive: true,
    },
  })

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setIsLoadingProduct(true)
      const { product: productData } = await productService.getProductById(params.id as string)
      setProduct(productData)
      
      form.reset({
        sku: productData.sku,
        name: productData.name,
        description: productData.description || '',
        category: productData.category || '',
        price: productData.price,
        cost: productData.cost || 0,
        taxRate: productData.taxRate || 16,
        barcode: productData.barcode || '',
        image: productData.image || '',
        trackInventory: productData.trackInventory,
        isActive: productData.isActive,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar producto',
        description: getErrorMessage(error),
      })
      router.push('/dashboard/productos')
    } finally {
      setIsLoadingProduct(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return

    try {
      setIsLoading(true)
      
      await productService.updateProduct(product._id, {
        ...data,
        trackInventory: data.trackInventory ?? true,
      })

      toast({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado exitosamente',
      })

      router.push('/dashboard/productos')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar producto',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleActive = async () => {
    if (!product) return

    try {
      setIsLoading(true)
      
      await productService.updateProduct(product._id, {
        isActive: !product.isActive,
      })

      toast({
        title: product.isActive ? 'Producto desactivado' : 'Producto activado',
        description: `El producto ha sido ${product.isActive ? 'desactivado' : 'activado'} exitosamente`,
      })

      loadProduct()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cambiar estado',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/productos')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
          <p className="text-muted-foreground">
            Modifica la información del producto
          </p>
        </div>
        <Button
          variant={product.isActive ? 'outline' : 'default'}
          onClick={toggleActive}
          disabled={isLoading}
        >
          {product.isActive ? 'Desactivar' : 'Activar'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
          <CardDescription>
            Actualiza los datos del producto. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: PROD-001"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Código único del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre del producto"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción del producto"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <Combobox
                          options={PRODUCT_CATEGORIES}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Selecciona una categoría..."
                          searchPlaceholder="Buscar categoría..."
                          emptyText="No se encontró la categoría."
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Selecciona de la lista o busca
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barras</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Código de barras"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Venta (MXN) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Precio final con IVA incluido
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Costo de adquisición
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IVA (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="16"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Ya incluido en el precio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Imagen</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL de la imagen del producto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trackInventory"
                  {...form.register('trackInventory')}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={isLoading}
                />
                <label htmlFor="trackInventory" className="text-sm font-medium">
                  Rastrear inventario
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/productos')}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
