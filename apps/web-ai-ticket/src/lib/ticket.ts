import api from './api'

export interface Ticket {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
  user: { username: string }
}

export const getTickets = () => api.get<Ticket[], Ticket[]>('/tickets')
