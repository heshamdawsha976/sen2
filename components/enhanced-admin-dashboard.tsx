"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { 
  RefreshCw, Package, Clock, CheckCircle, XCircle, Search, Download, 
  Phone, MessageCircle, TrendingUp, Users, DollarSign, Calendar,
  Filter, Eye, Edit, Trash2
} from "lucide-react"
import { useOrders, useUpdateOrderStatus, useDeleteOrder, useOrderAnalytics } from "@/hooks/use-orders"
import type { Order } from "@/lib/types"

interface EnhancedAdminDashboardProps {
  onBack: () => void
}

export function EnhancedAdminDashboard({ onBack }: EnhancedAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // React Query hooks
  const { data: orders = [], isLoading, error, refetch } = useOrders({ 
    search: searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined 
  })
  const { data: analytics } = useOrderAnalytics()
  const updateOrderMutation = useUpdateOrderStatus()
  const deleteOrderMutation = useDeleteOrder()

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.customer_address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderMutation.mutateAsync({ orderId, status: newStatus })
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("هل تريد حذف هذا الطلب نهائياً؟")) return
    
    try {
      await deleteOrderMutation.mutateAsync(orderId)
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) return

    if (action === "delete") {
      if (!confirm(`هل تريد حذف ${selectedOrders.length} طلب نهائياً؟`)) return
      
      for (const orderId of selectedOrders) {
        await deleteOrderMutation.mutateAsync(orderId)
      }
      setSelectedOrders([])
    }
  }

  const exportOrders = () => {
    const csvContent = [
      ["رقم الطلب", "الاسم", "الهاتف", "العنوان", "الحالة", "التاريخ", "الملاحظات"],
      ...filteredOrders.map((order) => [
        order.id,
        order.customer_name,
        order.customer_phone,
        order.customer_address,
        order.status,
        new Date(order.created_at).toLocaleDateString("ar-EG"),
        order.customer_notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `orders_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      جديد: { variant: "default" as const, icon: Package, color: "bg-blue-500" },
      "قيد التجهيز": { variant: "secondary" as const, icon: Clock, color: "bg-yellow-500" },
      "تم التوصيل": { variant: "default" as const, icon: CheckCircle, color: "bg-green-500" },
      ملغي: { variant: "destructive" as const, icon: XCircle, color: "bg-red-500" },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  const stats = analytics || {
    total: orders.length,
    new: orders.filter((o) => o.status === "جديد").length,
    processing: orders.filter((o) => o.status === "قيد التجهيز").length,
    delivered: orders.filter((o) => o.status === "تم التوصيل").length,
    cancelled: orders.filter((o) => o.status === "ملغي").length,
    todayOrders: orders.filter((o) => {
      const today = new Date().toDateString()
      const orderDate = new Date(o.created_at).toDateString()
      return today === orderDate
    }).length,
    totalRevenue: orders.filter((o) => o.status === "تم التوصيل").length * 350,
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="حدث خطأ في تحميل البيانات" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50/30">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-primary via-purple-600 to-secondary text-white p-6 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">لوحة الإدارة المتقدمة</h1>
            <p className="text-white/90">إدارة شاملة لطلبات سندرين بيوتي</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              onClick={onBack} 
              variant="outline" 
              className="text-primary bg-white hover:bg-gray-50 hover-lift shadow-lg"
            >
              العودة للموقع
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Enhanced Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto p-4">
          <div className="flex gap-2">
            {[
              { id: "dashboard", label: "الصفحة الرئيسية", icon: TrendingUp },
              { id: "orders", label: "إدارة الطلبات", icon: Package },
              { id: "analytics", label: "التحليلات", icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <motion.div key={tab.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className="gap-2 hover-lift"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold gradient-text">نظرة عامة</h2>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="gap-2 hover-lift"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  تحديث
                </Button>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    label: "إجمالي الطلبات", 
                    value: stats.total, 
                    color: "from-blue-500 to-blue-600", 
                    icon: Package,
                    change: "+12%"
                  },
                  { 
                    label: "طلبات اليوم", 
                    value: stats.todayOrders, 
                    color: "from-green-500 to-green-600", 
                    icon: Calendar,
                    change: "+5%"
                  },
                  { 
                    label: "قيد التجهيز", 
                    value: stats.processing, 
                    color: "from-yellow-500 to-yellow-600", 
                    icon: Clock,
                    change: "+8%"
                  },
                  { 
                    label: "إجمالي الإيرادات", 
                    value: `${stats.totalRevenue.toLocaleString()} ج`, 
                    color: "from-purple-500 to-purple-600", 
                    icon: DollarSign,
                    change: "+15%"
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-xl transition-all duration-300 hover-lift border-0 card-premium">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                          </div>
                          <div className="text-2xl font-bold mb-1">{stat.value}</div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Recent Orders Preview */}
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    أحدث الطلبات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(order.created_at).toLocaleDateString("ar-EG")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Enhanced Filters */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-3xl font-bold gradient-text">
                  إدارة الطلبات ({filteredOrders.length})
                </h2>

                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="بحث بالاسم، الهاتف، أو العنوان..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-full md:w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-lg p-2 bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="جديد">جديد</option>
                    <option value="قيد التجهيز">قيد التجهيز</option>
                    <option value="تم التوصيل">تم التوصيل</option>
                    <option value="ملغي">ملغي</option>
                  </select>

                  <Button onClick={exportOrders} variant="outline" className="gap-2 hover-lift">
                    <Download className="w-4 h-4" />
                    تصدير
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedOrders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <span className="text-sm font-medium">
                    تم اختيار {selectedOrders.length} طلب
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("delete")}
                    className="gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    حذف المحدد
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrders([])}
                  >
                    إلغاء التحديد
                  </Button>
                </motion.div>
              )}

              {/* Enhanced Orders Table */}
              <Card className="shadow-xl card-premium">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="p-4 text-right">
                              <input
                                type="checkbox"
                                checked={selectedOrders.length === filteredOrders.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOrders(filteredOrders.map(o => o.id))
                                  } else {
                                    setSelectedOrders([])
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                            </th>
                            <th className="p-4 text-right font-semibold">رقم الطلب</th>
                            <th className="p-4 text-right font-semibold">الاسم</th>
                            <th className="p-4 text-right font-semibold">الهاتف</th>
                            <th className="p-4 text-right font-semibold">العنوان</th>
                            <th className="p-4 text-right font-semibold">الحالة</th>
                            <th className="p-4 text-right font-semibold">التاريخ</th>
                            <th className="p-4 text-right font-semibold">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order, index) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="p-4">
                                <input
                                  type="checkbox"
                                  checked={selectedOrders.includes(order.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedOrders([...selectedOrders, order.id])
                                    } else {
                                      setSelectedOrders(selectedOrders.filter(id => id !== order.id))
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                              </td>
                              <td className="p-4 font-mono text-sm">#{order.id.slice(-8)}</td>
                              <td className="p-4 font-medium">{order.customer_name}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm">{order.customer_phone}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(`tel:${order.customer_phone}`, "_self")}
                                    className="p-1 h-6 w-6"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="p-4 max-w-xs">
                                <div className="truncate" title={order.customer_address}>
                                  {order.customer_address}
                                </div>
                                {order.customer_notes && (
                                  <div className="text-xs text-muted-foreground mt-1" title={order.customer_notes}>
                                    ملاحظة: {order.customer_notes}
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                  className="border rounded-lg p-2 bg-white focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                                  disabled={updateOrderMutation.isPending}
                                >
                                  <option value="جديد">جديد</option>
                                  <option value="قيد التجهيز">قيد التجهيز</option>
                                  <option value="تم التوصيل">تم التوصيل</option>
                                  <option value="ملغي">ملغي</option>
                                </select>
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("ar-EG", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td className="p-4">
                                <div className="flex gap-1">
                                  <Button
                                    onClick={() =>
                                      window.open(`https://wa.me/2${order.customer_phone.replace(/^0/, "")}`, "_blank")
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-green-600 hover:bg-green-50"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    variant="destructive"
                                    size="sm"
                                    className="gap-1"
                                    disabled={deleteOrderMutation.isPending}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                          {filteredOrders.length === 0 && (
                            <tr>
                              <td colSpan={8} className="p-12 text-center text-muted-foreground">
                                {searchTerm || statusFilter !== "all"
                                  ? "لا توجد طلبات تطابق البحث"
                                  : "لا توجد طلبات حتى الآن"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}