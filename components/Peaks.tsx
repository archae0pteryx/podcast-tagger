'use client'

import { useEffect, useRef, useState } from 'react'
import WaveformDataJSON from './sn-906.waveform.json'
import SttJSON from './sn-906.stt.json'

const styles = {
  // width: '1000px',
  height: '100px',
}

export const PeaksAudio = () => {
  const [selectedPoint, setSelectedPoint] = useState<any>(null)
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [tags, setTags] = useState<any[]>([])
  const [newTag, setNewTag] = useState('')
  const [peaks, setPeaks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const audioRef = useRef(null)
  const overviewRef = useRef(null)
  const zoomViewRef = useRef(null)

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
          waveformData: {
            json: WaveformDataJSON as any,
          },
        },
        function (err, peaks) {
          if (err) {
            console.error('Failed to initialize Peaks instance: ' + err.message)
            setError(err.message)
            return
          }
          const view = peaks.views.getView('zoomview')
          view.fitToContainer()
          view.setAmplitudeScale(2)

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

  const isWithinFuzz = (clickedTime, startTime = 0, endTime = 0) => {
    const fuzz = 0.5
    const low = startTime - fuzz
    const high = endTime + fuzz
    return clickedTime >= low && clickedTime <= high
  }

  const handleClick = () => {
    const time = peaks.player.getCurrentTime()

    if (selectedSegment) {
      const clickedInSegment = isWithinFuzz(
        time,
        selectedSegment.startTime,
        selectedSegment.endTime
      )
      if (clickedInSegment) {
        console.log('inside')
        return
      } else {
        peaks.segments.remove(selectedSegment)
        const seg = peaks.segments.add({
          id: time,
          startTime: time,
          endTime: time + 0.5,
          editable: true
        })
        setSelectedSegment(seg)
      }
    } else {
      const seg = peaks.segments.add({
        id: time,
        startTime: time,
        endTime: time + 0.1,
        editable: true
      })
      setSelectedSegment(seg)
    }
  }

  const handleClickOverview = () => {
    const time = peaks.player.getCurrentTime()
    const clickedInPoint = tags.some((tag) => {
      return isWithinFuzz(time, tag.time, tag.time)
    })
    if (clickedInPoint) {
      return
    }

    setTags([...tags, newTag])
    setNewTag('')
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        margin: '2rem',
      }}
    >
      {loading && <p>Loading...</p>}
      <div style={styles} ref={zoomViewRef} onClick={handleClick}></div>
      <div style={styles} ref={overviewRef} onClick={handleClickOverview}></div>
      <audio ref={audioRef} controls>
        <source src="/sn-906.mp3" type="audio/mpeg" />
      </audio>
      {error && <h3>{error}</h3>}
      <div>
        <h3>Selected Point</h3>
        <p>Time: {selectedPoint?.time || 0}</p>
        <p>Label: {selectedPoint?.labelText || ''}</p>
      </div>
      <div>
        <h3>Selected Segment</h3>
        <p>Time: {selectedSegment?.time || 0}</p>
        <p>Label: {selectedSegment?.labelText || ''}</p>
      </div>
    </div>
  )
}
