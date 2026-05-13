import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye, Edit2, Trash2, X, Save } from 'lucide-react'
import { eventService } from '@/services/apiService'
import { LoadingSpinner } from '@/components'
import { Event } from '@/types'
import './EventList.css'

type ModalMode = 'view' | 'edit' | null

export const EventList = () => {
  const [searchParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editForm, setEditForm] = useState<Partial<Event>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [page, statusFilter, typeFilter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await eventService.getEvents(page, limit, statusFilter || undefined, typeFilter || undefined)
      setEvents(res.data.data ?? [])
      setTotal(res.data.pagination?.total ?? 0)
    } catch (err: any) {
      setError(err.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (event: Event) => {
    setSelectedEvent(event)
    setModalMode('view')
  }

  const handleEdit = (event: Event) => {
    setSelectedEvent(event)
    setEditForm({ ...event })
    setModalMode('edit')
  }

  const handleCloseModal = () => {
    setSelectedEvent(null)
    setModalMode(null)
    setEditForm({})
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSaveEdit = async () => {
    if (!selectedEvent) return
    try {
      setSaving(true)
      setError(null)
      await eventService.updateEvent(selectedEvent._id, editForm)
      handleCloseModal()
      fetchEvents()
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update event')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await eventService.deleteEvent(id)
      fetchEvents()
    } catch (err: any) {
      setError(err.message || 'Failed to delete event')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="event-list-page">
      <h1 className="page-title">Events Management</h1>

      <div className="filters-section">
        <div className="filter-group">
          <input type="text" placeholder="Search events..." className="search-input" />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="reviewed">Reviewed</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
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
        <div className="empty-state"><p>No events found</p></div>
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
              {events.map(event => (
                <tr key={event._id}>
                  <td>{event.eventCode || '-'}</td>
                  <td className="event-title">{event.title || event.eventType}</td>
                  <td>{event.eventType}</td>
                  <td>
                    <span className={`status-badge status-${event.status}`}>{event.status}</span>
                  </td>
                  <td>{new Date(event.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="action-btn" title="View" onClick={() => handleView(event)}>
                      <Eye size={18} />
                    </button>
                    <button className="action-btn" title="Edit" onClick={() => handleEdit(event)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn danger" title="Delete" onClick={() => handleDelete(event._id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > limit && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={18} />
          </button>
          <span className="pagination-info">Page {page} of {totalPages} (Total: {total})</span>
          <button className="pagination-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {modalMode && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === 'view' ? 'Event Detail' : 'Edit Event'}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}><X size={20} /></button>
            </div>

            <div className="modal-body">
              {modalMode === 'view'
                ? <ViewDetail event={selectedEvent} />
                : <EditForm event={editForm} onChange={handleEditChange} />
              }
            </div>

            {modalMode === 'edit' && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving}>
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const ViewDetail = ({ event }: { event: Event }) => (
  <div className="view-detail">
    <div className="detail-row">
      <span className="detail-label">Event Code</span>
      <span className="detail-value">{event.eventCode || '-'}</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Title</span>
      <span className="detail-value">{event.title}</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Type</span>
      <span className="detail-value">{event.eventType}</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Status</span>
      <span className={`status-badge status-${event.status}`}>{event.status}</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Theme</span>
      <span className="detail-value">{event.theme || '-'}</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Target Segment</span>
      <span className="detail-value">{event.targetSegment || '-'}</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Duration</span>
      <span className="detail-value">{event.duration} days</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Reward</span>
      <span className="detail-value">{event.reward || '-'}</span>
    </div>
    <div className="detail-row">
      <span className="detail-label">Tone</span>
      <span className="detail-value">{event.tone || '-'}</span>
    </div>
    {event.description && (
      <div className="detail-block">
        <span className="detail-label">Description</span>
        <p className="detail-value">{event.description}</p>
      </div>
    )}
    {event.pushMessage && (
      <div className="detail-block">
        <span className="detail-label">Push Message</span>
        <p className="detail-value">{event.pushMessage}</p>
      </div>
    )}
    {(event.rules as any[])?.length > 0 && (
      <div className="detail-block">
        <span className="detail-label">Rules</span>
        <ul className="detail-list">
          {(event.rules as any[]).map((rule, i) => (
            <li key={i}>
              {typeof rule === 'string'
                ? rule
                : <><strong>{rule.title}</strong>{rule.description ? ` — ${rule.description}` : ''}</>}
            </li>
          ))}
        </ul>
      </div>
    )}
    {event.rewardSuggestion && (
      <div className="detail-block">
        <span className="detail-label">Reward Suggestion</span>
        {typeof event.rewardSuggestion === 'string' ? (
          <p className="detail-value">{event.rewardSuggestion}</p>
        ) : Array.isArray(event.rewardSuggestion) && (event.rewardSuggestion as any[]).length > 0 ? (
          <ul className="detail-list">
            {(event.rewardSuggestion as any[]).map((item, i) => (
              <li key={i}>
                {typeof item === 'string'
                  ? item
                  : `${item.itemName} ×${item.quantity} (${item.rarity})`}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )}
    <div className="detail-row">
      <span className="detail-label">Created At</span>
      <span className="detail-value">{new Date(event.createdAt).toLocaleString()}</span>
    </div>
  </div>
)

const EditForm = ({
  event,
  onChange,
}: {
  event: Partial<Event>
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
}) => (
  <div className="edit-form">
    <div className="edit-row">
      <div className="edit-field">
        <label>Title</label>
        <input type="text" name="title" value={event.title || ''} onChange={onChange} />
      </div>
      <div className="edit-field">
        <label>Event Type</label>
        <input type="text" name="eventType" value={event.eventType || ''} onChange={onChange} />
      </div>
    </div>
    <div className="edit-row">
      <div className="edit-field">
        <label>Theme</label>
        <input type="text" name="theme" value={event.theme || ''} onChange={onChange} />
      </div>
      <div className="edit-field">
        <label>Target Segment</label>
        <input type="text" name="targetSegment" value={event.targetSegment || ''} onChange={onChange} />
      </div>
    </div>
    <div className="edit-row">
      <div className="edit-field">
        <label>Duration (days)</label>
        <input type="number" name="duration" min="1" max="90" value={event.duration || ''} onChange={onChange} />
      </div>
      <div className="edit-field">
        <label>Reward</label>
        <input type="text" name="reward" value={event.reward || ''} onChange={onChange} />
      </div>
    </div>
    <div className="edit-row">
      <div className="edit-field">
        <label>Tone</label>
        <select name="tone" value={event.tone || 'exciting'} onChange={onChange}>
          <option value="exciting">Exciting</option>
          <option value="casual">Casual</option>
          <option value="professional">Professional</option>
          <option value="humorous">Humorous</option>
        </select>
      </div>
      <div className="edit-field">
        <label>Status</label>
        <select name="status" value={event.status || 'draft'} onChange={onChange}>
          <option value="draft">Draft</option>
          <option value="reviewed">Reviewed</option>
          <option value="published">Published</option>
        </select>
      </div>
    </div>
    <div className="edit-field">
      <label>Description</label>
      <textarea name="description" rows={3} value={event.description || ''} onChange={onChange} />
    </div>
    <div className="edit-field">
      <label>Push Message</label>
      <textarea name="pushMessage" rows={2} value={event.pushMessage || ''} onChange={onChange} />
    </div>
  </div>
)
