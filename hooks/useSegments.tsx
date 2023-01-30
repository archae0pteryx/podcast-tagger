import { createContext, useContext, useEffect, useState } from 'react'
import { usePeaks } from './usePeaks'

const TAGGED_COLOR = 'red'
const DEFAULT_COLOR = 'blue'

const SegmentContext = createContext({
  selectedSegment: null,
  addSegment: () => {},
  deleteSegment: () => {},
  untagSegment: () => {},
  segments: [],
})

export const SegmentProvider = ({ children }) => {
  const { peaks } = usePeaks()
  const [selectedSegment, setSelectedSegment] = useState<any>(null)

  const isWithinFuzz = (seg) => {
    const cursorTime = peaks.player.getCurrentTime()
    const fuzz = 0.1
    const low = seg.startTime - fuzz
    const high = seg.endTime + fuzz
    return cursorTime >= low && cursorTime <= high
  }

  const findWithinFuzz = () => {
    const found =
      peaks?.segments?.getSegments().find((seg) => isWithinFuzz(seg)) || null
    return found
  }

  const addSegment = () => {
    const time = peaks.player.getCurrentTime()
    if (findWithinFuzz()) {
      return
    }
    if (time >= 1) {
      const newSeg = peaks.segments.add({
        id: time.toString(),
        startTime: time,
        endTime: time + 0.5,
        color: DEFAULT_COLOR,
        editable: true,
      })
      setSelectedSegment(newSeg)
    }
  }

  const deleteSegment = () => {
    if (!selectedSegment) {
      return
    }
    peaks.segments.removeById(selectedSegment.id)
    setSelectedSegment(null)
  }



  const untagSegment = () => {
    const seg = findWithinFuzz()
    seg.update({ labelText: '', color: DEFAULT_COLOR, editable: true })
  }
  useEffect(() => {
    if (peaks) {
      const onSegmentClick = (e) => {
        setSelectedSegment(e.segment)
      }

      const onZoomClick = (e) => {
        setSelectedSegment(e.segment || null)
      }

      const dragEnd = (e) => {
        setSelectedSegment({
          ...selectedSegment,
          startTime: e.segment.startTime,
          endTime: e.segment.endTime,
        })
      }

      peaks.on('segments.click', onSegmentClick)
      peaks.on('zoomview.click', onZoomClick)
      peaks.on('segments.dragend', dragEnd)

      return () => {
        peaks.off('segments.click', onSegmentClick)
        peaks.off('zoomview.click', onZoomClick)
        peaks.off('segments.dragend', dragEnd)
      }
    }
  }, [peaks])

  const segments = peaks?.segments.getSegments() || []

  return (
    <SegmentContext.Provider
      value={{
        segments,
        selectedSegment,
        addSegment,
        deleteSegment,
        untagSegment,
      }}
    >
      {children}
    </SegmentContext.Provider>
  )
}

export const useSegments = () => useContext(SegmentContext)
