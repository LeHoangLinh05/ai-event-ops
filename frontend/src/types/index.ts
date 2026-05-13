// Event Types
export interface EventInput {
  eventType: string
  theme: string
  targetSegment: string
  duration: number
  reward: string
  tone: string
}

export interface AIGeneratedContent {
  title: string
  description: string
  pushMessage: string
  rules: string[]
  rewardSuggestion: string
}

export interface Event extends EventInput {
  _id: string
  aiContent: AIGeneratedContent
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  eventCode?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalEvents: number
  draftEvents: number
  publishedEvents: number
  aiGenerationsToday: number
}

// Toast Notification
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}
