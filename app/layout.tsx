import './globals.css'

import AppShellClient from '@/app/components/AppShellClient'
import { getNavigation } from '@/app/lib/getDocs'
import { getDocsLiveState } from '@/app/lib/server/docs-service'

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
  const liveState = await getDocsLiveState()

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppShellClient
          navigation={navigation}
          brandName={liveState.brandName}
          initialRevision={liveState.revision}
        >
          {children}
        </AppShellClient>
      </body>
    </html>
  )
}
