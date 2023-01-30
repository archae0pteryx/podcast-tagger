'use client'

import { AudioHeader } from '@/components/AudioHeader'
import { AudioPlayer } from '@/components/AudioPlayer'
import { ControlBar } from '@/components/ControlBar'
import { SegmentInfo } from '@/components/SegmentInfo'
import { usePeaks } from '@/hooks/usePeaks'
import { Container, Grid, Paper } from '@mui/material'

export default function Home() {
  const { peaks } = usePeaks()
  return (
    <Container
      maxWidth="xl"
      sx={{
        marginTop: '1rem',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AudioHeader />
        </Grid>
        <Grid item xs={12}>
          <AudioPlayer />
        </Grid>
        {peaks && (
          <>
            <Grid item xs={12}>
              <ControlBar />
            </Grid>
            <Grid item xs={12}>
              <SegmentInfo />
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  )
}
