"use client"

import { useState } from 'react'
import { Eye, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CashRegisterClosing } from '@/types/cash-register'

interface ClosingHistoryTableProps {
  closings: CashRegisterClosing[]
  onViewDetail: (closing: CashRegisterClosing) => void
}

export function ClosingHistoryTable({ closings, onViewDetail }: ClosingHistoryTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDifferenceIcon = (difference: number) => {
    if (difference === 0) {
      return <Minus className="h-4 w-4 text-green-600" />
    } else if (difference > 0) {
      return <TrendingUp className="h-4 w-4 text-yellow-600" />
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
  }

  const getDifferenceColor = (difference: number) => {
    if (difference === 0) return 'text-green-600'
    if (difference > 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (closings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay cortes de caja registrados</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cajero</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Apertura</TableHead>
            <TableHead>Cierre</TableHead>
            <TableHead className="text-right">Ventas</TableHead>
            <TableHead className="text-right">Ingresos</TableHead>
            <TableHead className="text-right">Retiros</TableHead>
            <TableHead className="text-right">Diferencia</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {closings.map((closing) => (
            <TableRow key={closing._id}>
              <TableCell className="font-medium">{closing.closingNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {closing.cashierId.firstName} {closing.cashierId.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{closing.cashierId.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{closing.branchId.name}</p>
                  <p className="text-xs text-muted-foreground">{closing.branchId.code}</p>
                </div>
              </TableCell>
              <TableCell className="text-sm">{formatDate(closing.openedAt)}</TableCell>
              <TableCell className="text-sm">
                {closing.closedAt ? formatDate(closing.closedAt) : '-'}
              </TableCell>
              <TableCell className="text-right">{closing.sales.totalSales || 0}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(closing.sales.totalRevenue || 0)}
              </TableCell>
              <TableCell className="text-right">
                {closing.totalWithdrawals > 0 ? (
                  <span className="text-destructive">-{formatCurrency(closing.totalWithdrawals)}</span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                {closing.status === 'CLOSED' ? (
                  <div className="flex items-center justify-end gap-1">
                    {getDifferenceIcon(closing.difference)}
                    <span className={`font-semibold ${getDifferenceColor(closing.difference)}`}>
                      {closing.difference > 0 ? '+' : ''}
                      {formatCurrency(closing.difference)}
                    </span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <Badge variant={closing.status === 'OPEN' ? 'default' : 'secondary'}>
                  {closing.status === 'OPEN' ? 'ABIERTO' : 'CERRADO'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetail(closing)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
