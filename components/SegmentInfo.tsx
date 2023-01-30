import { useAudioData } from '@/hooks/useAudioData'
import { usePeaks } from '@/hooks/usePeaks'
import { useSegments } from '@/hooks/useSegments'
import {
  Alert,
  Paper,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'

const styles = {
  width: 'auto',
  height: 'auto',
}

export const SegmentInfo = () => {
  const {
    loading: audioDataLoading,
    error: audioDataError,
  } = useAudioData()
  const { loading: peaksLoading, error: peaksError } = usePeaks()
  const { selectedSegment } = useSegments()

  return (
    <Paper elevation={6}>
      <Box sx={styles} p={2}>
        {selectedSegment ? (
          <Typography variant="body1">
            {selectedSegment?.labelText || 'No label'}
            {selectedSegment.start} - {selectedSegment.end}
          </Typography>
        ) : (
          <Typography>No segment selected</Typography>
        )}
      </Box>
      {peaksError && <Alert severity="error">{peaksError}</Alert>}
      {audioDataError && <Alert severity="error">{audioDataError}</Alert>}
    </Paper>
  )
}
