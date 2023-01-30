// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { S3Client } from '@aws-sdk/client-s3'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()
  const { body } = req
  const s3 = new S3Client({ region: 'us-west-2' })
  const sttData = await s3.send(
    new GetObjectCommand({
      Bucket: 'ds-stt-bucket',
      Key: `json/${body}.stt.json`,
    })
  )
  const waveData = await s3.send(
    new GetObjectCommand({
      Bucket: 'ds-stt-bucket',
      Key: `json/${body}.waveform.json`,
    })
  )

  const stt = await sttData.Body.transformToString()
  const wave = await waveData.Body.transformToString()
  res.status(200).json({
    stt: JSON.parse(stt),
    wave: JSON.parse(wave),
  })
}
