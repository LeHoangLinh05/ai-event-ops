import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Eye, Edit2, Trash2 } from 'lucide-react'
import { eventService } from '@/services/apiService'
import { LoadingSpinner } from '@/components'
import { Event } from '@/types'
import './EventList.css'

export const EventList = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [page, statusFilter, typeFilter])

  const fetchEvents = async () => {
    try {
        setLoading(true)
        setError(null)
        const response = await eventService.getEvents(page, limit, statusFilter || undefined, typeFilter || undefined)
        setEvents(response.data.data?.events ?? [])
        setTotal(response.data.data?.total ?? 0) 
    } catch (err: any) {
        setError(err.message || 'Failed to load events')
    } finally {
        setLoading(false)
    }
    }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id)
        fetchEvents()
      } catch (err: any) {
        setError(err.message || 'Failed to delete event')
      }
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="event-list-page">
      <h1 className="page-title">Events Management</h1>

      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search events..."
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setPage(1)
            }}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="Top Recharge">Top Recharge</option>
            <option value="Dungeon Rush">Dungeon Rush</option>
            <option value="Battle Pass">Battle Pass</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <LoadingSpinner message="Loading events..." />
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p>No events found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Code</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.eventCode || '-'}</td>
                  <td className="event-title">{event.aiContent?.title || event.eventType}</td>
                  <td>{event.eventType}</td>
                  <td>
                    <span className={`status-badge status-${event.status}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>{new Date(event.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="action-btn" title="View">
                      <Eye size={18} />
                    </button>
                    <button className="action-btn" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={() => handleDelete(event._id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {events.length > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages} (Total: {total})
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
