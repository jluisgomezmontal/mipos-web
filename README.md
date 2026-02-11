# MiPOS Frontend - Sistema POS Multitenant

Frontend del sistema POS multitenant construido con Next.js 14 (App Router), TypeScript, Tailwind CSS y ShadCN UI.

## 🚀 Características Implementadas

### ✅ Módulo de Autenticación Completo

#### 🔐 Login
- Formulario de inicio de sesión con validación
- Manejo de errores en español
- Redirección automática al dashboard tras login exitoso
- Persistencia de sesión con Zustand

#### 📝 Registro de Negocio (Tenant)
- Formulario completo de registro
- Validación de contraseñas con requisitos de seguridad
- Confirmación de contraseña
- Creación automática del usuario OWNER
- Redirección al dashboard tras registro exitoso

#### 🔒 Protección de Rutas
- Middleware de Next.js para proteger rutas
- Componente `ProtectedRoute` para rutas del dashboard
- Redirección automática a login si no hay sesión
- Protección basada en roles (OWNER, ADMIN, CASHIER)

#### 🚪 Logout
- Limpieza completa de sesión
- Eliminación de tokens
- Redirección a login

#### 👥 Manejo de Roles
- Roles soportados: OWNER, ADMIN, CASHIER
- Navegación condicional según rol
- Renderizado de menú basado en permisos

### 🎨 Diseño y UI

- **Tema Claro/Oscuro**: Soporte completo con `next-themes`
- **ShadCN UI**: Componentes profesionales y accesibles
- **Tailwind CSS**: Estilos configurados en `globals.css`
- **Diseño Responsivo**: Mobile-first
- **Gradientes Modernos**: Backgrounds atractivos en páginas de auth

### 🏗️ Arquitectura

```
frontend/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Grupo de rutas de autenticación
│   │   │   ├── login/
│   │   │   └── registro/
│   │   ├── dashboard/         # Rutas protegidas
│   │   ├── layout.tsx         # Layout raíz
│   │   └── page.tsx           # Página principal (redirect)
│   ├── components/
│   │   ├── auth/              # Componentes de autenticación
│   │   │   ├── auth-provider.tsx
│   │   │   └── protected-route.tsx
│   │   ├── layout/            # Componentes de layout
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── providers/         # Providers globales
│   │   │   └── theme-provider.tsx
│   │   └── ui/                # Componentes UI de ShadCN
│   ├── hooks/                 # Custom hooks
│   │   └── use-toast.ts
│   ├── lib/                   # Utilidades
│   │   ├── api-client.ts      # Cliente HTTP con interceptors
│   │   ├── utils.ts           # Utilidades generales
│   │   └── validations/       # Schemas de validación Zod
│   ├── services/              # Servicios de API
│   │   └── auth.service.ts
│   ├── store/                 # Estado global (Zustand)
│   │   └── auth.store.ts
│   └── types/                 # Tipos TypeScript
│       ├── api.ts
│       └── auth.ts
├── middleware.ts              # Middleware de Next.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 📦 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: ShadCN UI
- **Formularios**: React Hook Form
- **Validación**: Zod
- **Estado Global**: Zustand con persistencia
- **HTTP Client**: Axios
- **Temas**: next-themes
- **Iconos**: Lucide React

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔗 Integración con Backend

El frontend se conecta automáticamente al backend de MiPOS. Asegúrate de que el backend esté corriendo en `http://localhost:5000`.

### Endpoints Utilizados

