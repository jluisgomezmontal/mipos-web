import { z } from 'zod'

export const productSchema = z.object({
  sku: z
    .string()
    .min(1, 'El SKU es requerido')
    .max(50, 'El SKU no puede exceder 50 caracteres'),
  name: z
    .string()
    .min(1, 'El nombre del producto es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
  cost: z
    .number({ invalid_type_error: 'El costo debe ser un número' })
    .min(0, 'El costo no puede ser negativo')
    .optional(),
  taxRate: z
    .number({ invalid_type_error: 'La tasa de impuesto debe ser un número' })
    .min(0, 'La tasa de impuesto no puede ser negativa')
    .max(100, 'La tasa de impuesto no puede exceder 100%')
    .optional(),
  barcode: z.string().optional(),
  image: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  trackInventory: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>
