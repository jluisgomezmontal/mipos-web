# Módulo de Configuración del Negocio

## Descripción
Módulo completo para la gestión de configuración del negocio MiPOS con control de acceso basado en roles.

## Características Implementadas

### ✅ Control de Acceso
- **Acceso permitido**: OWNER, ADMIN
- **Acceso denegado**: CASHIER
- Protección a nivel de ruta con `ProtectedRoute`
- Validación de permisos en el sidebar

### ✅ Secciones de Configuración

#### 1. Información del Negocio
- Nombre del negocio
- Razón social
- RFC / NIT
- Correo electrónico
- Teléfono
- Dirección completa (calle, ciudad, estado, país, código postal)
- Validación completa con Zod
- Actualización en tiempo real

#### 2. Sucursales
- Vista de sucursales registradas
- Navegación al módulo completo de sucursales
- Indicadores de estado (activa/inactiva)
- Información resumida (nombre, código, ubicación)

#### 3. Impuestos y Preferencias
- Configuración de moneda (MXN, USD, EUR)
- Zona horaria (múltiples opciones de México)
- Tasa de impuesto (0-100%)
- Vista previa de configuración
- Validación de rangos

#### 4. Métodos de Pago
- Efectivo (CASH)
- Tarjeta (CARD)
- Transferencia (TRANSFER)
- Indicadores visuales de estado
- Iconos descriptivos

### ✅ UI/UX

#### Diseño
- Navegación por pestañas (Tabs)
- Diseño limpio y profesional
- Componentes Shadcn UI
- Tailwind CSS (sin estilos inline)
- Soporte para tema claro y oscuro
- Responsive design

#### Organización
- Secciones bien separadas
- Confirmaciones para cambios críticos
- Feedback inmediato con toasts
- Estados de carga visibles
- Formularios con validación en tiempo real

## Estructura de Archivos

```
src/
├── app/dashboard/configuracion/
│   ├── page.tsx              # Página principal con tabs
│   ├── layout.tsx            # Layout con protección de ruta
│   └── README.md             # Esta documentación
├── components/settings/
│   ├── business-info-section.tsx      # Información del negocio
│   ├── tax-settings-section.tsx       # Impuestos y preferencias
│   ├── payment-methods-section.tsx    # Métodos de pago
│   └── branches-section.tsx           # Vista de sucursales
├── services/
│   └── settings.service.ts   # Servicio API para configuración
├── types/
│   └── settings.ts           # Tipos TypeScript para configuración
├── lib/
│   └── validations/settings.ts # Esquemas de validación Zod
```

## Endpoints del Backend

El módulo consume los siguientes endpoints:

- `GET /api/v1/auth/me` - Obtener información del usuario y tenant
- `PATCH /api/v1/auth/tenant` - Actualizar información del tenant
- `PATCH /api/v1/auth/tenant/settings` - Actualizar configuración del tenant
- `GET /api/v1/branches` - Listar sucursales (para vista resumida)

**Nota**: Los endpoints de actualización de tenant deben implementarse en el backend.

## Tipos de Datos

### TenantInfo
```typescript
{
  _id: string
  name: string
  businessName: string
  taxId?: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  settings: {
    currency: string
    timezone: string
    taxRate: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### UpdateTenantInfoRequest
```typescript
{
  name?: string
  businessName?: string
  taxId?: string
  email?: string
  phone?: string
  address?: TenantAddress
}
```

### UpdateTenantSettingsRequest
```typescript
{
  currency?: string
  timezone?: string
  taxRate?: number
}
```

## Validaciones

### Información del Negocio
- Nombre: requerido, máximo 100 caracteres
- Razón social: requerida
- Email: formato válido, requerido
- RFC/NIT: opcional
- Teléfono: opcional
- Dirección: todos los campos opcionales

### Configuración de Impuestos
- Moneda: requerida, valores predefinidos
- Zona horaria: requerida, valores predefinidos
- Tasa de impuesto: 0-100%, requerida

## Opciones de Configuración

### Monedas Disponibles
- MXN - Peso Mexicano
- USD - Dólar Estadounidense
- EUR - Euro

### Zonas Horarias
- America/Mexico_City (GMT-6)
- America/Cancun (GMT-5)
- America/Monterrey (GMT-6)
- America/Tijuana (GMT-8)
- America/Chihuahua (GMT-7)

### Métodos de Pago
- **Efectivo**: Pagos en efectivo
- **Tarjeta**: Pagos con tarjeta de débito o crédito
- **Transferencia**: Transferencias bancarias

## Navegación por Pestañas

El módulo utiliza un sistema de tabs para organizar las secciones:

1. **Información**: Datos generales del negocio
2. **Sucursales**: Vista y gestión de sucursales
3. **Impuestos**: Configuración fiscal y preferencias
4. **Métodos de Pago**: Gestión de formas de pago

## Integración con Otros Módulos

### Sucursales
- Vista resumida en configuración
- Navegación al módulo completo `/dashboard/sucursales`
- Sincronización automática de datos

### Autenticación
- Actualización del tenant en el store de autenticación
- Sincronización con datos del usuario actual
- Persistencia de cambios en el sistema

## Buenas Prácticas Implementadas

### Arquitectura
- ✅ Separación de responsabilidades
- ✅ Componentes reutilizables por sección
- ✅ Tipado estricto con TypeScript
- ✅ Validación centralizada con Zod

### Seguridad
- ✅ Control de acceso por roles
- ✅ Validación de datos en frontend
- ✅ Confirmaciones para cambios críticos
- ✅ Protección de rutas

### UX
- ✅ Feedback inmediato al usuario
- ✅ Estados de carga visibles
- ✅ Mensajes de error descriptivos
- ✅ Diseño intuitivo y organizado
- ✅ Vista previa de cambios

### Código
- ✅ Nombres descriptivos en español
- ✅ Manejo de errores robusto
- ✅ Sin estilos inline
- ✅ Componentes modulares
- ✅ Código limpio y mantenible

## Navegación

El módulo está integrado en el sidebar principal:
- Icono: Settings
- Título: "Configuración"
- Ruta: `/dashboard/configuracion`
- Visible solo para: OWNER, ADMIN

## Notas Importantes

### Endpoints del Backend
Los siguientes endpoints necesitan ser implementados en el backend:

```javascript
// En auth.routes.js
router.patch('/tenant', 
  authorize(USER_ROLES.OWNER, USER_ROLES.ADMIN),
  validate(updateTenantSchema),
  authController.updateTenant
);

router.patch('/tenant/settings',
  authorize(USER_ROLES.OWNER, USER_ROLES.ADMIN),
  validate(updateTenantSettingsSchema),
  authController.updateTenantSettings
);
```

### Alternativa Temporal
Mientras se implementan los endpoints, el módulo puede funcionar en modo de solo lectura, mostrando la información actual del tenant sin permitir ediciones.

## Próximos Pasos (Fuera del Alcance Actual)

- [ ] Configuración de facturación electrónica
- [ ] Gestión de planes y suscripciones
- [ ] Configuración de notificaciones
- [ ] Personalización de tema y logo
- [ ] Configuración de impresoras
- [ ] Backup y restauración de datos
- [ ] Integración con servicios externos
