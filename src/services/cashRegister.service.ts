import { apiClient } from '@/lib/api-client'
import type {
  CashRegisterClosing,
  OpenRegisterData,
  WithdrawalData,
  CloseRegisterData,
  ClosingSummary,
  ClosingHistoryFilters,
  ClosingHistoryResponse,
  ClosingDetailResponse,
} from '@/types/cash-register'

class CashRegisterService {
  async openCashRegister(data: OpenRegisterData) {
    return await apiClient.post<{ cashRegister: CashRegisterClosing }>('/cash-register/open', data)
  }

  async getCurrentOpenRegister() {
    return await apiClient.get<{ cashRegister: CashRegisterClosing | null }>('/cash-register/current')
  }

  async addWithdrawal(data: WithdrawalData) {
    return await apiClient.post<{ cashRegister: CashRegisterClosing }>('/cash-register/withdrawal', data)
  }

  async getClosingSummary(cashRegisterId: string) {
    return await apiClient.get<{ summary: ClosingSummary }>('/cash-register/summary', {
      params: { cashRegisterId },
    })
  }

  async closeCashRegister(data: CloseRegisterData) {
    return await apiClient.post<{ cashRegister: CashRegisterClosing }>('/cash-register/close', data)
  }

  async getClosingHistory(filters?: ClosingHistoryFilters) {
    return await apiClient.get<ClosingHistoryResponse>('/cash-register/history', {
      params: filters,
    })
  }

  async getClosingById(id: string) {
    return await apiClient.get<ClosingDetailResponse>(`/cash-register/${id}`)
  }
}

export const cashRegisterService = new CashRegisterService()
