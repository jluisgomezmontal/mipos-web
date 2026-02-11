"use client"

import { useEffect, useState } from 'react'
import { Loader2, Search, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
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
import { userService } from '@/services/user.service'
import { UserListItem, ROLE_LABELS } from '@/types/user'
import { getErrorMessage } from '@/lib/api-client'
import { UserFormDialog } from '@/components/users/user-form-dialog'
import { EditUserDialog } from '@/components/users/edit-user-dialog'
import { DeleteUserDialog } from '@/components/users/delete-user-dialog'
import { CreateUserFormData, UpdateUserFormData } from '@/lib/validations/user'
import { useAuthStore } from '@/store/auth.store'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function UsersPage() {
  const { toast } = useToast()
  const currentUser = useAuthStore((state) => state.user)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  const [createDialog, setCreateDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [selectedRole, selectedStatus])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const filters: any = {}

      if (selectedRole !== 'all') {
        filters.role = selectedRole
      }

      if (selectedStatus !== 'all') {
        filters.isActive = selectedStatus
      }

      const { users: userList } = await userService.getUsers(filters)
      setUsers(userList || [])
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      setUsers([])
      toast({
        variant: 'destructive',
        title: 'Error al cargar usuarios',
        description: getErrorMessage(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (data: CreateUserFormData) => {
    try {
      setActionLoading(true)
      await userService.createUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      })

      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente',
      })

      setCreateDialog(false)
      loadUsers()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al crear usuario',
        description: getErrorMessage(error),
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditUser = async (data: UpdateUserFormData) => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      await userService.updateUser(selectedUser._id, data)

      toast({
        title: 'Usuario actualizado',
        description: 'Los cambios han sido guardados exitosamente',
      })

      setEditDialog(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar usuario',
        description: getErrorMessage(error),
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      await userService.deleteUser(selectedUser._id)

      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido desactivado del sistema',
      })

      setDeleteDialog(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar usuario',
        description: getErrorMessage(error),
      })
    } finally {
      setActionLoading(false)
    }
  }

  const openEditDialog = (user: UserListItem) => {
    setSelectedUser(user)
    setEditDialog(true)
  }

  const openDeleteDialog = (user: UserListItem) => {
    setSelectedUser(user)
    setDeleteDialog(true)
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  const canDeleteUser = (user: UserListItem) => {
    return currentUser && user._id !== currentUser._id
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
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios y roles del sistema
          </p>
        </div>
        <Button onClick={() => setCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Listado de Usuarios</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Todos los roles</option>
                <option value="OWNER">Propietario</option>
                <option value="ADMIN">Administrador</option>
                <option value="CASHIER">Cajero</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">
                  No se encontraron usuarios
                </p>
                <p className="text-sm mt-2">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primer usuario para comenzar'}
                </p>
              </div>
              {!searchTerm && (
                <Button onClick={() => setCreateDialog(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Usuario
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo Electrónico</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            {user._id === currentUser?._id && (
                              <Badge variant="secondary" className="mt-1">
                                Tú
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === 'OWNER'
                              ? 'default'
                              : user.role === 'ADMIN'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? 'default' : 'destructive'}
                        >
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(user.createdAt), 'dd MMM yyyy', {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(user)}
                            disabled={!canDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
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

      <UserFormDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSubmit={handleCreateUser}
        isLoading={actionLoading}
      />

      <EditUserDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        onSubmit={handleEditUser}
        user={selectedUser}
        isLoading={actionLoading}
      />

      <DeleteUserDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={handleDeleteUser}
        user={selectedUser}
        isLoading={actionLoading}
      />
    </div>
  )
}
