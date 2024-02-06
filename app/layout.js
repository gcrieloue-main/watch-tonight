import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Watch tonight',
  description: 'What to watch tonight ?',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark text-foreground bg-background`}>
        {children}
      </body>
    </html>
  )
}
