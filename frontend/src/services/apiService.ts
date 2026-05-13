import axios from 'axios'
import { Event, DashboardStats, EventInput, AIGeneratedContent } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Generic backend response wrapper
type ApiResponse<T> = { success: boolean; data: T }
type PaginatedResponse<T> = { success: boolean; data: T[]; pagination: { total: number; page: number; limit: number } }

// Event APIs
export const eventService = {
  getEvents: (page = 1, limit = 10, status?: string, type?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (status) params.append('status', status)
    if (type) params.append('type', type)
    return apiClient.get<PaginatedResponse<Event>>(`/events?${params}`)
  },

  getEventById: (id: string) => apiClient.get<ApiResponse<Event>>(`/events/${id}`),

  createEvent: (data: Partial<Event>) => apiClient.post<ApiResponse<Event>>('/events', data),

  updateEvent: (id: string, data: Partial<Event>) =>
    apiClient.put<ApiResponse<Event>>(`/events/${id}`, data),

  deleteEvent: (id: string) => apiClient.delete<ApiResponse<null>>(`/events/${id}`),
}

// AI Generation APIs
export const aiService = {
  generateEvent: (input: EventInput) =>
    apiClient.post<ApiResponse<AIGeneratedContent>>('/ai/generate-event', input),

  regenerateField: (field: 'title' | 'description' | 'pushMessage' | 'rules' | 'rewardSuggestion', input: EventInput) =>
    apiClient.post<ApiResponse<{ [key: string]: string | string[] }>>('/ai/regenerate-field', { field, context: input }),
}

// Dashboard APIs
export const dashboardService = {
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
}

export default apiClient
