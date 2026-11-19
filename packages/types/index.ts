export interface User {
  id: string
  username: string
  role: 'ADMIN' | 'USER'
}

export interface Ticket {
  id: string
  title: string
  status: 'OPEN' | 'CLOSED'
  createdAt: string
}
