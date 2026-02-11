# Módulo de Usuarios y Roles

## Descripción
Módulo completo para la gestión de usuarios del sistema MiPOS con control de acceso basado en roles.

## Características Implementadas

### ✅ Control de Acceso
- **Acceso permitido**: OWNER, ADMIN
- **Acceso denegado**: CASHIER
- Protección a nivel de ruta con `ProtectedRoute`
- Validación de permisos en el sidebar

### ✅ Funcionalidades CRUD

#### Crear Usuario
- Formulario con validación completa (Zod)
- Campos: nombre, apellido, email, rol, contraseña
- Validación de contraseña segura (8+ caracteres, mayúsculas, minúsculas, números)
- Confirmación de contraseña
- Descripción de roles en tiempo real

#### Listar Usuarios
- Tabla responsiva con información completa
- Búsqueda por nombre o email
- Filtros por rol (OWNER, ADMIN, CASHIER)
- Filtros por estado (Activo/Inactivo)
- Indicadores visuales de estado
- Badge "Tú" para identificar al usuario actual
- Formato de fechas en español

#### Editar Usuario
- Actualización de información personal
- Cambio de rol
- Activar/desactivar usuario con switch
- Validación de datos

#### Eliminar Usuario
- Soft delete (desactivación)
- Confirmación obligatoria con diálogo
- Prevención de auto-eliminación
- Mensaje de advertencia claro

### ✅ UI/UX

#### Diseño
- Consistente con el resto de la aplicación
- Componentes Shadcn UI
- Tailwind CSS (sin estilos inline)
- Soporte para tema claro y oscuro
- Responsive design

#### Estados Visuales
- **Activo**: Badge verde con icono UserCheck
- **Inactivo**: Badge rojo con icono UserX
- **Usuario actual**: Badge "Tú" para identificación
- **Roles**: Badges con colores distintivos
  - OWNER: default (azul)
  - ADMIN: secondary (gris)
  - CASHIER: outline (borde)

#### Feedback al Usuario
- Toast notifications para todas las acciones
- Estados de carga con spinners
- Mensajes de error descriptivos en español
- Validación en tiempo real de formularios

## Estructura de Archivos

```
src/
├── app/dashboard/usuarios/
│   ├── page.tsx              # Página principal con tabla y lógica CRUD
│   ├── layout.tsx            # Layout con protección de ruta
│   └── README.md             # Esta documentación
├── components/users/
│   ├── user-form-dialog.tsx  # Diálogo para crear usuario
│   ├── edit-user-dialog.tsx  # Diálogo para editar usuario
│   ├── delete-user-dialog.tsx # Diálogo de confirmación de eliminación
│   └── user-role-badge.tsx   # Componente para mostrar badges de roles
├── services/
│   └── user.service.ts       # Servicio API para usuarios
├── types/
│   └── user.ts               # Tipos TypeScript para usuarios
├── lib/
│   ├── validations/user.ts   # Esquemas de validación Zod
│   └── utils/permissions.ts  # Sistema de permisos
```

## Endpoints del Backend

El módulo consume los siguientes endpoints:

- `GET /api/v1/auth/users` - Listar usuarios (con filtros)
- `GET /api/v1/auth/users/:id` - Obtener usuario por ID
- `POST /api/v1/auth/users` - Crear nuevo usuario
- `PATCH /api/v1/auth/users/:id` - Actualizar usuario
- `DELETE /api/v1/auth/users/:id` - Eliminar usuario (soft delete)

### Parámetros de Filtrado
- `search`: Búsqueda por nombre o email
- `role`: Filtrar por rol (OWNER, ADMIN, CASHIER)
- `isActive`: Filtrar por estado (true/false)
- `page`: Número de página
- `limit`: Límite de resultados
- `sort`: Ordenamiento

## Tipos de Datos

### UserListItem
```typescript
{
  _id: string
  email: string
  firstName: string
  lastName: string
  role: 'OWNER' | 'ADMIN' | 'CASHIER'
  tenantId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}
```

### CreateUserRequest
```typescript
{
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'OWNER' | 'ADMIN' | 'CASHIER'
}
```

### UpdateUserRequest
```typescript
{
  email?: string
  firstName?: string
  lastName?: string
  role?: 'OWNER' | 'ADMIN' | 'CASHIER'
  isActive?: boolean
}
```

## Validaciones

### Crear Usuario
- Email: formato válido, requerido
- Contraseña: mínimo 8 caracteres, mayúscula, minúscula, número
- Confirmación de contraseña: debe coincidir
- Nombre: requerido, máximo 50 caracteres
- Apellido: requerido, máximo 50 caracteres
- Rol: requerido, uno de los valores permitidos

### Editar Usuario
- Todos los campos son opcionales
- Mismas validaciones que crear cuando se proporcionan

## Sistema de Permisos

El módulo utiliza un sistema centralizado de permisos en `lib/utils/permissions.ts`:

```typescript
PERMISSIONS = {
  USERS_VIEW: ['OWNER', 'ADMIN'],
  USERS_CREATE: ['OWNER', 'ADMIN'],
  USERS_EDIT: ['OWNER', 'ADMIN'],
  USERS_DELETE: ['OWNER', 'ADMIN'],
}
```

Funciones auxiliares:
- `hasPermission(userRole, permission)`: Verifica si un rol tiene un permiso
- `canAccessUsers(userRole)`: Verifica acceso al módulo de usuarios
- `canManageUsers(userRole)`: Verifica permisos de gestión

## Buenas Prácticas Implementadas

### Arquitectura
- ✅ Separación de responsabilidades (componentes, servicios, tipos)
- ✅ Reutilización de componentes
- ✅ Tipado estricto con TypeScript
- ✅ Validación centralizada con Zod

### Seguridad
- ✅ Control de acceso por roles
- ✅ Prevención de auto-eliminación
- ✅ Validación de contraseñas seguras
- ✅ Confirmación para acciones destructivas

### UX
- ✅ Feedback inmediato al usuario
- ✅ Estados de carga visibles
- ✅ Mensajes de error descriptivos
- ✅ Diseño responsivo
- ✅ Accesibilidad (labels, ARIA)

### Código
- ✅ Nombres descriptivos en español
- ✅ Manejo de errores robusto
- ✅ Sin estilos inline
- ✅ Componentes reutilizables
- ✅ Código limpio y mantenible

## Navegación

El módulo está integrado en el sidebar principal:
- Icono: Users
- Título: "Usuarios"
- Ruta: `/dashboard/usuarios`
- Visible solo para: OWNER, ADMIN

## Próximos Pasos (Fuera del Alcance Actual)

- [ ] Paginación de resultados
- [ ] Exportación de lista de usuarios
- [ ] Historial de actividad por usuario
- [ ] Permisos granulares por usuario
- [ ] Autenticación de dos factores
- [ ] Gestión de sesiones activas
