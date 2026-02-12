"use client"

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
