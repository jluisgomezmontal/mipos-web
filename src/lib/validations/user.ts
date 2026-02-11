import { z } from 'zod'

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  confirmPassword: z.string().min(1, 'Confirma la contraseña'),
  firstName: z.string().min(1, 'El nombre es requerido').max(50),
  lastName: z.string().min(1, 'El apellido es requerido').max(50),
  role: z.enum(['OWNER', 'ADMIN', 'CASHIER'], {
    required_error: 'El rol es requerido',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido')
    .optional(),
  firstName: z.string().min(1, 'El nombre es requerido').max(50).optional(),
  lastName: z.string().min(1, 'El apellido es requerido').max(50).optional(),
  role: z.enum(['OWNER', 'ADMIN', 'CASHIER']).optional(),
  isActive: z.boolean().optional(),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
