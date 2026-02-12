import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Tenant, LoginRequest, RegisterTenantRequest } from '@/types/auth'
import { authService } from '@/services/auth.service'

interface AuthState {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  _hasHydrated: boolean
  
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterTenantRequest) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setTenant: (tenant: Tenant | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  initializeAuth: () => Promise<void>
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true })
          const response = await authService.login(credentials)
          
          const { user, tenant, tokens } = response

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', tokens.accessToken)
            localStorage.setItem('refreshToken', tokens.refreshToken)
            
            // Guardar en cookies para el middleware (7 días para ambos)
            const maxAge = 60 * 60 * 24 * 7 // 7 días
            document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
            document.cookie = `refreshToken=${tokens.refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`
          }

          set({
            user,
            tenant,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterTenantRequest) => {
        try {
          set({ isLoading: true })
          const response = await authService.register(data)
          
          const { user, tenant, tokens } = response

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', tokens.accessToken)
            localStorage.setItem('refreshToken', tokens.refreshToken)
            
            // Guardar en cookies para el middleware (7 días para ambos)
            const maxAge = 60 * 60 * 24 * 7 // 7 días
            document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
            document.cookie = `refreshToken=${tokens.refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`
          }

          set({
            user,
            tenant,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        authService.logout()
        
        // Limpiar cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        
        set({
          user: null,
          tenant: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },

      setTenant: (tenant: Tenant | null) => {
        set({ tenant })
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          
          // Guardar en cookies para el middleware (7 días para ambos)
          const maxAge = 60 * 60 * 24 * 7 // 7 días
          document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`
        }
        set({ accessToken, refreshToken })
      },

      initializeAuth: async () => {
        const state = get()
        
        if (state.accessToken && state.user) {
          try {
            const { user } = await authService.getMe()
            set({ user, isAuthenticated: true })
          } catch (error) {
            console.error('Error al inicializar autenticación:', error)
            get().logout()
          }
        }
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
