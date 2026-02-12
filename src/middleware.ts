import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/registro')
  const isProtectedRoute = pathname.startsWith('/dashboard')

  // Si es una ruta protegida y no hay ningún token, redirigir a login
  if (isProtectedRoute && !accessToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si está en página de auth y tiene accessToken, redirigir al dashboard
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Permitir el acceso a rutas protegidas si hay refreshToken
  // El cliente se encargará de validar y renovar tokens
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/registro'],
}
