import axios from 'axios'
import { Event, DashboardStats, EventInput, AIGeneratedContent } from '@/types'

const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Event APIs
export const eventService = {
  getEvents: (page = 1, limit = 10, status?: string, type?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (status) params.append('status', status)
    if (type) params.append('type', type)
    return apiClient.get<{ events: Event[], total: number }>(`/events?${params}`)
  },

  getEventById: (id: string) => apiClient.get<Event>(`/events/${id}`),

  createEvent: (data: Event) => apiClient.post<Event>('/events', data),

  updateEvent: (id: string, data: Partial<Event>) => 
    apiClient.put<Event>(`/events/${id}`, data),

  deleteEvent: (id: string) => apiClient.delete(`/events/${id}`),
}

// AI Generation APIs
export const aiService = {
  generateEvent: (input: EventInput) =>
    apiClient.post<AIGeneratedContent>('/ai/generate-event', input),

  regenerateField: (field: 'title' | 'description' | 'pushMessage' | 'rules' | 'rewardSuggestion', input: EventInput) =>
    apiClient.post<{ [key: string]: string | string[] }>('/ai/regenerate-field', { field, context: input }),
}

// Dashboard APIs
export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),
}

export default apiClient
