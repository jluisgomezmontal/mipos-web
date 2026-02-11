"use client"

import { useEffect, useState } from 'react'
import { Loader2, Settings } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { settingsService } from '@/services/settings.service'
import { TenantInfo } from '@/types/settings'
import { getErrorMessage } from '@/lib/api-client'
import { BusinessInfoSection } from '@/components/settings/business-info-section'
import { TaxSettingsSection } from '@/components/settings/tax-settings-section'
import { PaymentMethodsSection } from '@/components/settings/payment-methods-section'
import { BranchesSection } from '@/components/settings/branches-section'
import { TenantInfoFormData, TenantSettingsFormData } from '@/lib/validations/settings'
import { useAuthStore } from '@/store/auth.store'

export default function ConfigurationPage() {
  const { toast } = useToast()
  const { tenant: authTenant, setTenant } = useAuthStore()
  const [tenant, setTenantState] = useState<TenantInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadTenantInfo()
  }, [])

  const loadTenantInfo = async () => {
    try {
      setIsLoading(true)
      if (authTenant) {
        setTenantState(authTenant as TenantInfo)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar configuración',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBusinessInfo = async (data: TenantInfoFormData) => {
    try {
      setIsSaving(true)
      const { tenant: updatedTenant } = await settingsService.updateTenantInfo(data)
      
      setTenantState(updatedTenant)
      setTenant(updatedTenant)

      toast({
        title: 'Información actualizada',
        description: 'Los datos del negocio han sido actualizados exitosamente',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar información',
        description: getErrorMessage(error),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateSettings = async (data: TenantSettingsFormData) => {
    try {
      setIsSaving(true)
      const { tenant: updatedTenant } = await settingsService.updateTenantSettings(data)
      
      setTenantState(updatedTenant)
      setTenant(updatedTenant)

      toast({
        title: 'Configuración actualizada',
        description: 'Las preferencias del sistema han sido actualizadas',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar configuración',
        description: getErrorMessage(error),
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Administra la configuración general de tu negocio
          </p>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="business">Información</TabsTrigger>
          <TabsTrigger value="branches">Sucursales</TabsTrigger>
          <TabsTrigger value="taxes">Impuestos</TabsTrigger>
          <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <BusinessInfoSection
            tenant={tenant}
            onSubmit={handleUpdateBusinessInfo}
            isLoading={isSaving}
          />
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <BranchesSection />
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <TaxSettingsSection
            tenant={tenant}
            onSubmit={handleUpdateSettings}
            isLoading={isSaving}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentMethodsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
