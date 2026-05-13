import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, FileText, CheckCircle, Zap, Clock, Activity } from 'lucide-react'
import { dashboardService } from '@/services/apiService'
import { LoadingSpinner } from '@/components'
import { DashboardStats } from '@/types'
import './Dashboard.css'

const StatCard = ({
  icon, title, value, color, onClick,
}: {
  icon: React.ReactNode; title: string; value: number; color: string; onClick?: () => void
}) => (
  <div
    className={`stat-card ${onClick ? 'stat-card-clickable' : ''}`}
    style={{ borderLeftColor: color }}
    onClick={onClick}
  >
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
)

const ACTION_LABELS: Record<string, string> = {
  CREATE_EVENT: 'Created event',
  UPDATE_EVENT: 'Updated event',
  DELETE_EVENT: 'Deleted event',
  PUBLISH_EVENT: 'Published event',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await dashboardService.getStats()
        setStats(response.data.data)
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
        <>
          <div className="stats-grid">
            <StatCard icon={<FileText size={24} />} title="Total Events" value={stats.totalEvents} color="#3b82f6" onClick={() => navigate('/events')} />
            <StatCard icon={<BarChart3 size={24} />} title="Draft Events" value={stats.draftEvents} color="#f59e0b" onClick={() => navigate('/events?status=draft')} />
            <StatCard icon={<CheckCircle size={24} />} title="Published Events" value={stats.publishedEvents} color="#10b981" onClick={() => navigate('/events?status=published')} />
            <StatCard icon={<Zap size={24} />} title="AI Generations Today" value={stats.aiGenerationsToday} color="#8b5cf6" />
          </div>

          <div className="dashboard-grid">
            {/* Recent Events */}
            <div className="dashboard-section">
              <div className="section-header">
                <Clock size={18} />
                <h2 className="section-title">Recent Events</h2>
              </div>

              {stats.latestEvents?.length === 0 ? (
                <p className="empty-text">No events yet</p>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.latestEvents?.map(event => (
                      <tr key={event._id}>
                        <td className="td-title">{event.title || event.eventType}</td>
                        <td>{event.eventType}</td>
                        <td>
                          <span className={`status-badge status-${event.status}`}>{event.status}</span>
                        </td>
                        <td className="td-time">{timeAgo(event.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Audit Logs */}
            <div className="dashboard-section">
              <div className="section-header">
                <Activity size={18} />
                <h2 className="section-title">Recent Activity</h2>
              </div>

              {stats.latestAuditLogs?.length === 0 ? (
                <p className="empty-text">No activity yet</p>
              ) : (
                <ul className="audit-list">
                  {stats.latestAuditLogs?.map(log => (
                    <li key={log._id} className="audit-item">
                      <span className={`audit-dot audit-dot-${log.action.split('_')[0].toLowerCase()}`} />
                      <div className="audit-info">
                        <span className="audit-action">{ACTION_LABELS[log.action] ?? log.action}</span>
                        <span className="audit-meta">{log.operator} · {timeAgo(log.createdAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
