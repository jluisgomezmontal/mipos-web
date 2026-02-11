"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { branchService } from '@/services/branch.service'
import { Branch } from '@/types/branch'
import { getErrorMessage } from '@/lib/api-client'

export function BranchesSection() {
  const router = useRouter()
  const { toast } = useToast()
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      setIsLoading(true)
      const { branches: branchList } = await branchService.getBranches()
      setBranches(branchList || [])
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar sucursales',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigateToSucursales = () => {
    router.push('/dashboard/sucursales')
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Sucursales</CardTitle>
              <CardDescription>
                Gestiona las sucursales de tu negocio
              </CardDescription>
            </div>
          </div>
          <Button onClick={handleNavigateToSucursales}>
            <Plus className="h-4 w-4 mr-2" />
            Gestionar Sucursales
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {branches.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No hay sucursales registradas
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Crea tu primera sucursal para comenzar
            </p>
            <Button onClick={handleNavigateToSucursales}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Sucursal
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch._id}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{branch.code}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {branch.address?.city || 'Sin ubicación'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                        {branch.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-muted bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Nota:</span> Para gestionar sucursales
            completas (crear, editar, eliminar), utiliza el módulo de Sucursales en
            el menú principal.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
