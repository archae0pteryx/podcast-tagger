import { Button, Typography, Box, TextField } from '@mui/material'
import { Section } from './Section'
import { useEffect, useMemo, useState } from 'react'

// socket.on('audioData', (data) => {
//   // Play audio data
//   let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
//   let source = audioCtx.createBufferSource()
//   audioCtx.decodeAudioData(data, (buffer) => {
//     source.buffer = buffer
//     source.connect(audioCtx.destination)
//     source.start(0)
//   })
// })

export const SocketInterface = () => {
  const [socket, setSocket] = useState<WebSocket>(null)
  const [sentRequest, setSentRequest] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string>(
    'https://www.grc.com/sn/sn-908.txt'
  )
  const [incomingMessage, setIncomingMessage] = useState<any>(null)
  const [connected, setConnected] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const rawSocket = new WebSocket('ws://localhost:8080/ws')
    rawSocket.onopen = () => {
      console.log('socket connected!')
      setSocket(rawSocket)
      setConnected(true)
    }
    return () => rawSocket.close()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.onmessage = (data) => {
        setSentRequest(false)
        setIncomingMessage(data.data)
      }

      socket.onclose = () => {
        console.log('disconnected')
        setConnected(false)
      }
    }
  }, [socket])

  const handleSubmit = () => {
    if (socket) {
      setSentRequest(true)
      const payload = {
        audio_url: audioUrl
      }
      socket.send(JSON.stringify(payload))
    }
  }

  return (
    <Section>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={3}
      >
        {connected ? (
          <Typography color="lightgreen">connected</Typography>
        ) : (
          <Typography color="error">disconnected</Typography>
        )}
        <TextField
          variant="outlined"
          label="Audio URL"
          fullWidth
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          disabled={sentRequest}
        />
        <Button
          size="large"
          variant="contained"
          color="warning"
          onClick={handleSubmit}
          disabled={sentRequest}
        >
          {sentRequest ? 'Sending...' : 'Send'}
        </Button>
      </Box>
      <Box>
        <Typography>{JSON.stringify(incomingMessage)}</Typography>
      </Box>
    </Section>
  )
}
