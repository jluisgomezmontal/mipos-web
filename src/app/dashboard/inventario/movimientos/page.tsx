"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2, ArrowLeft, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { inventoryService } from '@/services/inventory.service'
import { branchService } from '@/services/branch.service'
import { InventoryMovement, InventoryMovementType } from '@/types/inventory'
import { Branch } from '@/types/branch'
import { getErrorMessage } from '@/lib/api-client'

export default function InventoryMovementsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadBranches()
    loadMovements()
  }, [])

  useEffect(() => {
    loadMovements()
  }, [currentPage, selectedBranch, selectedType])

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

  const loadMovements = async () => {
    try {
      setIsLoading(true)
      const filters: any = {
        page: currentPage,
        limit: 20,
      }

      if (selectedBranch !== 'all') {
        filters.branchId = selectedBranch
      }

      if (selectedType !== 'all') {
        filters.type = selectedType
      }

      const { movements: movementsData, pagination } = await inventoryService.getMovements(filters)
      console.log('Movimientos cargados:', movementsData)
      setMovements(movementsData || [])
      
      if (pagination) {
        setTotalPages(Math.ceil(pagination.total / pagination.limit))
      }
    } catch (error) {
      console.error('Error al cargar movimientos:', error)
      setMovements([])
      toast({
        variant: 'destructive',
        title: 'Error al cargar movimientos',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMovementTypeBadge = (type: InventoryMovementType) => {
    const config = {
      IN: { label: 'Entrada', variant: 'default' as const },
      OUT: { label: 'Salida', variant: 'destructive' as const },
      ADJUSTMENT: { label: 'Ajuste', variant: 'secondary' as const },
      SALE: { label: 'Venta', variant: 'outline' as const },
    }

    return config[type] || { label: type, variant: 'secondary' as const }
  }

  const filteredMovements = movements.filter((movement) => {
    const searchLower = searchTerm.toLowerCase()
    const product = typeof movement.productId === 'object' ? movement.productId : null
    const user = typeof movement.userId === 'object' ? movement.userId : null
    
    return (
      product?.name.toLowerCase().includes(searchLower) ||
      product?.sku.toLowerCase().includes(searchLower) ||
      user?.firstName.toLowerCase().includes(searchLower) ||
      user?.lastName.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/inventario')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Movimientos</h1>
          <p className="text-muted-foreground">
            Consulta todos los movimientos de inventario registrados
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Movimientos Registrados</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por producto o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Todas las sucursales</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Todos los tipos</option>
                <option value="IN">Entradas</option>
                <option value="OUT">Salidas</option>
                <option value="ADJUSTMENT">Ajustes</option>
                <option value="SALE">Ventas</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMovements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No se encontraron movimientos</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Sucursal</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-center">Stock Anterior</TableHead>
                      <TableHead className="text-center">Stock Nuevo</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.map((movement) => {
                      const typeBadge = getMovementTypeBadge(movement.type)
                      const product = typeof movement.productId === 'object' ? movement.productId : null
                      const branch = typeof movement.branchId === 'object' ? movement.branchId : null
                      const user = typeof movement.userId === 'object' ? movement.userId : null
                      
                      return (
                        <TableRow key={movement._id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(movement.createdAt), 'dd/MM/yyyy HH:mm', {
                              locale: es,
                            })}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product?.name || 'Producto no encontrado'}</p>
                              <p className="text-sm text-muted-foreground">
                                SKU: {product?.sku || '-'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {branch?.name || 'Sucursal no encontrada'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={typeBadge.variant}>
                              {typeBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-semibold ${
                              movement.type === 'IN' || movement.type === 'ADJUSTMENT'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {movement.type === 'OUT' || movement.type === 'SALE' ? '-' : '+'}
                              {movement.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {movement.previousQuantity}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {movement.newQuantity}
                          </TableCell>
                          <TableCell>
                            {user ? (
                              <div>
                                <p className="text-sm">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Sistema</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {movement.reason ? (
                              <span className="text-sm">{movement.reason}</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
