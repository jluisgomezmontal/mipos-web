"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
import { branchService } from '@/services/branch.service'
import { branchSchema, BranchFormData } from '@/lib/validations/branch'
import { getErrorMessage } from '@/lib/api-client'
import { StateSelect } from '@/components/ui/state-select'

export default function EditBranchPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      code: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      phone: '',
      isActive: true,
    },
  })

  useEffect(() => {
    loadBranch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const loadBranch = async () => {
    try {
      setIsLoadingData(true)
      const { branch } = await branchService.getBranchById(params.id as string)
      
      form.reset({
        name: branch.name,
        code: branch.code,
        address: {
          street: branch.address?.street || '',
          city: branch.address?.city || '',
          state: branch.address?.state || '',
          zipCode: branch.address?.zipCode || '',
        },
        phone: branch.phone || '',
        isActive: branch.isActive,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar sucursal',
        description: getErrorMessage(error),
      })
      router.push('/dashboard/sucursales')
    } finally {
      setIsLoadingData(false)
    }
  }

  const onSubmit = async (data: BranchFormData) => {
    try {
      setIsLoading(true)
      
      const cleanData: any = {
        name: data.name,
        code: data.code,
        isActive: data.isActive,
      }

      if (data.phone?.trim()) cleanData.phone = data.phone

      if (data.address && (data.address.street || data.address.city || data.address.state || data.address.zipCode)) {
        cleanData.address = {}
        if (data.address.street?.trim()) cleanData.address.street = data.address.street
        if (data.address.city?.trim()) cleanData.address.city = data.address.city
        if (data.address.state?.trim()) cleanData.address.state = data.address.state
        if (data.address.zipCode?.trim()) cleanData.address.zipCode = data.address.zipCode
      }
      
      await branchService.updateBranch(params.id as string, cleanData)

      toast({
        title: 'Sucursal actualizada',
        description: 'La sucursal ha sido actualizada exitosamente',
      })

      router.push('/dashboard/sucursales')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar sucursal',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/sucursales')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Sucursal</h1>
          <p className="text-muted-foreground">
            Modifica los datos de la sucursal
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Sucursal</CardTitle>
          <CardDescription>
            Actualiza los datos de la sucursal. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Sucursal Centro"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: SUC-001"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Código único de identificación
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dirección</h3>
                
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Av. Principal #123"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ciudad"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <StateSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoading}
                            placeholder="Selecciona un estado..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código Postal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CP"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: +52 123 456 7890"
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
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Estado de la Sucursal</FormLabel>
                      <FormDescription>
                        Activa o desactiva esta sucursal
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Sucursal'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/sucursales')}
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
