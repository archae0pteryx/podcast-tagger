import { useSegments } from '@/hooks/useSegments'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Section } from './Section'

export const ControlBar = () => {
  const [labelText, setLabelText] = useState<string>('')
  const { addSegment, deleteSegment, selectedSegment, clicked } = useSegments()
  const handleAdd = () => {
    // if (!labelText) return
    addSegment(labelText)
  }
  const showAdd = !selectedSegment && !clicked
  return (
    <Section>
      <Grid container spacing={2}>
        {clicked && (
          <>
            <Grid
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
              />
            </Grid>
            <Grid
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button onClick={handleAdd}>Add Tag</Button>
            </Grid>
          </>
        )}
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {selectedSegment && (
            <Button color="error" onClick={deleteSegment}>
              Delete
            </Button>
          )}
        </Grid>
      </Grid>
    </Section>
  )
}
