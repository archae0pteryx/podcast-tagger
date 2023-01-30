import { PeaksInstance, PeaksOptions } from 'peaks.js'
import { useState, useEffect, createContext, useContext, useRef } from 'react'
import { useAudioData } from './useAudioData'

const PeaksContext = createContext({
  peaks: null,
  loading: false,
  error: '',
  audioRef: null,
  overviewRef: null,
  zoomViewRef: null,
})

export const PeaksProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const overviewRef = useRef<HTMLDivElement>(null)
  const zoomViewRef = useRef<HTMLDivElement>(null)

  const [peaks, setPeaks] = useState<PeaksInstance>(null)
  const { audioSrc, waveform } = useAudioData()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canLoadPeaks =
    !!audioSrc &&
    !!audioRef?.current &&
    !!overviewRef?.current &&
    !!zoomViewRef?.current &&
    !!waveform

  useEffect(() => {
    ;(async () => {
      if (!canLoadPeaks) return
      setLoading(true)
      const Peaks = (await import('peaks.js')).default
      console.log('loading peaks')
      const config: PeaksOptions = {
        zoomview: {
          container: zoomViewRef.current,
          playedWaveformColor: '#92DCE5',
          axisGridlineColor: '#EEE5E9',
          axisLabelColor: '#EEE5E9',
        },
        overview: {
          container: overviewRef.current,
          playedWaveformColor: '#92DCE5',
          axisGridlineColor: '#EEE5E9',
          axisLabelColor: '#EEE5E9',
        },
        mediaElement: audioRef.current,
        waveformColor: '#7C7C7C',
        playheadColor: '#fff',
        fontSize: 14,
        zoomLevels: [512, 1024, 2048, 4096],
        keyboard: true,
        waveformData: {
          json: waveform,
        },
        segmentColor: '#ff8',
      }

      Peaks.init(config, (err, peaks) => {
        if (err) {
          console.error('Failed to initialize Peaks instance: ' + err.message)
          setError(err.message)
          return
        }

        console.log('Peaks instance initialized')
        setPeaks(peaks)
        setLoading(false)
      })
      return () => peaks.destroy()
    })()
  }, [canLoadPeaks, audioSrc, audioRef, overviewRef, zoomViewRef, waveform])
  return (
    <PeaksContext.Provider
      value={{
        peaks,
        error,
        loading,
        audioRef,
        overviewRef,
        zoomViewRef,
      }}
    >
      {children}
    </PeaksContext.Provider>
  )
}

export const usePeaks = () => useContext(PeaksContext)
