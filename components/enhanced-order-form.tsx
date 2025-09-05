"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MessageCircle, Shield, Truck, CreditCard, CheckCircle, User, Phone, MapPin, FileText } from "lucide-react"
import { orderSchema } from "@/lib/validations"
import { config } from "@/lib/config"
import { useCreateOrder } from "@/hooks/use-orders"
import type { OrderFormData } from "@/lib/types"

export function EnhancedOrderForm() {
  const [step, setStep] = useState(1)
  const createOrderMutation = useCreateOrder()

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_address: "",
      customer_notes: "",
    },
  })

  const { handleSubmit, formState: { errors, isValid }, watch, trigger } = form

  const watchedFields = watch()

  const steps = [
    {
      id: 1,
      title: "المعلومات الشخصية",
      icon: User,
      fields: ["customer_name", "customer_phone"],
    },
    {
      id: 2,
      title: "عنوان التوصيل",
      icon: MapPin,
      fields: ["customer_address"],
    },
    {
      id: 3,
      title: "ملاحظات إضافية",
      icon: FileText,
      fields: ["customer_notes"],
    },
  ]

  const nextStep = async () => {
    const currentStepFields = steps[step - 1].fields
    const isStepValid = await trigger(currentStepFields as any)
    
    if (isStepValid && step < steps.length) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const onSubmit = async (data: OrderFormData) => {
    try {
      const order = await createOrderMutation.mutateAsync(data)
      
      // Create WhatsApp message
      const whatsappMessage = `مرحباً، تم تسجيل طلبي بنجاح:

🌟 المنتج: سيروم كيكه من سندرين بيوتي
💰 السعر: 350 جنيه (شحن مجاني)
📋 رقم الطلب: #${order.id}

📋 بيانات الطلب:
الاسم: ${data.customer_name}
الهاتف: ${data.customer_phone}
العنوان: ${data.customer_address}
${data.customer_notes ? `ملاحظات: ${data.customer_notes}` : ""}

شكراً لثقتكم في منتجاتنا! 💕`

      const whatsappUrl = `https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, "_blank")

      // Reset form
      form.reset()
      setStep(1)
    } catch (error) {
      console.error("Order submission error:", error)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <section id="order-form" className="py-20 px-4 bg-gradient-to-br from-pink-50/50 to-purple-50/50">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 gradient-text">اطلبي الآن</h2>
          <p className="text-gray-600">خطوات بسيطة للحصول على منتجك المفضل</p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon
              const isActive = step === stepItem.id
              const isCompleted = step > stepItem.id
              
              return (
                <div key={stepItem.id} className="flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-primary text-white shadow-lg scale-110"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-gray-500"}`}>
                    {stepItem.title}
                  </span>
                </div>
              )
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Shield, text: "طلب آمن 100%", color: "text-green-600" },
            { icon: Truck, text: "شحن مجاني", color: "text-blue-600" },
            { icon: CreditCard, text: "دفع عند الاستلام", color: "text-purple-600" },
            { icon: CheckCircle, text: "ضمان الجودة", color: "text-orange-600" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 text-sm justify-center p-3 bg-white/80 rounded-lg shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-gray-700">{item.text}</span>
            </motion.div>
          ))}
        </div>

        <Card className="shadow-2xl border-0 card-premium">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          الاسم الكامل *
                        </label>
                        <Input
                          {...form.register("customer_name")}
                          placeholder="أدخل اسمك الكامل"
                          className={`text-lg py-6 border-2 transition-colors ${
                            errors.customer_name ? "border-red-500" : "focus:border-primary"
                          }`}
                          disabled={createOrderMutation.isPending}
                        />
                        {errors.customer_name && (
                          <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          رقم الهاتف *
                        </label>
                        <Input
                          {...form.register("customer_phone")}
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          className={`text-lg py-6 border-2 transition-colors ${
                            errors.customer_phone ? "border-red-500" : "focus:border-primary"
                          }`}
                          disabled={createOrderMutation.isPending}
                        />
                        {errors.customer_phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        العنوان بالتفصيل *
                      </label>
                      <Textarea
                        {...form.register("customer_address")}
                        placeholder="المحافظة، المدينة، الشارع، رقم المبنى..."
                        className={`min-h-32 border-2 transition-colors arabic-text ${
                          errors.customer_address ? "border-red-500" : "focus:border-primary"
                        }`}
                        disabled={createOrderMutation.isPending}
                      />
                      {errors.customer_address && (
                        <p className="text-red-500 text-sm mt-1">{errors.customer_address.message}</p>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          ملاحظات إضافية
                        </label>
                        <Textarea
                          {...form.register("customer_notes")}
                          placeholder="أي ملاحظات خاصة بالطلب..."
                          className="min-h-24 border-2 focus:border-primary arabic-text"
                          disabled={createOrderMutation.isPending}
                        />
                      </div>

                      {/* Order Summary */}
                      <div className="card-elegant p-6 rounded-lg border border-primary/20">
                        <h3 className="font-semibold text-lg mb-4">ملخص الطلب</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>المنتج:</span>
                            <span className="font-medium">سيروم كيكه</span>
                          </div>
                          <div className="flex justify-between">
                            <span>السعر:</span>
                            <span className="font-medium">350 جنيه</span>
                          </div>
                          <div className="flex justify-between">
                            <span>الشحن:</span>
                            <span className="font-medium text-green-600">مجاني</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between text-lg font-bold">
                            <span>المجموع:</span>
                            <span className="text-primary">350 جنيه</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1 || createOrderMutation.isPending}
                  className="px-8"
                >
                  السابق
                </Button>

                {step < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={createOrderMutation.isPending}
                    className="px-8 btn-gradient"
                  >
                    التالي
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending || !isValid}
                    className="px-8 btn-gradient-animated shadow-glow"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="ml-2" />
                        جاري التسجيل...
                      </>
                    ) : (
                      <>
                        تأكيد الطلب عبر واتساب
                        <MessageCircle className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}