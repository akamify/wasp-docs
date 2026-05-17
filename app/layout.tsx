import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/app/lib/utils'

const inter = Inter({ subsets: ['latin'] })

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'DigitalWasp'

export const metadata: Metadata = {
  title: {
    default: `${brandName} API Documentation`,
    template: `%s | ${brandName} API Docs`
  },
  description: `Comprehensive developer documentation for ${brandName} API SaaS platform. Connect your e-commerce transactional checkout systems with high-deliverability WhatsApp workflows.`,
  keywords: ['whatsapp api', 'developer documentation', 'saas API', 'waba integration', 'transactional notifications', 'meta webhooks'],
  authors: [{ name: `${brandName} Developer Relations Team` }],
  creator: 'OmniChannel API',
  publisher: 'OmniChannel API',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://docs.omnichannel-api.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.omnichannel-api.com',
    title: `${brandName} API Documentation`,
    description: `Comprehensive developer documentation for ${brandName} API SaaS platform. Connect your e-commerce transactional checkout systems with high-deliverability WhatsApp workflows.`,
    siteName: `${brandName} Docs`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandName} API Documentation`,
    description: `Comprehensive developer documentation for ${brandName} API SaaS platform. Connect your e-commerce transactional checkout systems with high-deliverability WhatsApp workflows.`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-[family-name:var(--font-sans)] antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
