import { z } from 'zod'

export const inventoryMovementSchema = z.object({
  productId: z.string().min(1, 'El producto es requerido'),
  branchId: z.string().min(1, 'La sucursal es requerida'),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT'], {
    errorMap: () => ({ message: 'Selecciona un tipo de movimiento válido' }),
  }),
  quantity: z
    .number({ invalid_type_error: 'La cantidad debe ser un número' })
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser mayor a 0'),
  reason: z.string().optional(),
  reference: z.string().optional(),
})

export type InventoryMovementFormData = z.infer<typeof inventoryMovementSchema>
