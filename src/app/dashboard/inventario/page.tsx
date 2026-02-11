"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search, Plus, AlertTriangle, History } from 'lucide-react'
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
import { Inventory } from '@/types/inventory'
import { Branch } from '@/types/branch'
import { getErrorMessage } from '@/lib/api-client'
import { InventoryMovementDialog } from '@/components/inventory/inventory-movement-dialog'

export default function InventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [showLowStock, setShowLowStock] = useState(false)
  const [movementDialog, setMovementDialog] = useState(false)

  useEffect(() => {
    loadBranches()
    loadInventory()
  }, [])

  useEffect(() => {
    loadInventory()
  }, [selectedBranch, showLowStock])

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

  const loadInventory = async () => {
    try {
      setIsLoading(true)
      const filters: any = {}

      if (selectedBranch !== 'all') {
        filters.branchId = selectedBranch
      }

      if (showLowStock) {
        filters.lowStock = true
      }

      const { inventory: inventoryData } = await inventoryService.getInventory(filters)
      console.log('Inventario cargado:', inventoryData)
      setInventory(inventoryData || [])
    } catch (error) {
      console.error('Error al cargar inventario:', error)
      setInventory([])
      toast({
        variant: 'destructive',
        title: 'Error al cargar inventario',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStockStatus = (item: Inventory) => {
    if (item.quantity <= item.minStock) {
      return { label: 'Stock Bajo', variant: 'destructive' as const, icon: true }
    }
    if (item.quantity >= item.maxStock) {
      return { label: 'Stock Alto', variant: 'secondary' as const, icon: false }
    }
    return { label: 'Normal', variant: 'default' as const, icon: false }
  }

  const filteredInventory = inventory.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    const product = typeof item.productId === 'object' ? item.productId : null
    const branch = typeof item.branchId === 'object' ? item.branchId : null
    
    return (
      product?.name.toLowerCase().includes(searchLower) ||
      product?.sku.toLowerCase().includes(searchLower) ||
      branch?.name.toLowerCase().includes(searchLower)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona el stock de productos por sucursal
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/inventario/movimientos')}
          >
            <History className="h-4 w-4 mr-2" />
            Historial
          </Button>
          <Button onClick={() => setMovementDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Movimiento
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Stock Actual</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por producto o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Todas las sucursales</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <Button
                variant={showLowStock ? 'default' : 'outline'}
                onClick={() => setShowLowStock(!showLowStock)}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Stock Bajo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              ) : (
                <>
                  <div className="text-muted-foreground">
                    <p className="text-lg font-medium">
                      {showLowStock
                        ? 'No hay productos con stock bajo'
                        : 'No hay inventario registrado'}
                    </p>
                    <p className="text-sm mt-2">
                      {showLowStock
                        ? 'Todos los productos tienen stock suficiente'
                        : 'Registra movimientos de inventario para comenzar a rastrear tu stock'}
                    </p>
                  </div>
                  {!showLowStock && (
                    <Button
                      onClick={() => setMovementDialog(true)}
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Primer Movimiento
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead className="text-center">Stock Actual</TableHead>
                    <TableHead className="text-center">Stock Mínimo</TableHead>
                    <TableHead className="text-center">Stock Máximo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item)
                    const product = typeof item.productId === 'object' ? item.productId : null
                    const branch = typeof item.branchId === 'object' ? item.branchId : null
                    
                    return (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          {product?.name || 'Producto no encontrado'}
                        </TableCell>
                        <TableCell>{product?.sku || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {branch?.name || 'Sucursal no encontrada'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-lg">
                            {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.minStock}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.maxStock}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {status.icon && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <InventoryMovementDialog
        open={movementDialog}
        onOpenChange={setMovementDialog}
        onSuccess={loadInventory}
        branches={branches}
      />
    </div>
  )
}
