"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Store, ArrowLeft, Building2, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/auth.store'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { getErrorMessage } from '@/lib/api-client'

export default function AdministrarNegociosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const user = useAuthStore((state) => state.user)
  const register = useAuthStore((state) => state.register)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)

  // Verificar que el usuario sea SUPERUSER
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'SUPERUSER') {
      toast({
        variant: 'destructive',
        title: 'Acceso Denegado',
        description: 'Solo los SUPERUSER pueden acceder a esta página.',
      })
      router.push('/dashboard')
      return
    }

    setIsCheckingAccess(false)
  }, [user, router, toast])

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenant: {
        name: '',
        businessName: '',
        email: '',
        phone: '',
        taxId: '',
      },
      owner: {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      },
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      
      const { confirmPassword, ...ownerData } = data.owner
      
      await register({
        tenant: data.tenant,
        owner: ownerData,
      })
      
      toast({
        title: '¡Negocio registrado exitosamente!',
        description: 'El nuevo negocio y su propietario han sido creados.',
      })
      
      // Limpiar el formulario
      form.reset()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al registrar negocio',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administrar Negocios</h1>
          <p className="text-muted-foreground">
            Registra nuevos negocios en el sistema (Solo SUPERUSER)
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>

      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertTitle>Registro de Nuevos Negocios</AlertTitle>
        <AlertDescription>
          Como SUPERUSER, puedes registrar nuevos negocios en el sistema. Cada negocio tendrá su propio propietario (OWNER) que podrá administrar su negocio de forma independiente.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Negocio</CardTitle>
          <CardDescription>
            Completa la información del negocio y su propietario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información del Negocio */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Información del Negocio</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenant.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Negocio *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mi Tienda"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre comercial del negocio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tenant.businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razón Social *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mi Tienda S.A. de C.V."
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre legal del negocio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenant.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email del Negocio *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contacto@minegocio.com"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Email principal del negocio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tenant.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+52 55 1234 5678"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Opcional
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tenant.taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RFC / Tax ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ABC123456XYZ"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Opcional - Registro Federal de Contribuyentes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Datos del Propietario */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Datos del Propietario (OWNER)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="owner.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Juan"
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
                    name="owner.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Pérez"
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
                  name="owner.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email del Propietario *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="propietario@email.com"
                          autoComplete="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el email de acceso del propietario
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="owner.password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mínimo 6 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="owner.confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Contraseña *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
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

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando Negocio...
                    </>
                  ) : (
                    <>
                      <Store className="mr-2 h-4 w-4" />
                      Registrar Negocio
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isLoading}
                >
                  Limpiar Formulario
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
