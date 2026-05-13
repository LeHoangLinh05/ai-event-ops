import { Toast as ToastType } from '@/types'
import { X, CheckCircle, AlertCircle, InfoIcon, AlertTriangle } from 'lucide-react'
import './Toast.css'

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

export const Toast = ({ toast, onClose }: ToastProps) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="toast-icon" />
      case 'error':
        return <AlertCircle className="toast-icon" />
      case 'warning':
        return <AlertTriangle className="toast-icon" />
      case 'info':
        return <InfoIcon className="toast-icon" />
    }
  }

  return (
    <div className={`toast toast-${toast.type}`}>
      {getIcon()}
      <p className="toast-message">{toast.message}</p>
      <button
        className="toast-close"
        onClick={() => onClose(toast.id)}
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastType[]
  onClose: (id: string) => void
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
