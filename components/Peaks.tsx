'use client'

import { useEffect, useRef, useState } from 'react'
import DataJSON from './sn-906.json'
const styles = {
  width: '1000px',
  height: '100px',
}

export const PeaksAudio = () => {
  const [peaks, setPeaks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const audioRef = useRef(null)
  const overviewRef = useRef(null)
  const zoomViewRef = useRef(null)
  const audioContext = new AudioContext()

  useEffect(() => {
    const load = async () => {
      const Peaks = (await import('peaks.js')).default
      Peaks.init(
        {
          zoomview: {
            container: zoomViewRef.current,
          },
          overview: {
            container: overviewRef.current,
          },
          mediaElement: audioRef.current,
          logger: console.error,
          waveformData: {
            json: DataJSON as any,
          },
        },
        function (err, peaks) {
          if (err) {
            console.error('Failed to initialize Peaks instance: ' + err.message)
            setError(err.message)
            return
          }
          setPeaks(peaks)
          setLoading(false)
        }
      )
    }
    if (audioRef.current && overviewRef.current && zoomViewRef.current) {
      load()
    }
    return () => {
      if (peaks) {
        peaks.destroy()
      }
    }
  }, [])

  const addSegment = () => {
    peaks.segments.add({
      startTime: 0,
      endTime: 10,
      editable: true,
      color: 'rgba(0, 0, 255, 0.5)',
      labelText: 'Test',
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1000px',
        height: '1000px',
      }}
    >
      {loading && <p>Loading...</p>}
      <div style={styles} ref={zoomViewRef}></div>
      <div style={styles} ref={overviewRef}></div>
      <audio ref={audioRef} controls>
        <source src="/sn-906.mp3" type="audio/mpeg" />
      </audio>
      <button
        style={{
          margin: 10,
          padding: 5,
        }}
        onClick={addSegment}
      >
        Add Segment
      </button>
      {error && <p>{error}</p>}
    </div>
  )
}
