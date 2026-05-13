import { Loader } from 'lucide-react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
}

export const LoadingSpinner = ({ size = 'medium', message }: LoadingSpinnerProps) => {
  const sizeClass = `spinner-${size}`

  return (
    <div className="loading-spinner">
      <Loader className={`spinner ${sizeClass}`} />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  )
}
