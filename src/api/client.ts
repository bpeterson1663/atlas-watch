import { ApiError } from './error'

const DEFAULT_API_BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init)

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
