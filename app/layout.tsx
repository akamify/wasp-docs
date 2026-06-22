import './globals.css'

import AppShellClient from '@/app/components/AppShellClient'
import { getNavigation } from '@/app/lib/getDocs'

export const metadata = {
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navigation = await getNavigation()
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'DigitalWasp'

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppShellClient navigation={navigation} brandName={brandName}>{children}</AppShellClient>
      </body>
    </html>
  )
}
