import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PixelForGood — Own your piece of the internet. Fund the future.",
  description: "Buy pixels on a 1,000,000 pixel canvas. 50% of all revenue goes to community-voted charities. $1/pixel.",
  keywords: "pixel advertising, charity, million pixels, buy pixels, philanthropic advertising",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: '#050505' }}>{children}</body>
    </html>
  )
}
