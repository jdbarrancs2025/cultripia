import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ClientLayout } from "@/components/client-layout";
import { Toaster } from "sonner";
import { getLocale } from "@/lib/locale";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cultripia - Authentic Cultural Experiences",
  description:
    "Discover and book unique cultural experiences with passionate local hosts",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle chunk loading errors
              window.addEventListener('error', function(e) {
                if (e.message && (e.message.includes('Loading chunk') || e.message.includes('ChunkLoadError'))) {
                  // Chunk loading error detected, reloading page
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
              
              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.name === 'ChunkLoadError') {
                  // Chunk loading error in promise, reloading page
                  e.preventDefault();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers locale={locale} messages={messages}>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
