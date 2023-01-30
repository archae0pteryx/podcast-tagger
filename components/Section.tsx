import { Paper } from '@mui/material'
import { Box } from '@mui/system'

export const Section = ({ children }) => {
  return (
    <Paper elevation={6}>
      <Box p={2}>{children}</Box>
    </Paper>
  )
}