- `POST /auth/register` - Registro de tenant + owner
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh-token` - Renovar access token
- `GET /auth/me` - Obtener usuario actual

### Manejo de Tokens

- **Access Token**: Almacenado en localStorage y Zustand
- **Refresh Token**: Almacenado en localStorage y Zustand
- **Auto-refresh**: El cliente HTTP renueva automáticamente el access token cuando expira
- **Interceptors**: Axios intercepta requests para agregar el token de autorización

## 🎨 Personalización de Temas

### Cambiar Colores

Edita `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Color primario */
  --secondary: 210 40% 96.1%;     /* Color secundario */
  /* ... más variables */
}
```

### Cambiar Fuente

Edita `src/app/layout.tsx`:

```typescript
import { Inter } from 'next/font/google'
// Cambia Inter por otra fuente de Google Fonts
```

## 🔐 Flujo de Autenticación

### 1. Registro

```
Usuario → Formulario Registro → Validación Zod → API Backend
→ Respuesta (user + tenant + tokens) → Zustand Store → Dashboard
```

### 2. Login

```
Usuario → Formulario Login → Validación Zod → API Backend
→ Respuesta (user + tenant + tokens) → Zustand Store → Dashboard
```

### 3. Protección de Rutas

```
Usuario accede a /dashboard → Middleware verifica token
→ Si no hay token → Redirect a /login
→ Si hay token → Permite acceso
```

### 4. Refresh Token

```
Request → Access token expirado → Interceptor detecta 401
→ Llama a /auth/refresh-token → Obtiene nuevo access token
→ Reintenta request original
```

### 5. Logout

```
Usuario → Click en Logout → Limpia localStorage
→ Limpia Zustand Store → Redirect a /login
```

## 📱 Rutas Disponibles

### Públicas
- `/` - Redirige a `/login`
- `/login` - Página de inicio de sesión
- `/registro` - Página de registro de negocio

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal
- `/dashboard/productos` - Gestión de productos (OWNER, ADMIN)
- `/dashboard/ventas` - Gestión de ventas (Todos los roles)
- `/dashboard/inventario` - Gestión de inventario (OWNER, ADMIN)
- `/dashboard/reportes` - Reportes (OWNER, ADMIN)
- `/dashboard/usuarios` - Gestión de usuarios (OWNER, ADMIN)
- `/dashboard/configuracion` - Configuración (OWNER, ADMIN)

## 🎯 Roles y Permisos

### OWNER (Propietario)
- Acceso total a todas las funcionalidades
- Puede crear y eliminar usuarios
- Puede acceder a configuración avanzada

### ADMIN (Administrador)
- Acceso a la mayoría de funcionalidades
- Puede crear usuarios (excepto OWNER)
- Puede gestionar productos, ventas, inventario

### CASHIER (Cajero)
- Acceso limitado
- Puede realizar ventas
- Puede ver dashboard básico

## 🧪 Validaciones

Todas las validaciones están en español y usan Zod:

### Login
- Email: Formato válido
- Password: Requerido

### Registro
- Nombre del negocio: Requerido, máx 100 caracteres
- Razón social: Requerida
- Email: Formato válido
- Password: Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
- Confirmación de password: Debe coincidir

## 🎨 Componentes UI Disponibles

Todos los componentes de ShadCN UI están configurados:

- `Button` - Botones con variantes
- `Input` - Campos de texto
- `Label` - Etiquetas de formulario
- `Card` - Tarjetas de contenido
- `Form` - Componentes de formulario con React Hook Form
- `Toast` - Notificaciones
- `DropdownMenu` - Menús desplegables
- `Avatar` - Avatares de usuario

## 🔄 Estado Global (Zustand)

### Auth Store

```typescript
interface AuthState {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  login: (credentials) => Promise<void>
  register: (data) => Promise<void>
  logout: () => void
  setUser: (user) => void
  setTenant: (tenant) => void
  setTokens: (accessToken, refreshToken) => void
  initializeAuth: () => Promise<void>
}
```

### Uso

```typescript
import { useAuthStore } from '@/store/auth.store'

const { user, login, logout } = useAuthStore()
```

## 🚨 Manejo de Errores

Todos los errores del backend se manejan y muestran en español:

```typescript
try {
  await login(credentials)
} catch (error) {
  toast({
    variant: 'destructive',
    title: 'Error al iniciar sesión',
    description: getErrorMessage(error), // Mensaje en español
  })
}
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🔧 Configuración de TypeScript

El proyecto usa TypeScript estricto con path aliases:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🎯 Próximos Pasos

Este módulo de autenticación está **100% completo y funcional**. Los siguientes módulos a implementar serían:

1. **Módulo de Productos** - CRUD completo
2. **Módulo de Inventario** - Gestión multi-sucursal
3. **Módulo de Ventas (POS)** - Punto de venta
4. **Módulo de Reportes** - Analytics y dashboards
5. **Módulo de Usuarios** - Gestión de equipo

## 🐛 Troubleshooting

### Error: Cannot connect to backend

Verifica que:
1. El backend esté corriendo en `http://localhost:5000`
2. La variable `NEXT_PUBLIC_API_URL` esté configurada correctamente
3. No haya problemas de CORS

### Error: Tokens no se guardan

Verifica que:
1. localStorage esté habilitado en el navegador
2. No estés en modo incógnito
3. Zustand persist esté configurado correctamente

### Error: Rutas no protegidas

Verifica que:
1. El middleware esté en la raíz del proyecto
2. El matcher del middleware incluya las rutas correctas
3. Los tokens estén en localStorage

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ para MiPOS**
#   m i p o s - w e b  
 