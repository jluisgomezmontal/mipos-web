"use client"

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SalesReport } from '@/types/report'

interface SalesReportViewProps {
  data: SalesReport
  formatCurrency: (amount: number) => string
}

export function SalesReportView({ data, formatCurrency }: SalesReportViewProps) {
  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Ventas</CardDescription>
            <CardTitle className="text-3xl">{data.summary.totalSales}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Transacciones realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingresos Totales</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(data.summary.totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Ventas del período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ticket Promedio</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(data.summary.averageTicket)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Por transacción
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica simple con barras CSS */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas por Día</CardTitle>
          <CardDescription>Ingresos diarios en el período seleccionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.sales.map((sale, index) => {
              const maxRevenue = Math.max(...data.sales.map(s => s.totalRevenue))
              const percentage = (sale.totalRevenue / maxRevenue) * 100

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {format(new Date(sale.date), 'dd MMM yyyy', { locale: es })}
                    </span>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(sale.totalRevenue)}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.totalSales} venta{sale.totalSales !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 20 && (
                        <span className="text-xs font-medium text-primary-foreground">
                          {sale.totalSales}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabla detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Ticket Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sales.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(sale.date), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">{sale.totalSales}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(sale.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(sale.averageTicket)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
