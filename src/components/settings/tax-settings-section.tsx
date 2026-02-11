"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Receipt } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { tenantSettingsSchema, TenantSettingsFormData } from '@/lib/validations/settings'
import { TenantInfo, CURRENCIES, TIMEZONES } from '@/types/settings'

interface TaxSettingsSectionProps {
  tenant: TenantInfo | null
  onSubmit: (data: TenantSettingsFormData) => Promise<void>
  isLoading?: boolean
}

export function TaxSettingsSection({
  tenant,
  onSubmit,
  isLoading = false,
}: TaxSettingsSectionProps) {
  const form = useForm<TenantSettingsFormData>({
    resolver: zodResolver(tenantSettingsSchema),
    defaultValues: {
      currency: tenant?.settings?.currency || 'MXN',
      timezone: tenant?.settings?.timezone || 'America/Mexico_City',
      taxRate: tenant?.settings?.taxRate || 16,
    },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Impuestos y Preferencias</CardTitle>
            <CardDescription>
              Configura la moneda, zona horaria e impuestos del sistema
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Moneda utilizada en todas las transacciones
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona Horaria</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {TIMEZONES.map((timezone) => (
                        <option key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Zona horaria para reportes y registros
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
                  <FormLabel>Tasa de Impuesto (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="16"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Porcentaje de impuesto aplicado a las ventas (IVA, ISR, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border border-muted bg-muted/50 p-4">
              <h4 className="text-sm font-medium mb-2">Vista Previa</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Moneda:</span>{' '}
                  {CURRENCIES.find((c) => c.value === form.watch('currency'))?.label}
                </p>
                <p>
                  <span className="font-medium">Zona Horaria:</span>{' '}
                  {TIMEZONES.find((t) => t.value === form.watch('timezone'))?.label}
                </p>
                <p>
                  <span className="font-medium">Impuesto:</span> {form.watch('taxRate')}%
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
