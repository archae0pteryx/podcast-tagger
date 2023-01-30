import { encode, fetcher, IAudioData } from '@/modules'
import { createContext, useContext, useEffect, useState } from 'react'

type AudioDataContext = IAudioData & {
  error?: string
  loading: boolean
  setAudioSrc: (src: string) => void
  audioSrc: string
}

const AudioDataContext = createContext<AudioDataContext>({
  stt: {},
  filename: '',
  waveform: {},
  error: '',
  loading: false,
  setAudioSrc: () => {},
  audioSrc: '',
})

export const AudioDataProvider = ({ children }) => {
  const [audioSrc, setAudioSrc] = useState<string>('')
  const [audioData, setAudioData] = useState<IAudioData>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadData = async (url: string) => {
    try {
      setLoading(true)
      const data = await fetcher('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_src: encode(url),
        }),
      })

      setAudioData(data)
      setLoading(false)
    } catch (err) {
      console.error(err.message)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (audioSrc) {
      loadData(audioSrc)
    }
  }, [audioSrc])

  return (
    <AudioDataContext.Provider
      value={{
        stt: audioData?.stt || {},
        filename: audioData?.filename || '',
        waveform: audioData?.waveform,
        error,
        loading,
        setAudioSrc,
        audioSrc,
      }}
    >
      {children}
    </AudioDataContext.Provider>
  )
}

export const useAudioData = () => useContext(AudioDataContext)
