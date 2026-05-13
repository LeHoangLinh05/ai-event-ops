import { useEffect, useState } from 'react'
import { BarChart3, FileText, CheckCircle, Zap } from 'lucide-react'
import { dashboardService } from '@/services/apiService'
import { LoadingSpinner } from '@/components'
import { DashboardStats } from '@/types'
import './Dashboard.css'

const StatCard = ({ icon: Icon, title, value, color }: { icon: React.ReactNode, title: string, value: number, color: string }) => (
  <div className="stat-card" style={{ borderLeftColor: color }}>
    <div className="stat-icon" style={{ color }}>
      {Icon}
    </div>
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
)

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
        try {
        setLoading(true)
        const response = await dashboardService.getStats()
        const raw = response.data.data
        setStats({
            totalEvents: raw.events.total,
            draftEvents: raw.events.draft,
            publishedEvents: raw.events.published,
            aiGenerationsToday: 0,
        })
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard stats')
        } finally { 
            setLoading(false)
        }
    }

        fetchStats()
}, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <StatCard
            icon={<FileText size={24} />}
            title="Total Events"
            value={stats.totalEvents}
            color="#3b82f6"
          />
          <StatCard
            icon={<BarChart3 size={24} />}
            title="Draft Events"
            value={stats.draftEvents}
            color="#f59e0b"
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            title="Published Events"
            value={stats.publishedEvents}
            color="#10b981"
          />
          <StatCard
            icon={<Zap size={24} />}
            title="AI Generations Today"
            value={stats.aiGenerationsToday}
            color="#8b5cf6"
          />
        </div>
      )}

      <div className="dashboard-section">
        <h2 className="section-title">Recent Events</h2>
        <div className="coming-soon">
          <p>Recent events table coming soon...</p>
        </div>
      </div>
    </div>
  )
}
