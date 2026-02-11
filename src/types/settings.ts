export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER'

export interface TenantSettings {
  currency: string
  timezone: string
  taxRate: number
}

export interface TenantAddress {
  street?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface TenantInfo {
  _id: string
  name: string
  businessName: string
  taxId?: string
  email: string
  phone?: string
  address?: TenantAddress
  settings: TenantSettings
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateTenantInfoRequest {
  name?: string
  businessName?: string
  taxId?: string
  email?: string
  phone?: string
  address?: TenantAddress
}

export interface UpdateTenantSettingsRequest {
  currency?: string
  timezone?: string
  taxRate?: number
}

export interface PaymentMethodConfig {
  method: PaymentMethod
  enabled: boolean
  label: string
  description: string
}

export const PAYMENT_METHODS: Record<PaymentMethod, { label: string; description: string }> = {
  CASH: {
    label: 'Efectivo',
    description: 'Pagos en efectivo',
  },
  CARD: {
    label: 'Tarjeta',
    description: 'Pagos con tarjeta de débito o crédito',
  },
  TRANSFER: {
    label: 'Transferencia',
    description: 'Transferencias bancarias',
  },
}

export const CURRENCIES = [
  { value: 'MXN', label: 'Peso Mexicano (MXN)', symbol: '$' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
]

export const TIMEZONES = [
  { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
  { value: 'America/Cancun', label: 'Cancún (GMT-5)' },
  { value: 'America/Monterrey', label: 'Monterrey (GMT-6)' },
  { value: 'America/Tijuana', label: 'Tijuana (GMT-8)' },
  { value: 'America/Chihuahua', label: 'Chihuahua (GMT-7)' },
]
