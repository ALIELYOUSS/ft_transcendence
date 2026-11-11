import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AppSidebar } from "@/components/shell/Sidebar"
import { Footer } from "@/components/shell/Footer"
import { TopBar } from "@/components/shell/TopBar"
import { ToastProvider } from "@/components/ui/Toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = { title: "WeMeet" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ToastProvider>
          <div className="flex min-h-dvh gap-6 bg-night p-2">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-canvas">
              <TopBar />
              <main className="flex flex-1 flex-col gap-7 px-5 py-8 sm:px-8 lg:px-12">{children}</main>
              <Footer />
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
