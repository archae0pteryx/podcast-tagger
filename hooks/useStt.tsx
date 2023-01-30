import { createContext, useContext, useEffect, useState } from 'react'
import { useAudioData } from './useAudioData'
import { useSegments } from './useSegments'

const SttContext = createContext({
  wordsInRange: '',
})

export const SttProvider = ({ children }) => {
  const { stt } = useAudioData()
  const [wordsInRange, setWordsInRange] = useState<string>('')
  const { selectedSegment } = useSegments()

  useEffect(() => {
    const from = selectedSegment?.startTime || 0
    const to = selectedSegment?.endTime || 0
    if (!from || !to) {
      return
    }
    const words =
      stt
        .filter((word) => word.start_time >= from && word.start_time <= to)
        .map((words) => words.word)
        .join(' ') || ''
    setWordsInRange(words)
  }, [selectedSegment?.startTime, selectedSegment?.endTime, stt])

  return (
    <SttContext.Provider
      value={{
        wordsInRange,
      }}
    >
      {children}
    </SttContext.Provider>
  )
}

export const useStt = () => useContext(SttContext)
