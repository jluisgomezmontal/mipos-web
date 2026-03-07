"use client"

import { useState, useEffect } from 'react'
import { Loader2, Calculator, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cashRegisterService } from '@/services/cashRegister.service'
import { getErrorMessage } from '@/lib/api-client'
import { OpenRegisterDialog } from '@/components/cash-register/open-register-dialog'
import { WithdrawalDialog } from '@/components/cash-register/withdrawal-dialog'
import { CloseRegisterDialog } from '@/components/cash-register/close-register-dialog'
import { RegisterSummaryCard } from '@/components/cash-register/register-summary-card'
import { ClosingHistoryTable } from '@/components/cash-register/closing-history-table'
import { ClosingDetailDialog } from '@/components/cash-register/closing-detail-dialog'
import type { CashRegisterClosing } from '@/types/cash-register'

export default function CorteDeCajaPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [currentRegister, setCurrentRegister] = useState<CashRegisterClosing | null>(null)
  const [closingHistory, setClosingHistory] = useState<CashRegisterClosing[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const [showOpenDialog, setShowOpenDialog] = useState(false)
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedClosingId, setSelectedClosingId] = useState<string>('')

  useEffect(() => {
    loadCurrentRegister()
    loadHistory()
  }, [])

  const loadCurrentRegister = async () => {
    try {
      setIsLoading(true)
      const response = await cashRegisterService.getCurrentOpenRegister()
      setCurrentRegister(response.data?.cashRegister || null)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar turno actual',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const response = await cashRegisterService.getClosingHistory({ limit: 10 })
      setClosingHistory(response.data?.closings || [])
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar historial',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleOpenSuccess = () => {
    loadCurrentRegister()
    loadHistory()
  }

  const handleWithdrawalSuccess = () => {
    loadCurrentRegister()
  }

  const handleCloseSuccess = () => {
    loadCurrentRegister()
    loadHistory()
  }

  const handleViewDetail = (closing: CashRegisterClosing) => {
    setSelectedClosingId(closing._id)
    setShowDetailDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corte de Caja</h1>
          <p className="text-muted-foreground">
            Gestiona la apertura y cierre de turnos de caja
          </p>
        </div>
        {!currentRegister && (
          <Button onClick={() => setShowOpenDialog(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Abrir Turno
          </Button>
        )}
      </div>

      {currentRegister ? (
        <RegisterSummaryCard
          cashRegister={currentRegister}
          onWithdrawal={() => setShowWithdrawalDialog(true)}
          onClose={() => setShowCloseDialog(true)}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calculator className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay turno abierto</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Abre un turno para comenzar a registrar ventas y gestionar el efectivo de la caja
            </p>
            <Button onClick={() => setShowOpenDialog(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Abrir Turno
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Historial de Cortes</h2>
        </div>

        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ClosingHistoryTable
            closings={closingHistory}
            onViewDetail={handleViewDetail}
          />
        )}
      </div>

      <OpenRegisterDialog
        open={showOpenDialog}
        onOpenChange={setShowOpenDialog}
        onSuccess={handleOpenSuccess}
      />

      <WithdrawalDialog
        open={showWithdrawalDialog}
        onOpenChange={setShowWithdrawalDialog}
        onSuccess={handleWithdrawalSuccess}
      />

      {currentRegister && (
        <CloseRegisterDialog
          open={showCloseDialog}
          onOpenChange={setShowCloseDialog}
          cashRegisterId={currentRegister._id}
          onSuccess={handleCloseSuccess}
        />
      )}

      {selectedClosingId && (
        <ClosingDetailDialog
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          closingId={selectedClosingId}
        />
      )}
    </div>
  )
}
