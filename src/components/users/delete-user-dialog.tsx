"use client"

import { AlertTriangle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserListItem } from '@/types/user'

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  user: UserListItem | null
  isLoading?: boolean
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  onConfirm,
  user,
  isLoading = false,
}: DeleteUserDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Eliminar Usuario</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <span className="font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-muted-foreground">
            Esta acción desactivará el usuario del sistema. El usuario no podrá
            acceder hasta que sea reactivado por un administrador.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
