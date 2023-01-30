'use client'

import { useEffect, useRef, useState } from 'react'
import WaveformDataJSON from './sn-906.waveform.json'
import SttJSON from './sn-906.stt.json'
import Konva from 'konva'
import { TextField, Button, Typography, Container, Paper } from '@mui/material'
import { Box } from '@mui/system'

const styles = {
  // width: '1000px',
  height: '100px',
}

export const PeaksAudio = () => {
  const [peaks, setPeaks] = useState(null)
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [lockedSegments, setLockedSegments] = useState<any[]>([])
  const [tag, setTag] = useState<string>('')
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const audioRef = useRef(null)
  const overviewRef = useRef(null)
  const zoomViewRef = useRef(null)

  function createSegmentLabel(options) {
    if (options.view === 'overview') {
      return null
    }

    return null
  }
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
          fontSize: 18,
          createSegmentLabel: createSegmentLabel,
        },
        function (err, peaks) {
          if (err) {
            console.error('Failed to initialize Peaks instance: ' + err.message)
            setError(err.message)
            return
          }
          const view = peaks.views.getView('zoomview')
          view.fitToContainer()
          view.setAmplitudeScale(1)

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

  const addSegment = () => {
    const time = peaks.player.getCurrentTime()
    const seg = peaks.segments.add({
      id: time,
      startTime: time,
      endTime: time + 0.5,
      editable: true,
    })
    setSelectedSegment(seg)
  }

  const handleSegmentClick = () => {
    if (!selectedSegment) {
      addSegment()
      return
    }
    const clickInsideSegment = isWithinFuzz(
      peaks.player.getCurrentTime(),
      selectedSegment.startTime,
      selectedSegment.endTime
    )
    if (!clickInsideSegment) {
      peaks.segments.remove(selectedSegment)
      addSegment()
    }
    return
  }

  const handleCreateTag = () => {
    if (!selectedSegment) {
      setError('Please select a segment first')
      return
    }
    const seg = peaks.segments.getSegment(selectedSegment.id)
    seg.update({ labelText: tag, color: 'red', editable: false })
    setTag('')
    setSelectedSegment(null)
  }

  const handleDeleteTag = (id) => {
    peaks.segments.removeById(id)
  }

  const segments = peaks?.segments.getSegments() || []
  const shouldShowSegs = segments.length > 0
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
      }}
    >
      {loading && <p>Loading...</p>}
      <div style={styles} ref={overviewRef}></div>
      <div style={styles} ref={zoomViewRef} onClick={handleSegmentClick}></div>
      <audio ref={audioRef} controls>
        <source src="/sn-906.mp3" type="audio/mpeg" />
      </audio>
      {error && (
        <Typography
          variant="h3"
          style={{
            color: 'red',
            padding: '0.5rem',
            border: '1px solid red',
            margin: '0.5rem',
          }}
        >
          {error}
        </Typography>
      )}
      <Paper
        sx={{
          padding: '1rem',
          marginTop: '2rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '1rem',
            gap: '1rem',
          }}
        >
          <>
            <TextField
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="tag name"
              variant="outlined"
              label="Tag Name"
              size="small"
              sx={{
                flex: 1,
              }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleCreateTag}
            >
              Create Tag
            </Button>
          </>
        </Box>
        {segments.length > 0 &&
          segments.map((seg) => seg.labelText && (
            <Box key={seg.id}>
              {seg.labelText}{' '}
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteTag(seg.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
      </Paper>
    </Container>
  )
}
