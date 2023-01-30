import { useAudioData } from '@/hooks/useAudioData'
import { usePeaks } from '@/hooks/usePeaks'
import { useSegments } from '@/hooks/useSegments'
import { Button, Paper, Skeleton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { Section } from './Section'

const styles = {
  width: 'auto',
  height: 'auto',
}

const LoadAudioForm = () => {
  const [src, setSrc] = useState<string>('/sn-906.mp3')
  const { setAudioSrc } = useAudioData()
  const handleLoad = () => {
    setAudioSrc(src)
  }
  return (
    <Section>
      <Box display="flex" alignItems="center" gap={3}>
        <TextField
          variant="outlined"
          color="info"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          fullWidth
        />
        <Button
          color="primary"
          size="small"
          variant="contained"
          onClick={handleLoad}
        >
          Load
        </Button>
      </Box>
    </Section>
  )
}

export const AudioHeader = () => {
  const { filename, audioSrc } = useAudioData()
  const { selectedSegment } = useSegments()

  if (!audioSrc) {
    return <LoadAudioForm />
  }
  const label = selectedSegment?.labelText
  return (
    <Section>
      <Box sx={styles} mr={4} display="flex" justifyContent="space-between">
        {label ? <Typography variant="h6">{label}</Typography> : <Box></Box>}
        <Typography variant="h6">{filename}</Typography>
      </Box>
    </Section>
  )
}
