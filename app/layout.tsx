import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { QueryProvider } from "@/components/providers/query-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "كيكه - سندرين بيوتي | سيروم العناية بالبشرة مع فيتامين سي",
  description:
    "سيروم كيكه من سندرين بيوتي - ينظم إفراز الزيوت ويقلل حجم المسام مع فيتامين سي المضاد للأكسدة. شحن مجاني والدفع عند الاستلام.",
  keywords: "سيروم, كيكه, سندرين بيوتي, فيتامين سي, العناية بالبشرة, مسام, زيوت البشرة",
  authors: [{ name: "سندرين بيوتي" }],
  creator: "سندرين بيوتي",
  publisher: "سندرين بيوتي",
  robots: "index, follow",
  openGraph: {
    title: "كيكه - سندرين بيوتي | سيروم العناية بالبشرة",
    description: "سيروم متطور للعناية بالبشرة ينظم إفراز الزيوت ويقلل حجم المسام مع فيتامين سي",
    type: "website",
    locale: "ar_EG",
    siteName: "سندرين بيوتي",
  },
  twitter: {
    card: "summary_large_image",
    title: "كيكه - سندرين بيوتي",
    description: "سيروم العناية بالبشرة مع فيتامين سي",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#D5006D" />
      </head>
      <body className="font-sans antialiased">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-white font-bold">S</span>
                </div>
                <p className="text-muted-foreground">جاري التحميل...</p>
              </div>
            </div>
          }
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
