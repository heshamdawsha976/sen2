import { NextSeo } from 'next-seo'

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
  }
  additionalMetaTags?: Array<{
    name?: string
    property?: string
    content: string
  }>
}

export function SEOHead({
  title = "كيكه - سندرين بيوتي | سيروم العناية بالبشرة مع فيتامين سي",
  description = "سيروم كيكه من سندرين بيوتي - ينظم إفراز الزيوت ويقلل حجم المسام مع فيتامين سي المضاد للأكسدة. شحن مجاني والدفع عند الاستلام.",
  canonical,
  openGraph,
  additionalMetaTags = [],
}: SEOHeadProps) {
  const defaultOpenGraph = {
    title: title,
    description: description,
    type: 'website',
    locale: 'ar_EG',
    site_name: 'سندرين بيوتي',
    images: [
      {
        url: '/keeka-product-1.jpg',
        width: 800,
        height: 600,
        alt: 'كيكه سيروم فيتامين سي من سندرين بيوتي',
      },
    ],
  }

  const defaultAdditionalMetaTags = [
    {
      name: 'keywords',
      content: 'سيروم, كيكه, سندرين بيوتي, فيتامين سي, العناية بالبشرة, مسام, زيوت البشرة, مضاد للأكسدة, منتجات طبيعية',
    },
    {
      name: 'author',
      content: 'سندرين بيوتي',
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {
      name: 'googlebot',
      content: 'index, follow',
    },
    {
      property: 'og:locale',
      content: 'ar_EG',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'format-detection',
      content: 'telephone=yes',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'theme-color',
      content: '#D5006D',
    },
    ...additionalMetaTags,
  ]

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonical}
      openGraph={{ ...defaultOpenGraph, ...openGraph }}
      additionalMetaTags={defaultAdditionalMetaTags}
      additionalLinkTags={[
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        {
          rel: 'manifest',
          href: '/manifest.json',
        },
      ]}
    />
  )
}