"use client"

import { useState, useEffect } from 'react'
import { format, subDays, startOfMonth, endOfMonth, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2, Calendar, TrendingUp, Package, Building2, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/auth.store'
import { branchService } from '@/services/branch.service'
import { reportService } from '@/services/report.service'
import { getErrorMessage } from '@/lib/api-client'
import { Branch } from '@/types/branch'
import { SalesReport, TopProductsReport, BranchRevenueReport } from '@/types/report'
import { SalesReportView } from '@/components/reports/sales-report-view'
import { TopProductsView } from '@/components/reports/top-products-view'
import { BranchRevenueView } from '@/components/reports/branch-revenue-view'
import { SalesByUserView } from '@/components/reports/sales-by-user-view'

type ReportType = 'sales' | 'products' | 'branches' | 'users'

export default function ReportsPage() {
  const { toast } = useToast()
  const { tenant, user } = useAuthStore()
  const [selectedReport, setSelectedReport] = useState<ReportType>('sales')
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  
  // Fechas por defecto: últimos 30 días
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
const [endDate, setEndDate] = useState(
  format(addDays(new Date(), 1), 'yyyy-MM-dd')
)

  // Datos de reportes
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null)
  const [topProductsReport, setTopProductsReport] = useState<TopProductsReport | null>(null)
  const [branchRevenueReport, setBranchRevenueReport] = useState<BranchRevenueReport | null>(null)
  const [salesByUserReport, setSalesByUserReport] = useState<any>(null)

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      const { branches: branchList } = await branchService.getBranches(true)
      setBranches(branchList)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar sucursales',
        description: getErrorMessage(error),
      })
    }
  }

  const loadReport = async () => {
    try {
      setIsLoading(true)

      const filters = {
        startDate,
        endDate,
        branchId: selectedBranch !== 'all' ? selectedBranch : undefined,
        limit: 10,
      }

      switch (selectedReport) {
        case 'sales':
          const salesData = await reportService.getSalesReport(filters)
          setSalesReport(salesData)
          break
        case 'products':
          const productsData = await reportService.getTopProducts(filters)
          setTopProductsReport(productsData)
          break
        case 'branches':
          const branchesData = await reportService.getBranchRevenue({
            startDate: filters.startDate,
            endDate: filters.endDate,
          })
          setBranchRevenueReport(branchesData)
          break
        case 'users':
          const usersData = await reportService.getSalesByUser(filters)
          setSalesByUserReport(usersData)
          break
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar reporte',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const setQuickDateRange = (range: 'today' | 'week' | 'month') => {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    switch (range) {
      case 'today':
        setStartDate(format(today, 'yyyy-MM-dd'))
        setEndDate(format(tomorrow, 'yyyy-MM-dd'))
        break
      case 'week':
        setStartDate(format(subDays(today, 7), 'yyyy-MM-dd'))
        setEndDate(format(tomorrow, 'yyyy-MM-dd'))
        break
      case 'month':
        setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'))
        setEndDate(format(endOfMonth(today), 'yyyy-MM-dd'))
        break
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: tenant?.settings?.currency || 'MXN',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">
          Analiza el desempeño de tu negocio con reportes detallados
        </p>
      </div>

      {/* Selector de tipo de reporte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === 'sales'
              ? 'border-primary ring-2 ring-primary'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedReport('sales')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reporte de Ventas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Análisis de ventas e ingresos por período
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === 'products'
              ? 'border-primary ring-2 ring-primary'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedReport('products')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Más Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Ranking de productos por ventas
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === 'branches'
              ? 'border-primary ring-2 ring-primary'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedReport('branches')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reporte por Sucursal</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Comparativa de ingresos por sucursal
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === 'users'
              ? 'border-primary ring-2 ring-primary'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedReport('users')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas por Usuario</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Detalle de ventas por cajero
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecciona el rango de fechas y sucursal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickDateRange('today')}
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickDateRange('week')}
            >
              Últimos 7 días
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickDateRange('month')}
            >
              Este mes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {selectedReport !== 'branches' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Sucursal</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">Todas las sucursales</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Button onClick={loadReport} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando reporte...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Generar Reporte
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Contenido del reporte */}
      {selectedReport === 'sales' && salesReport && (
        <SalesReportView data={salesReport} formatCurrency={formatCurrency} />
      )}

      {selectedReport === 'products' && topProductsReport && (
        <TopProductsView data={topProductsReport} formatCurrency={formatCurrency} />
      )}

      {selectedReport === 'branches' && branchRevenueReport && (
        <BranchRevenueView data={branchRevenueReport} formatCurrency={formatCurrency} />
      )}

      {selectedReport === 'users' && salesByUserReport && (
        <SalesByUserView data={salesByUserReport} />
      )}
    </div>
  )
}
