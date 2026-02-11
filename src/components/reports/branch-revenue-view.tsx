"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BranchRevenueReport } from '@/types/report'

interface BranchRevenueViewProps {
  data: BranchRevenueReport
  formatCurrency: (amount: number) => string
}

export function BranchRevenueView({ data, formatCurrency }: BranchRevenueViewProps) {
  const maxRevenue = Math.max(...data.branches.map(b => b.totalRevenue))
  const maxSales = Math.max(...data.branches.map(b => b.totalSales))

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sucursales Activas</CardDescription>
            <CardTitle className="text-3xl">{data.summary.totalBranches}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Con ventas en el período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ventas Totales</CardDescription>
            <CardTitle className="text-3xl">{data.summary.totalSales}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Todas las sucursales
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
              Todas las sucursales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparativa por ingresos */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Sucursal</CardTitle>
          <CardDescription>Comparativa de ingresos entre sucursales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...data.branches]
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .map((branch, index) => {
                const percentage = (branch.totalRevenue / maxRevenue) * 100
                const revenuePercentage = (branch.totalRevenue / data.summary.totalRevenue) * 100

                return (
                  <div key={branch.branchId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{branch.branchName}</p>
                          <p className="text-xs text-muted-foreground">
                            Código: {branch.branchCode}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(branch.totalRevenue)}</p>
                        <p className="text-xs text-muted-foreground">
                          {revenuePercentage.toFixed(1)}% del total
                        </p>
                      </div>
                    </div>
                    <div className="h-8 bg-muted rounded-md overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 flex items-center justify-end pr-2 ${
                          index === 0
                            ? 'bg-primary'
                            : 'bg-secondary'
                        }`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className={`text-xs font-medium ${
                            index === 0 ? 'text-primary-foreground' : 'text-secondary-foreground'
                          }`}>
                            {branch.totalSales} ventas
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

      {/* Comparativa por número de ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Número de Ventas por Sucursal</CardTitle>
          <CardDescription>Comparativa de transacciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...data.branches]
              .sort((a, b) => b.totalSales - a.totalSales)
              .map((branch, index) => {
                const percentage = (branch.totalSales / maxSales) * 100

                return (
                  <div key={branch.branchId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <p className="font-medium">{branch.branchName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{branch.totalSales} ventas</p>
                        <p className="text-xs text-muted-foreground">
                          Ticket promedio: {formatCurrency(branch.averageTicket)}
                        </p>
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
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
          <CardTitle>Detalle por Sucursal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Ticket Promedio</TableHead>
                  <TableHead className="text-right">% del Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.branches.map((branch) => {
                  const percentage = (branch.totalRevenue / data.summary.totalRevenue) * 100
                  return (
                    <TableRow key={branch.branchId}>
                      <TableCell className="font-medium">{branch.branchName}</TableCell>
                      <TableCell className="text-muted-foreground">{branch.branchCode}</TableCell>
                      <TableCell className="text-right">{branch.totalSales}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(branch.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(branch.averageTicket)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
