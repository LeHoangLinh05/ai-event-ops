import { useState } from 'react'
import { Wand2, RotateCcw } from 'lucide-react'
import { aiService } from '@/services/apiService'
import { LoadingSpinner } from '@/components'
import { EventInput, AIGeneratedContent } from '@/types'
import './EventGenerator.css'

export const EventGenerator = () => {
  const [input, setInput] = useState<EventInput>({
    eventType: '',
    theme: '',
    targetSegment: '',
    duration: 7,
    reward: '',
    tone: 'exciting',
  })

  const [aiOutput, setAiOutput] = useState<AIGeneratedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInput(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }))
  }

  const handleGenerateEvent = async () => {
    if (!input.eventType || !input.theme || !input.targetSegment || !input.reward) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await aiService.generateEvent(input)
      setAiOutput(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate event')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateField = async (field: keyof AIGeneratedContent) => {
    try {
      setLoading(true)
      const response = await aiService.regenerateField(field, input)
      setAiOutput(prev => prev ? { ...prev, [field]: response.data[field] } : null)
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to regenerate ${field}`)
    } finally {
      setLoading(false)
    }
  }

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
              <div className="form-field">
                <label>Duration (days) *</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  max="90"
                  value={input.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

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
              disabled={loading}
            >
              <Wand2 size={18} />
              {loading ? 'Generating...' : 'Generate with AI'}
            </button>
          </form>
        </div>

        {/* AI Output Section */}
        <div className="output-section">
          <h2 className="section-title">AI Generated Content</h2>

          {loading && <LoadingSpinner message="Generating event content..." />}

          {aiOutput && !loading && (
            <div className="output-content">
              <div className="output-field">
                <div className="output-header">
                  <label>Event Title</label>
                  <button
                    className="btn-regenerate"
                    onClick={() => handleRegenerateField('title')}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <p className="output-value">{aiOutput.title}</p>
              </div>

              <div className="output-field">
                <div className="output-header">
                  <label>Description</label>
                  <button
                    className="btn-regenerate"
                    onClick={() => handleRegenerateField('description')}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <p className="output-value">{aiOutput.description}</p>
              </div>

              <div className="output-field">
                <div className="output-header">
                  <label>Push Notification</label>
                  <button
                    className="btn-regenerate"
                    onClick={() => handleRegenerateField('pushMessage')}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <p className="output-value">{aiOutput.pushMessage}</p>
              </div>

              <div className="output-field">
                <div className="output-header">
                  <label>Participation Rules</label>
                  <button
                    className="btn-regenerate"
                    onClick={() => handleRegenerateField('rules')}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <ul className="output-list">
                  {aiOutput.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="output-field">
                <div className="output-header">
                  <label>Reward Suggestion</label>
                  <button
                    className="btn-regenerate"
                    onClick={() => handleRegenerateField('rewardSuggestion')}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <p className="output-value">{aiOutput.rewardSuggestion}</p>
              </div>

              <div className="output-actions">
                <button className="btn btn-secondary">Save Draft</button>
                <button className="btn btn-primary">Publish Event</button>
              </div>
            </div>
          )}

          {!aiOutput && !loading && (
            <div className="placeholder">
              <p>AI generated content will appear here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
