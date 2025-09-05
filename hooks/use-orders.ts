import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { queryKeys } from '@/lib/react-query'
import type { Order, OrderFormData, ApiResponse } from '@/lib/types'

// Custom hook for fetching orders
export function useOrders(filters?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters || {}),
    queryFn: async (): Promise<Order[]> => {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value))
          }
        })
      }

      const response = await fetch(`/api/orders?${params}`)
      const result: ApiResponse<Order[]> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في جلب الطلبات')
      }
      
      return result.data || []
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for orders (more frequent updates)
  })
}

// Custom hook for creating orders
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderData: OrderFormData): Promise<Order> => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result: ApiResponse<Order> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في إنشاء الطلب')
      }

      return result.data!
    },
    onSuccess: (newOrder) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.orders.list({}),
        (old: Order[] | undefined) => {
          if (!old) return [newOrder]
          return [newOrder, ...old]
        }
      )

      toast.success('تم إنشاء الطلب بنجاح! 🎉')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ في إنشاء الطلب')
    },
  })
}

// Custom hook for updating order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }): Promise<Order> => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const result: ApiResponse<Order> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في تحديث الطلب')
      }

      return result.data!
    },
    onSuccess: (updatedOrder) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        queryKeys.orders.detail(updatedOrder.id),
        updatedOrder
      )

      // Update the order in lists
      queryClient.setQueriesData(
        { queryKey: queryKeys.orders.lists() },
        (old: Order[] | undefined) => {
          if (!old) return old
          return old.map(order => 
            order.id === updatedOrder.id ? updatedOrder : order
          )
        }
      )

      toast.success('تم تحديث حالة الطلب بنجاح')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ في تحديث الطلب')
    },
  })
}

// Custom hook for deleting orders
export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string): Promise<void> => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      const result: ApiResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في حذف الطلب')
      }
    },
    onSuccess: (_, orderId) => {
      // Remove from all order queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.orders.lists() },
        (old: Order[] | undefined) => {
          if (!old) return old
          return old.filter(order => order.id !== orderId)
        }
      )

      // Remove specific order query
      queryClient.removeQueries({ queryKey: queryKeys.orders.detail(orderId) })

      toast.success('تم حذف الطلب بنجاح')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ في حذف الطلب')
    },
  })
}

// Custom hook for order analytics
export function useOrderAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.stats(),
    queryFn: async () => {
      const response = await fetch('/api/analytics/orders')
      const result: ApiResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في جلب الإحصائيات')
      }
      
      return result.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}