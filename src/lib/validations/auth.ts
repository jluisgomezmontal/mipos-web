import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const registerSchema = z.object({
  tenant: z.object({
    name: z.string().min(1, 'El nombre del negocio es requerido').max(100),
    businessName: z.string().min(1, 'La razón social es requerida'),
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Formato de correo electrónico inválido'),
    phone: z.string().optional(),
    taxId: z.string().optional(),
  }),
  owner: z.object({
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
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    firstName: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido es requerido'),
  }),
}).refine((data) => data.owner.password === data.owner.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['owner', 'confirmPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
