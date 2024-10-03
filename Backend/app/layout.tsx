import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'Dashboard',
  description: 'Trading dashboard with stats and account summary',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  )
}