"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { branchService } from '@/services/branch.service'
import { Branch } from '@/types/branch'
import { getErrorMessage } from '@/lib/api-client'

export default function BranchesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; branch: Branch | null }>({
    open: false,
    branch: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      setIsLoading(true)
      const { branches: branchList } = await branchService.getBranches()
      setBranches(branchList)
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

  const handleDelete = async () => {
    if (!deleteDialog.branch) return

    try {
      setIsDeleting(true)
      await branchService.deleteBranch(deleteDialog.branch._id)
      
      toast({
        title: 'Sucursal eliminada',
        description: 'La sucursal ha sido eliminada exitosamente',
      })

      setDeleteDialog({ open: false, branch: null })
      loadBranches()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar sucursal',
        description: getErrorMessage(error),
      })
    } finally {
      setIsDeleting(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sucursales</h1>
          <p className="text-muted-foreground">
            Gestiona las sucursales de tu negocio
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/sucursales/nueva')}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sucursal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sucursales Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {branches.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay sucursales registradas</p>
              <p className="text-sm mt-2">
                Crea tu primera sucursal para comenzar a operar
              </p>
              <Button
                onClick={() => router.push('/dashboard/sucursales/nueva')}
                className="mt-4"
              >
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
                    <TableHead>Dirección</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch._id}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{branch.code}</Badge>
                      </TableCell>
                      <TableCell>
                        {branch.address?.city || branch.address?.street ? (
                          <div className="text-sm">
                            {branch.address.street && <p>{branch.address.street}</p>}
                            {branch.address.city && (
                              <p className="text-muted-foreground">
                                {branch.address.city}
                                {branch.address.state && `, ${branch.address.state}`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin dirección</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {branch.phone || (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                          {branch.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/sucursales/${branch._id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialog({ open: true, branch })}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, branch: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar sucursal?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará la sucursal "{deleteDialog.branch?.name}". 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, branch: null })}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
