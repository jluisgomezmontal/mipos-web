import { z } from 'zod'

export const openRegisterSchema = z.object({
  branchId: z.string().min(1, 'Debes seleccionar una sucursal'),
  initialCash: z.number().min(0, 'El efectivo inicial debe ser mayor o igual a 0'),
})

export const withdrawalSchema = z.object({
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  reason: z.string().min(1, 'Debes especificar una razón').max(200, 'La razón es demasiado larga'),
})

export const closeRegisterSchema = z.object({
  finalCash: z.number().min(0, 'El efectivo final debe ser mayor o igual a 0'),
  notes: z.string().max(500, 'Las notas son demasiado largas').optional(),
})

export type OpenRegisterFormData = z.infer<typeof openRegisterSchema>
export type WithdrawalFormData = z.infer<typeof withdrawalSchema>
export type CloseRegisterFormData = z.infer<typeof closeRegisterSchema>
