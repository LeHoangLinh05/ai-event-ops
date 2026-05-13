export interface EventRule {
  title: string
  description: string
}

export interface RewardItem {
  itemName: string
  quantity: number
  rarity: string
}

export interface Event {
  _id: string
  eventCode?: string
  title: string
  eventType: string
  theme: string
  targetSegment: string
  duration: number
  reward: string
  tone: string
  description: string
  pushMessage: string
  rules: EventRule[]
  rewardSuggestion: RewardItem[]
  status: 'draft' | 'reviewed' | 'published'
  createdAt: string
  updatedAt: string
}

export interface EventInput {
  eventType: string
  theme: string
  targetSegment: string
  startDate: string
  endDate: string
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

export interface AuditLog {
  _id: string
  action: string
  entityType: string
  entityId: string | null
  operator: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalEvents: number
  draftEvents: number
  publishedEvents: number
  aiGenerationsToday: number
  latestEvents: Event[]
  latestAuditLogs: AuditLog[]
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}
