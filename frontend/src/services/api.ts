import axios from 'axios'
import type { RSVPFormData, RSVPResponse, ConfigData } from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchConfig = async (): Promise<ConfigData> => {
  const { data } = await api.get<ConfigData>('/config')
  return data
}

export const submitRSVP = async (formData: RSVPFormData): Promise<RSVPResponse> => {
  const { data } = await api.post<RSVPResponse>('/rsvp', formData)
  return data
}
