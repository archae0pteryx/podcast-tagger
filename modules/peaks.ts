export interface IAudioData {
  stt?: any
  waveform?: any
  filename?: string
}

const encode = (str: string) => Buffer.from(str).toString('base64')
const decode = (str: string) => Buffer.from(str, 'base64').toString('ascii')

export {
  encode,
  decode,
}
