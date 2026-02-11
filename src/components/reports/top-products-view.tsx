"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TopProductsReport } from '@/types/report'

interface TopProductsViewProps {
  data: TopProductsReport
  formatCurrency: (amount: number) => string
}

export function TopProductsView({ data, formatCurrency }: TopProductsViewProps) {
  const maxQuantity = Math.max(...data.products.map(p => p.quantitySold))
  const maxRevenue = Math.max(...data.products.map(p => p.totalRevenue))

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Productos Vendidos</CardDescription>
            <CardTitle className="text-3xl">{data.summary.totalProducts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Diferentes productos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unidades Vendidas</CardDescription>
            <CardTitle className="text-3xl">{data.summary.totalQuantitySold}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total de unidades
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
              De estos productos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ranking por cantidad */}
      <Card>
        <CardHeader>
          <CardTitle>Top Productos por Cantidad</CardTitle>
          <CardDescription>Productos más vendidos por unidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.products.slice(0, 5).map((product, index) => {
              const percentage = (product.quantitySold / maxQuantity) * 100

              return (
                <div key={product.productId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.quantitySold} unidades</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.totalRevenue)}
                      </p>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ranking por ingresos */}
      <Card>
        <CardHeader>
          <CardTitle>Top Productos por Ingresos</CardTitle>
          <CardDescription>Productos que generaron más ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...data.products]
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .slice(0, 5)
              .map((product, index) => {
                const percentage = (product.totalRevenue / maxRevenue) * 100

                return (
                  <div key={product.productId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.quantitySold} unidades
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(product.totalRevenue)}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          +{formatCurrency(product.profit)} ganancia
                        </p>
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-green-600 dark:bg-green-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Tabla completa */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle Completo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posición</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Ganancia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((product, index) => (
                  <TableRow key={product.productId}>
                    <TableCell>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="text-right">{product.quantitySold}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(product.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400">
                      {formatCurrency(product.profit)}
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
