import { z } from 'zod'

export const tenantInfoSchema = z.object({
  name: z.string().min(1, 'El nombre del negocio es requerido').max(100),
  businessName: z.string().min(1, 'La razón social es requerida'),
  taxId: z.string().optional(),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
})

export const tenantSettingsSchema = z.object({
  currency: z.string().min(1, 'La moneda es requerida'),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
  taxRate: z
    .number()
    .min(0, 'La tasa de impuesto no puede ser negativa')
    .max(100, 'La tasa de impuesto no puede exceder 100%'),
})

export type TenantInfoFormData = z.infer<typeof tenantInfoSchema>
export type TenantSettingsFormData = z.infer<typeof tenantSettingsSchema>
