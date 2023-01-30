'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AudioDataProvider } from '@/hooks/useAudioData'
import { PeaksProvider } from '@/hooks/usePeaks'
import { SttProvider } from '@/hooks/useStt'
import { SegmentProvider } from '@/hooks/useSegments'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AudioDataProvider>
            <PeaksProvider>
              <SegmentProvider>
                <SttProvider>{children}</SttProvider>
              </SegmentProvider>
            </PeaksProvider>
          </AudioDataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
