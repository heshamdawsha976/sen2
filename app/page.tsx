"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Shield, Phone, MessageCircle, Award } from "lucide-react"
import { OrderForm } from "@/components/order-form"
import { AdminDashboard } from "@/components/admin-dashboard"
import { EnhancedHeroSection } from "@/components/enhanced-hero-section"
import { EnhancedBenefitsSection } from "@/components/enhanced-benefits-section"
import { EnhancedOrderForm } from "@/components/enhanced-order-form"
import { SEOHead } from "@/components/seo-head"

export default function LandingPage() {
  const [adminClicks, setAdminClicks] = useState(0)
  const [showAdmin, setShowAdmin] = useState(false)

  const handleBrandClick = () => {
    setAdminClicks((prev) => prev + 1)
    if (adminClicks >= 6) {
      setShowAdmin(true)
    }
    setTimeout(() => setAdminClicks(0), 3000)
  }

  if (showAdmin) {
    return (
      <>
        <SEOHead
          title="لوحة الإدارة - سندرين بيوتي"
          description="لوحة إدارة متقدمة لإدارة طلبات منتجات سندرين بيوتي"
        />
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      </>
    )
  }

  return (
    <>
      <SEOHead />
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer hover-lift" onClick={handleBrandClick}>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow animate-pulse-soft">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">سندرين بيوتي</h1>
              <p className="text-sm text-muted-foreground">Sandrine Beauty</p>
            </div>
          </div>
          <Button
            onClick={() => window.open("https://wa.me/201556133633", "_blank")}
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-primary hover:text-white transition-all duration-300 hover-lift"
          >
            <MessageCircle className="w-4 h-4" />
            دعم سريع
          </Button>
        </div>
      </header>

      <EnhancedHeroSection />

      {/* Trust Indicators Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Shield className="w-8 h-8" />, title: "ضمان الجودة", desc: "منتجات أصلية 100%" },
              { icon: <MessageCircle className="w-8 h-8" />, title: "دعم 24/7", desc: "خدمة عملاء متاحة دائماً" },
              { icon: <Award className="w-8 h-8" />, title: "شحن مجاني", desc: "لجميع المحافظات" },
              { icon: <Heart className="w-8 h-8" />, title: "ضمان الاستبدال", desc: "خلال 7 أيام" },
            ].map((item, index) => (
              <div key={index} className="group hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform shadow-glow">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EnhancedBenefitsSection />

      {/* Usage Instructions */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-50/50 to-purple-50/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">طريقة الاستخدام الصحيحة</h2>
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-pink-100">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "تنظيف البشرة",
                  description: "ضع السيروم على بشرة نظيفة وجافة تماماً",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  step: "2",
                  title: "التطبيق والتدليك",
                  description: "دلك بلطف بحركات دائرية حتى يتم امتصاصه بالكامل",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  step: "3",
                  title: "الحماية من الشمس",
                  description: "استخدم واقي الشمس خلال النهار لحماية أفضل",
                  color: "from-blue-500 to-purple-500",
                },
                {
                  step: "!",
                  title: "تنبيه مهم",
                  description: "تجنب المنتجات المهيجة أثناء الاستخدام للحصول على أفضل النتائج",
                  color: "from-orange-500 to-red-500",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl mb-3 text-gray-800">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed arabic-text text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Component */}
      <EnhancedOrderForm />

      {/* Footer */}
      <footer className="py-12 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-right">
            <div>
              <h3 className="font-bold text-lg mb-4 gradient-text">سندرين بيوتي</h3>
              <p className="text-muted-foreground arabic-text">منتجات عناية طبيعية وآمنة لجمالك الطبيعي</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4" />
                  <span>01556133633</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>دعم سريع عبر واتساب</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">مميزات الخدمة</h4>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>🚚 شحن مجاني لجميع المحافظات</p>
                <p>💰 الدفع عند الاستلام</p>
                <p>✅ ضمان الجودة والأصالة</p>
                <p>🔄 إمكانية الاستبدال</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 سندرين بيوتي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}