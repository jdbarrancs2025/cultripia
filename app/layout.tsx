import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cultripia - Authentic Cultural Experiences",
  description: "Discover and book unique cultural experiences with passionate local hosts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle chunk loading errors
              window.addEventListener('error', function(e) {
                if (e.message && (e.message.includes('Loading chunk') || e.message.includes('ChunkLoadError'))) {
                  console.warn('Chunk loading error detected, reloading page...');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
              
              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.name === 'ChunkLoadError') {
                  console.warn('Chunk loading error in promise, reloading page...');
                  e.preventDefault();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}