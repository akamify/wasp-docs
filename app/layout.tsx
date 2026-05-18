import './globals.css'

import AppShellClient from '@/app/components/AppShellClient'
import { getNavigation } from '@/app/lib/getDocs'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navigation = await getNavigation()

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppShellClient navigation={navigation}>{children}</AppShellClient>
      </body>
    </html>
  )
}
