import { useState } from 'react'
import { usePeaks } from './usePeaks'

const TAGGED_COLOR = 'red'
const DEFAULT_COLOR = 'blue'

export const useSegments = () => {
  const { peaks } = usePeaks()
  const [selectedSegment, setSelectedSegment] = useState<any>(null)

  const isWithinFuzz = (seg) => {
    const cursorTime = peaks.player.getCurrentTime()
    const fuzz = 0.5
    const low = seg.startTime - fuzz
    const high = seg.endTime + fuzz
    return cursorTime >= low && cursorTime <= high
  }

  const findWithinFuzz = () => {
    return (
      peaks?.segments?.getSegments().find((seg) => isWithinFuzz(seg)) || null
    )
  }

  const addSegment = () => {
    const existingSeg = findWithinFuzz()
    if (existingSeg) {
      existingSeg.update({ color: 'white' })
      setSelectedSegment(existingSeg)
      return
    }
    const time = peaks.player.getCurrentTime()

    const newSeg = peaks.segments.add({
      id: time.toString(),
      startTime: time,
      endTime: time + 0.5,
      color: DEFAULT_COLOR,
      editable: true,
    })
    setSelectedSegment(newSeg)
  }

  const deleteSegment = () => {
    if (!selectedSegment) {
      return
    }
    peaks.segments.removeById(selectedSegment.id)
    setSelectedSegment(null)
  }

  const tagSegment = (labelText: string) => {
    if (selectSegment) {
      const seg = findWithinFuzz()
      seg.update({ labelText, color: TAGGED_COLOR, editable: false })
    }
  }

  const untagSegment = () => {
    const seg = findWithinFuzz()
    seg.update({ labelText: '', color: DEFAULT_COLOR, editable: true })
  }

  const selectSegment = () => {
    const seg = findWithinFuzz()
    setSelectedSegment(seg)
  }

  const segments = peaks?.segments.getSegments() || []

  return {
    segments,
    selectSegment,
    selectedSegment,
    addSegment,
    deleteSegment,
    untagSegment,
    tagSegment,
  }
}
