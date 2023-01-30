import { useAudioData } from '@/hooks/useAudioData'
import { usePeaks } from '@/hooks/usePeaks'
import { useSegments } from '@/hooks/useSegments'
import { Backdrop, CircularProgress, Container } from '@mui/material'
import { Section } from './Section'

const styles = {
  minWidth: '500px',
  height: '150px',
  margin: '0 0 1rem 0',
  backgroundColor: '#333',
}

export const AudioPlayer = () => {
  const { audioSrc, loading: audioDataLoading } = useAudioData()
  const { addSegment } = useSegments()

  const {
    loading: peaksLoading,
    audioRef,
    zoomViewRef,
    overviewRef,
  } = usePeaks()

  if (!audioSrc) {
    return <></>
  }

  const loading = audioDataLoading || peaksLoading

  const handleClick = () => {
    addSegment()
  }

  return (
    <Section>
      <LoadingOverlay loading={loading} />
      <Container
        maxWidth="xl"
        sx={{
          paddingTop: '1rem',
        }}
      >
        <div onClick={handleClick} style={styles} ref={overviewRef}></div>
        <div onClick={handleClick} style={styles} ref={zoomViewRef}></div>
        <audio ref={audioRef} controls style={{ width: '100%' }}>
          <source src={audioSrc} type="audio/mpeg" />
        </audio>
      </Container>
    </Section>
  )
}

const LoadingOverlay = ({ loading }: { loading: boolean }) =>
  loading && (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
