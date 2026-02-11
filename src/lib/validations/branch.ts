import { z } from 'zod'

export const branchSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la sucursal es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(50, 'El código no puede exceder 50 caracteres'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  manager: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type BranchFormData = z.infer<typeof branchSchema>
