"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateUserSchema, UpdateUserFormData } from '@/lib/validations/user'
import { UserListItem, ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/types/user'
import { UserRole } from '@/types/auth'
import { useAuthStore } from '@/store/auth.store'

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UpdateUserFormData) => Promise<void>
  user: UserListItem | null
  isLoading?: boolean
}

export function EditUserDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
  isLoading = false,
}: EditUserDialogProps) {
  const currentUser = useAuthStore((state) => state.user)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const canChangePassword = currentUser?.role === 'OWNER' || currentUser?.role === 'SUPERUSER'

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'CASHIER',
      isActive: true,
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (user && open) {
      form.reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        password: '',
        confirmPassword: '',
      })
      setChangePassword(false)
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [user, open, form])

  const handleSubmit = async (data: UpdateUserFormData) => {
    const submitData = { ...data }
    if (!changePassword || !submitData.password) {
      delete submitData.password
      delete submitData.confirmPassword
    }
    await onSubmit(submitData)
  }

  const roles: UserRole[] = ['OWNER', 'ADMIN', 'CASHIER']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza la información del usuario
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    {ROLE_DESCRIPTIONS[field.value as UserRole]}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado del Usuario</FormLabel>
                    <FormDescription>
                      {field.value
                        ? 'El usuario puede acceder al sistema'
                        : 'El usuario no puede acceder al sistema'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        field.value ? 'bg-primary' : 'bg-input'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                          field.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </FormControl>
                </FormItem>
              )}
            />

            {canChangePassword && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="changePassword"
                    checked={changePassword}
                    onChange={(e) => {
                      setChangePassword(e.target.checked)
                      if (!e.target.checked) {
                        form.setValue('password', '')
                        form.setValue('confirmPassword', '')
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="changePassword" className="text-sm font-medium">
                    Cambiar contraseña
                  </label>
                </div>

                {changePassword && (
                  <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nueva Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
