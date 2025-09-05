import { NextRequest, NextResponse } from 'next/server'
import { adminService } from '@/lib/supabase-admin'
import { ApiResponse } from '@/lib/types'

// GET /api/analytics/orders - Get order analytics
export async function GET(request: NextRequest) {
  try {
    const orders = await adminService.getAllOrders()
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const analytics = {
      total: orders.length,
      new: orders.filter(o => o.status === 'جديد').length,
      processing: orders.filter(o => o.status === 'قيد التجهيز').length,
      delivered: orders.filter(o => o.status === 'تم التوصيل').length,
      cancelled: orders.filter(o => o.status === 'ملغي').length,
      
      // Time-based analytics
      todayOrders: orders.filter(o => new Date(o.created_at) >= today).length,
      weekOrders: orders.filter(o => new Date(o.created_at) >= thisWeek).length,
      monthOrders: orders.filter(o => new Date(o.created_at) >= thisMonth).length,
      
      // Revenue analytics
      totalRevenue: orders.filter(o => o.status === 'تم التوصيل').length * 350,
      todayRevenue: orders.filter(o => 
        o.status === 'تم التوصيل' && new Date(o.created_at) >= today
      ).length * 350,
      weekRevenue: orders.filter(o => 
        o.status === 'تم التوصيل' && new Date(o.created_at) >= thisWeek
      ).length * 350,
      monthRevenue: orders.filter(o => 
        o.status === 'تم التوصيل' && new Date(o.created_at) >= thisMonth
      ).length * 350,
      
      // Conversion rates
      conversionRate: orders.length > 0 ? 
        (orders.filter(o => o.status === 'تم التوصيل').length / orders.length * 100).toFixed(1) : 0,
      cancellationRate: orders.length > 0 ? 
        (orders.filter(o => o.status === 'ملغي').length / orders.length * 100).toFixed(1) : 0,
      
      // Daily breakdown for charts
      dailyOrders: getDailyBreakdown(orders, 30),
      statusDistribution: [
        { name: 'جديد', value: orders.filter(o => o.status === 'جديد').length },
        { name: 'قيد التجهيز', value: orders.filter(o => o.status === 'قيد التجهيز').length },
        { name: 'تم التوصيل', value: orders.filter(o => o.status === 'تم التوصيل').length },
        { name: 'ملغي', value: orders.filter(o => o.status === 'ملغي').length },
      ],
    }

    const response: ApiResponse = {
      success: true,
      data: analytics
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'فشل في جلب الإحصائيات'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

function getDailyBreakdown(orders: any[], days: number) {
  const result = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const dayOrders = orders.filter(order => 
      order.created_at.startsWith(dateStr)
    )
    
    result.push({
      date: dateStr,
      orders: dayOrders.length,
      revenue: dayOrders.filter(o => o.status === 'تم التوصيل').length * 350,
      delivered: dayOrders.filter(o => o.status === 'تم التوصيل').length,
    })
  }
  
  return result
}