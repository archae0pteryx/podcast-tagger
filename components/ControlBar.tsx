import { useSegments } from '@/hooks/useSegments'
import { Button, Grid, Typography } from '@mui/material'
import { Section } from './Section'

export const ControlBar = () => {
  const { addSegment } = useSegments()
  return (
    <Section>
      <Grid container spacing={2}>
        <Grid
          item
          
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={addSegment}>Add Tag</Button>
        </Grid>
        <Grid
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={addSegment}>Delete</Button>
        </Grid>
      </Grid>
    </Section>
  )
}
