import api from './api'

export interface LoginResponse {
  access_token: string
  user: { id: string; username: string; role: string }
}

export interface LoginPayload {
  username: string
  password: string
}

export const login = (data: LoginPayload) => {
  return api.post<LoginResponse, LoginResponse>('/auth/login', data)
}
