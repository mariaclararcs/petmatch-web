'use client'

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"

interface SuccessFeedbackProps {
  show: boolean
  message: string
  onClose: () => void
}

export default function SuccessFeedback({ show, message, onClose }: SuccessFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Aguarda a animação terminar
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show && !isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <CheckCircle className="h-5 w-5 text-green-600" />
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="text-green-600 hover:text-green-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
