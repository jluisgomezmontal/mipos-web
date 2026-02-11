"use client"

import { useState } from 'react'
import { CreditCard, Banknote, ArrowLeftRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PAYMENT_METHODS, PaymentMethod } from '@/types/settings'

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  CASH: Banknote,
  CARD: CreditCard,
  TRANSFER: ArrowLeftRight,
}

export function PaymentMethodsSection() {
  const [enabledMethods] = useState<PaymentMethod[]>(['CASH', 'CARD', 'TRANSFER'])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Métodos de Pago</CardTitle>
            <CardDescription>
              Métodos de pago disponibles en el sistema
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((method) => {
            const Icon = PAYMENT_METHOD_ICONS[method]
            const isEnabled = enabledMethods.includes(method)
            const methodInfo = PAYMENT_METHODS[method]

            return (
              <div
                key={method}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{methodInfo.label}</h4>
                      <Badge variant={isEnabled ? 'default' : 'secondary'}>
                        {isEnabled ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {methodInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="rounded-lg border border-muted bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Nota:</span> Todos los métodos de pago están
              habilitados por defecto. Los métodos se gestionan automáticamente según
              las transacciones registradas en el sistema.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
