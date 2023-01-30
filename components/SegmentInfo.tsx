import { useSegments } from '@/hooks/useSegments'
import { useStt } from '@/hooks/useStt'
import { Grid, Paper, Typography } from '@mui/material'
import { Section } from './Section'

export const SegmentInfo = () => {
  const { selectedSegment } = useSegments()
  const { wordsInRange } = useStt()

  if (!selectedSegment) {
    return <></>
  }

  return (
    <Section>
      <Grid container spacing={2}>
        <Grid item xs={12} display="flex">
          <Paper>{selectedSegment?.labelText || 'No Label'}</Paper>
        </Grid>
        <Grid item xs={12}>
          {wordsInRange && <Typography>{wordsInRange}</Typography>}
        </Grid>
      </Grid>
    </Section>
  )
}
