// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { decode, type IAudioData } from '@/modules'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { S3Client } from '@aws-sdk/client-s3'

const fetchFromBucket = async (url: string): Promise<IAudioData> => {
  const filenameExt = url.split('/').pop()
  const filename = filenameExt.split('.').shift()
  const s3 = new S3Client({ region: 'us-west-2' })
  const sttData = await s3.send(
    new GetObjectCommand({
      Bucket: 'ds-stt-bucket',
      Key: `output/json/${filename}.stt.json`,
    })
  )
  const waveData = await s3.send(
    new GetObjectCommand({
      Bucket: 'ds-stt-bucket',
      Key: `output/json/${filename}.waveform.json`,
    })
  )

  const stt = await sttData.Body.transformToString()
  const wave = await waveData.Body.transformToString()
  return {
    stt: JSON.parse(stt),
    waveform: JSON.parse(wave),
    filename,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST')
      return res.status(405).json({ message: 'Method not allowed' })
    const { body } = req
    // const payload = await fetchFromBucket(decode(body.audio_src))
    const payload = await _fetchLocal(decode(body.audio_src))
    res.status(200).json(payload)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const _fetchLocal = async (src: string) => {
  const filenameExt = src.split('/').pop()
  const filename = filenameExt.split('.').shift()
  const stt = (await import(`@/fixtures/${filename}.stt.json`)).default
  const waveform = (await import(`@/fixtures/${filename}.waveform.json`))
    .default
  return {
    stt,
    waveform,
    filename,
  }
}
