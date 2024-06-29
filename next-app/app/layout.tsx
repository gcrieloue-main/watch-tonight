import { Inter } from 'next/font/google'
import './globals.css'
import { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Watch tonight',
  description: 'What to watch tonight ?',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  initialScale: 0.5,
  width: 'device-width',
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} dark text-foreground bg-background`}
    >
      <body>{children}</body>
    </html>
  )
}
