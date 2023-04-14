import { createContext, useContext, useEffect, useState } from 'react'
import { usePeaks } from './usePeaks'

const TAGGED_COLOR = 'rgba(0, 225, 128, 0.5)'
const DEFAULT_COLOR = 'rgba(0, 225, 128, 1)'

const SegmentContext = createContext({
  selectedSegment: null,
  addSegment: (_text: string) => {},
  deleteSegment: () => {},
  editSegment: (text: string) => {},
  segments: [],
  cursorLocation: 0,
  clicked: false
})

export const SegmentProvider = ({ children }) => {
  const [clicked, setClicked] = useState<boolean>(false)
  const { peaks } = usePeaks()
  const [selectedSegment, setSelectedSegment] = useState<any>(null)

  const checkInFuzzZone = (seg) => {
    if (!seg) return false
    const cursorTime = peaks.player.getCurrentTime()
    const fuzz = 0.1
    const low = seg.startTime - fuzz
    const high = seg.endTime + fuzz
    return cursorTime >= low && cursorTime <= high
  }

  const findWithinFuzz = () => {
    const found =
      peaks?.segments?.getSegments().find((seg) => checkInFuzzZone(seg)) || null
    return found
  }

  const addSegment = () => {
    const time = peaks.player.getCurrentTime()
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
    const thisSegment = findWithinFuzz()
    if (thisSegment) {
      peaks.segments.removeById(thisSegment.id)
      setSelectedSegment(null)
    }
  }

  const editSegment = (text: string) => {
    const seg = findWithinFuzz()
    seg.update({ labelText: text, color: TAGGED_COLOR, editable: true })
  }

  useEffect(() => {
    if (peaks) {
      const onSegmentClick = (e) => {
        setSelectedSegment(e.segment)
      }

      const onZoomClick = (e) => {
        setSelectedSegment(e.segment || null)
        setClicked(true)
      }

      const onOverviewClick = (e) => {
        setSelectedSegment(e.segment || null)
        setClicked(true)
      }

      const dragEnd = (e) => {
        setSelectedSegment({
          ...selectedSegment,
          startTime: e.segment.startTime,
          endTime: e.segment.endTime,
        })
      }

      const onMouseEnter = (e) => {
        console.log('on mouse enter')
      }

      const onZoomDblClick = (e) => {
        addSegment()
        setSelectedSegment(e.segment)
      }

      const onOverviewDblClick = (e) => {
        addSegment()
        setSelectedSegment(e.segment)
      }

      peaks.on('segments.click', onSegmentClick)
      peaks.on('zoomview.click', onZoomClick)
      peaks.on('overview.click', onOverviewClick)
      peaks.on('segments.dragend', dragEnd)
      peaks.on('segments.mouseenter', onMouseEnter)
      peaks.on('zoomview.dblclick', onZoomDblClick)
      peaks.on('overview.dblclick', onOverviewDblClick)
      return () => {
        peaks.off('segments.click', onSegmentClick)
        peaks.off('zoomview.click', onZoomClick)
        peaks.off('segments.dragend', dragEnd)
        peaks.off('segments.mouseenter', onMouseEnter)
        peaks.off('zoomview.dblclick', onZoomDblClick)
        peaks.off('overview.dblclick', onOverviewDblClick)
      }
    }
  }, [peaks])

  const segments = peaks?.segments.getSegments() || []
  const cursorLocation = peaks?.player.getCurrentTime() || 0

  return (
    <SegmentContext.Provider
      value={{
        segments,
        selectedSegment,
        addSegment,
        deleteSegment,
        editSegment,
        cursorLocation,
        clicked,
      }}
    >
      {children}
    </SegmentContext.Provider>
  )
}

export const useSegments = () => useContext(SegmentContext)
