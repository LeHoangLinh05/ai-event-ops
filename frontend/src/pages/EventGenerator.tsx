import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wand2, RotateCcw, Save, Send, Loader2, Plus, Trash2 } from 'lucide-react'
import { aiService, eventService } from '@/services/apiService'
import { LoadingSpinner } from '@/components'
import { useToastContext } from '@/contexts/ToastContext'
import { EventInput, AIGeneratedContent } from '@/types'
import './EventGenerator.css'

type FieldKey = keyof AIGeneratedContent

export const EventGenerator = () => {
  const [input, setInput] = useState<EventInput>({
    eventType: '',
    theme: '',
    targetSegment: '',
    startDate: '',
    endDate: '',
    duration: 7,
    reward: '',
    tone: 'exciting',
  })

  const [aiOutput, setAiOutput] = useState<AIGeneratedContent | null>(null)
  const [globalLoading, setGlobalLoading] = useState(false)
  const [fieldLoading, setFieldLoading] = useState<Partial<Record<FieldKey, boolean>>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { addToast } = useToastContext()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInput(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }))
  }

  // Auto-calculate duration when dates change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInput(prev => {
      const updated = { ...prev, [name]: value }
      const start = name === 'startDate' ? value : prev.startDate
      const end = name === 'endDate' ? value : prev.endDate
      if (start && end) {
        const diffMs = new Date(end).getTime() - new Date(start).getTime()
        const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
        updated.duration = diffDays
      }
      return updated
    })
  }

  // Update a single text field directly
  const handleOutputChange = (field: FieldKey, value: string) => {
    setAiOutput(prev => prev ? { ...prev, [field]: value } : null)
  }

  // Update a single rule by index
  const handleRuleChange = (idx: number, value: string) => {
    setAiOutput(prev => {
      if (!prev) return null
      const newRules = [...(prev.rules || [])]
      newRules[idx] = value
      return { ...prev, rules: newRules }
    })
  }

  // Add a new empty rule
  const handleAddRule = () => {
    setAiOutput(prev => prev ? { ...prev, rules: [...(prev.rules || []), ''] } : null)
  }

  // Remove a rule by index
  const handleRemoveRule = (idx: number) => {
    setAiOutput(prev => {
      if (!prev) return null
      const newRules = prev.rules.filter((_, i) => i !== idx)
      return { ...prev, rules: newRules }
    })
  }

  const handleGenerateEvent = async () => {
    if (!input.eventType || !input.theme || !input.targetSegment || !input.reward) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setGlobalLoading(true)
      setError(null)
      const response = await aiService.generateEvent(input)
      setAiOutput(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate event')
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleRegenerateField = async (field: FieldKey) => {
    try {
      // Only set loading for THIS field
      setFieldLoading(prev => ({ ...prev, [field]: true }))
      const response = await aiService.regenerateField(field, input)
      let newValue = response.data.data[field]

      // Ensure rules is always an array
      if (field === 'rules' && !Array.isArray(newValue)) {
        newValue = typeof newValue === 'string'
          ? newValue.split('\n').filter((s: string) => s.trim())
          : []
      }

      setAiOutput(prev => prev ? { ...prev, [field]: newValue } : null)
    } catch (err: any) {
      addToast(`Failed to regenerate ${field}`, 'error')
    } finally {
      // Only clear loading for THIS field
      setFieldLoading(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleSaveEvent = async (status: 'draft' | 'published') => {
    if (!aiOutput) return

    try {
      setSaving(true)
      const eventData = {
        ...input,
        title: aiOutput.title,
        description: aiOutput.description,
        pushMessage: aiOutput.pushMessage,
        rules: aiOutput.rules,
        rewardSuggestion: aiOutput.rewardSuggestion,
        aiContent: aiOutput,
        status: status
      }

      await eventService.createEvent(eventData as any)
      addToast(`Event ${status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success')
      navigate('/events')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event')
      addToast('Failed to save event', 'error')
    } finally {
      setSaving(false)
    }
  }

  const RegenerateButton = ({ field }: { field: FieldKey }) => (
    <button
      className="btn-regenerate"
      onClick={() => handleRegenerateField(field)}
      disabled={fieldLoading[field]}
      title="Regenerate this field"
    >
      {fieldLoading[field]
        ? <Loader2 size={16} className="spin" />
        : <RotateCcw size={16} />
      }
    </button>
  )

  return (
    <div className="event-generator">
      <h1 className="page-title">Event Generator</h1>

      <div className="generator-grid">
        {/* Form Input Section */}
        <div className="form-section">
          <h2 className="section-title">Create Event Input</h2>

          {error && <div className="error-message">{error}</div>}

          <form className="form-group">
            <div className="form-row">
              <div className="form-field">
                <label>Event Type *</label>
                <input
                  type="text"
                  name="eventType"
                  placeholder="e.g., Top Recharge, Dungeon Rush"
                  value={input.eventType}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field">
                <label>Theme *</label>
                <input
                  type="text"
                  name="theme"
                  placeholder="e.g., Summer Festival"
                  value={input.theme}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Target Segment *</label>
                <input
                  type="text"
                  name="targetSegment"
                  placeholder="e.g., VIP Players, Whales"
                  value={input.targetSegment}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={input.startDate}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-field">
                <label>End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={input.endDate}
                  min={input.startDate || undefined}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            {input.startDate && input.endDate && (
              <div className="duration-badge">
                🗓️ Duration: <strong>{input.duration} day{input.duration !== 1 ? 's' : ''}</strong>
                &nbsp;({new Date(input.startDate).toLocaleDateString()} → {new Date(input.endDate).toLocaleDateString()})
              </div>
            )}

            <div className="form-row">
              <div className="form-field">
                <label>Reward *</label>
                <input
                  type="text"
                  name="reward"
                  placeholder="e.g., 500 diamonds"
                  value={input.reward}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field">
                <label>Tone</label>
                <select name="tone" value={input.tone} onChange={handleInputChange}>
                  <option value="exciting">Exciting</option>
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGenerateEvent}
              disabled={globalLoading}
            >
              <Wand2 size={18} />
              {globalLoading ? 'Generating...' : 'Generate with AI'}
            </button>
          </form>
        </div>

        {/* AI Output Section */}
        <div className="output-section">
          <h2 className="section-title">AI Generated Content</h2>

          {globalLoading && <LoadingSpinner message="Generating event content..." />}

          {aiOutput && !globalLoading && (
            <div className="output-content">

              {/* Event Title */}
              <div className="output-field">
                <div className="output-header">
                  <label>Event Title</label>
                  <RegenerateButton field="title" />
                </div>
                <input
                  className={`output-input ${fieldLoading.title ? 'field-loading' : ''}`}
                  type="text"
                  value={aiOutput.title}
                  onChange={e => handleOutputChange('title', e.target.value)}
                  disabled={fieldLoading.title}
                  placeholder="Event title..."
                />
              </div>

              {/* Description */}
              <div className="output-field">
                <div className="output-header">
                  <label>Description</label>
                  <RegenerateButton field="description" />
                </div>
                <textarea
                  className={`output-textarea ${fieldLoading.description ? 'field-loading' : ''}`}
                  value={aiOutput.description}
                  onChange={e => handleOutputChange('description', e.target.value)}
                  disabled={fieldLoading.description}
                  rows={3}
                  placeholder="Event description..."
                />
              </div>

              {/* Push Notification */}
              <div className="output-field">
                <div className="output-header">
                  <label>Push Notification</label>
                  <RegenerateButton field="pushMessage" />
                </div>
                <input
                  className={`output-input ${fieldLoading.pushMessage ? 'field-loading' : ''}`}
                  type="text"
                  value={aiOutput.pushMessage}
                  onChange={e => handleOutputChange('pushMessage', e.target.value)}
                  disabled={fieldLoading.pushMessage}
                  placeholder="Push message..."
                />
              </div>

              {/* Participation Rules */}
              <div className="output-field">
                <div className="output-header">
                  <label>Participation Rules</label>
                  <div className="output-header-actions">
                    <button
                      className="btn-add-rule"
                      onClick={handleAddRule}
                      title="Add rule"
                      disabled={fieldLoading.rules}
                    >
                      <Plus size={14} /> Add
                    </button>
                    <RegenerateButton field="rules" />
                  </div>
                </div>
                {fieldLoading.rules ? (
                  <div className="field-loading-overlay">
                    <Loader2 size={20} className="spin" /> Regenerating rules...
                  </div>
                ) : (
                  <ul className="rules-edit-list">
                    {aiOutput.rules?.map((rule, idx) => (
                      <li key={idx} className="rule-edit-item">
                        <input
                          className="output-input rule-input"
                          type="text"
                          value={rule}
                          onChange={e => handleRuleChange(idx, e.target.value)}
                          placeholder={`Rule ${idx + 1}...`}
                        />
                        <button
                          className="btn-remove-rule"
                          onClick={() => handleRemoveRule(idx)}
                          title="Remove rule"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Reward Suggestion */}
              <div className="output-field">
                <div className="output-header">
                  <label>Reward Suggestion</label>
                  <RegenerateButton field="rewardSuggestion" />
                </div>
                <input
                  className={`output-input ${fieldLoading.rewardSuggestion ? 'field-loading' : ''}`}
                  type="text"
                  value={aiOutput.rewardSuggestion}
                  onChange={e => handleOutputChange('rewardSuggestion', e.target.value)}
                  disabled={fieldLoading.rewardSuggestion}
                  placeholder="Reward suggestion..."
                />
              </div>

              <div className="output-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSaveEvent('draft')}
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSaveEvent('published')}
                  disabled={saving}
                >
                  <Send size={18} />
                  {saving ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </div>
          )}

          {!aiOutput && !globalLoading && (
            <div className="placeholder">
              <Wand2 size={48} opacity={0.2} />
              <p>AI generated content will appear here...</p>
              <p className="placeholder-sub">Fill in the form and click <strong>Generate with AI</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
