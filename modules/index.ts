export { encode, decode, type IAudioData } from './peaks'

export const fetcher = async (url: string, config?: RequestInit) => {
  const res = await fetch(url, config)
  if (!res.ok) throw new Error(res.statusText)
  const data = await res.json()
  return data
}
