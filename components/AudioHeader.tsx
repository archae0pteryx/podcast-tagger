import { useAudioData } from '@/hooks/useAudioData'
import { usePeaks } from '@/hooks/usePeaks'
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
    <Paper elevation={6}>
      <Box p={2} sx={styles} display="flex" alignItems="center" gap={3}>
        <TextField
          variant="outlined"
          color="info"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          fullWidth
        />
        <Button onClick={handleLoad}>Load</Button>
      </Box>
    </Paper>
  )
}

export const AudioHeader = () => {
  const { filename, audioSrc, loading: audioDataLoading } = useAudioData()
  const { loading: peaksLoading } = usePeaks()

  const loading = audioDataLoading || peaksLoading

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        height={styles.height}
        width={styles.width}
      />
    )
  }

  if (!audioSrc) {
    return <LoadAudioForm />
  }

  return (
    <Section>
      <Box sx={styles} mr={4} display="flex" justifyContent="flex-end">
        <Typography variant="h6">{filename}</Typography>
      </Box>
    </Section>
  )
}
