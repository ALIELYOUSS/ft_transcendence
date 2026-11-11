"use client"

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"

const ToastContext = createContext<(message: string) => void>(() => {})

/** const notify = useToast(); notify("Saved") */
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const notify = useCallback((text: string) => {
    clearTimeout(timer.current)
    setMessage(text)
    timer.current = setTimeout(() => setMessage(null), 2400)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {message && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-[13px] font-medium text-white shadow-xl">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}
